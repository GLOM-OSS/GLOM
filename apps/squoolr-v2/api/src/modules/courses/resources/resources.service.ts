import { GlomPrismaService } from '@glom/prisma';
import { QueryCourseDto } from '../course.dto';
import { ResourceEntity } from './resource.dto';

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
}
