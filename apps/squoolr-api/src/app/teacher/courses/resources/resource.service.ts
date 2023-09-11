import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResourceType } from '@prisma/client';
import { randomUUID } from 'crypto';
import { AUTH404 } from '../../../../errors';
import { PrismaService } from '../../../../prisma/prisma.service';
import { LinkPostDto } from '../course.dto';

@Injectable()
export class ResourceService {
  constructor(private prismaService: PrismaService) {}

  async createResource(
    resource_type: ResourceType,
    resources: LinkPostDto[],
    created_by: string
  ) {
    const reseourceCreateData = resources.map(
      ({ annual_credit_unit_subject_id, chapter_id, ...newResource }) => ({
        ...newResource,
        chapter_id,
        created_by,
        resource_type,
        resource_id: randomUUID(),
        annual_credit_unit_subject_id,
      })
    );
    await this.prismaService.resource.createMany({
      data: reseourceCreateData,
    });
    return this.prismaService.resource.findMany({
      select: {
        resource_id: true,
        chapter_id: true,
        resource_ref: true,
        resource_type: true,
        resource_name: true,
        resource_extension: true,
        annual_credit_unit_subject_id: true,
      },
      where: {
        OR: reseourceCreateData.map(({ resource_id }) => ({ resource_id })),
      },
    });
  }

  async deleteResource(resource_id: string, deleted_by: string) {
    const resource = await this.prismaService.resource.findFirst({
      select: {
        resource_extension: true,
        resource_name: true,
        resource_ref: true,
        resource_type: true,
        is_deleted: true,
      },
      where: { resource_id, is_deleted: false },
    });
    if (!resource)
      throw new HttpException(
        JSON.stringify(AUTH404('Resource')),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    await this.prismaService.resource.update({
      data: {
        is_deleted: true,
        RessourceAudits: {
          create: {
            ...resource,
            AnnualTeacher: { connect: { annual_teacher_id: deleted_by } },
          },
        },
      },
      where: { resource_id },
    });
  }

  async getResource(resource_id: string) {
    return this.prismaService.resource.findUnique({ where: { resource_id } });
  }
}
