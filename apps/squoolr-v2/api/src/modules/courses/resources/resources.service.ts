import { GlomPrismaService } from '@glom/prisma';
import { QueryCourseDto } from '../course.dto';
import {
  CreateResourceDto,
  ResourceEntity,
  UpdateResourceDto,
} from './resource.dto';
import { ResourceType } from '@prisma/client';
import * as fs from 'fs';
import path = require('path');

export class ResourcesService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll(params?: QueryCourseDto) {
    const resources = await this.prismaService.resource.findMany({
      where: {
        is_deleted: params?.is_deleted ?? false,
        annual_subject_id: params?.annual_subject_id,
        chapter_id: params?.parent_chapter_id ?? null,
      },
    });

    return resources.map((resource) => new ResourceEntity(resource));
  }

  async update(
    resource_id: string,
    payload: UpdateResourceDto,
    audited_by: string
  ) {
    const { resource_name, is_deleted } =
      await this.prismaService.resource.findFirstOrThrow({
        where: { resource_id, is_deleted: false },
      });
    return await this.prismaService.resource.update({
      data: {
        ...payload,
        RessourceAudits: {
          create: {
            is_deleted,
            resource_name,
            AuditedBy: { connect: { annual_teacher_id: audited_by } },
          },
        },
      },
      where: { resource_id },
    });
  }

  async delete(resource_id: string, deleted_by: string) {
    const resource = await this.update(
      resource_id,
      { is_deleted: true },
      deleted_by
    );
    fs.unlinkSync(path.join(__dirname, resource.resource_ref));
  }

  async uploadResources(
    { annual_subject_id, chapter_id }: CreateResourceDto,
    files: Array<Express.Multer.File>,
    uploaded_by: string
  ) {
    return this.prismaService.resource.createMany({
      data: files.map((file) => ({
        chapter_id,
        annual_subject_id,
        created_by: uploaded_by,
        resource_name: file.originalname,
        resource_type: ResourceType.FILE,
        resource_ref: `${process.env.NX_API_BASE_URL}/${file.destination}/${file.filename}`,
      })),
    });
  }

  async deleteMany(resourceIds: string[], deleted_by: string) {
    const resources = await this.prismaService.resource.findMany({
      where: { resource_id: { in: resourceIds }, is_deleted: false },
    });
    await this.prismaService.$transaction([
      this.prismaService.resource.updateMany({
        data: { is_deleted: true },
        where: { resource_id: { in: resourceIds } },
      }),
      this.prismaService.resourceAudit.createMany({
        data: resources.map(({ resource_id, resource_name, is_deleted }) => ({
          is_deleted,
          resource_id,
          resource_name,
          audited_by: deleted_by,
        })),
        skipDuplicates: true,
      }),
    ]);
  }
}
