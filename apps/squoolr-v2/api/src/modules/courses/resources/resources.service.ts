import { GlomPrismaService } from '@glom/prisma';
import { QueryCourseDto } from '../course.dto';
import { ResourceEntity, UpdateResourceDto } from './resource.dto';

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
}
