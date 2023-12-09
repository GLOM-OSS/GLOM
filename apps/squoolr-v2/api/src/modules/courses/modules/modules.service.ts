import { GlomPrismaService } from '@glom/prisma';
import { QueryCourseDto } from '../course.dto';
import { ModuleEntity } from './module.dto';

export class CourseModulesService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll(params?: QueryCourseDto) {
    const semesters = params?.semesters ?? [];
    const annualModules = await this.prismaService.annualModule.findMany({
      where: {
        is_deleted: params?.is_deleted,
        semester_number: {
          [semesters.length > 0 ? 'in' : 'notIn']: params?.semesters,
        },
      },
    });
    return annualModules.map((annualModule) => new ModuleEntity(annualModule));
  }
}
