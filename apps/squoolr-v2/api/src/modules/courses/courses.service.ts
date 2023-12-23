import { GlomPrismaService } from '@glom/prisma';
import { CourseArgsFactory } from './course-args.factory';
import { QueryCourseSubjectDto } from './subjects/subject.dto';

export class CoursesService {
  constructor(private prismaService: GlomPrismaService) {}

  async getCourses(params?: QueryCourseSubjectDto) {
    const annualSubjects = await this.prismaService.annualSubject.findMany({
      include: CourseArgsFactory.getIncludeArgs(),
      where: {
        AnnualSubjectParts: params?.annual_teacher_id
          ? { some: { annual_teacher_id: params?.annual_teacher_id } }
          : undefined,
      },
    });
    return annualSubjects.map((annualSubject) =>
      CourseArgsFactory.getCourseEntity(annualSubject)
    );
  }

  async getCourse(annual_subject_id: string) {
    const annualSubject =
      await this.prismaService.annualSubject.findFirstOrThrow({
        include: CourseArgsFactory.getIncludeArgs(),
        where: {
          annual_subject_id,
          AnnualModuleHasSubjects: { some: { is_deleted: false } },
        },
      });
    return CourseArgsFactory.getCourseEntity(annualSubject);
  }
}
