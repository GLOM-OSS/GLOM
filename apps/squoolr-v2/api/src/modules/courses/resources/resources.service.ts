import { GlomPrismaService } from '@glom/prisma';
import { QueryCourseDto } from '../course.dto';
import {
  CreateResourceDto,
  ResourceEntity,
  UpdateResourceDto,
} from './resource.dto';
import { ResourceType } from '@prisma/client';

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
    await this.prismaService.resource.update({
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

  delete(resource_id: string, deleted_by: string) {
    return this.update(resource_id, { is_deleted: true }, deleted_by);
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
        resource_ref: file.filename,
        resource_name: file.originalname,
        resource_type: ResourceType.FILE,
        created_by: uploaded_by,
      })),
    });
  }
}
