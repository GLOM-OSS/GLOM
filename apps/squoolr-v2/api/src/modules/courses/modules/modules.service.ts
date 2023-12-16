import { GlomPrismaService } from '@glom/prisma';
import { QueryCourseDto } from '../course.dto';
import { CourseModuleEntity } from './module.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseModulesService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll(params?: QueryCourseDto) {
    const semesters = params?.semesters ?? [];
    const annualModules = await this.prismaService.annualModule.findMany({
      where: {
        is_deleted: params?.is_deleted,
        annual_classroom_id: params?.annual_classroom_id,
        semester_number:
          semesters.length > 0 ? { in: params?.semesters } : undefined,
      },
    });
    return annualModules.map(
      (annualModule) => new CourseModuleEntity(annualModule)
    );
  }
}
