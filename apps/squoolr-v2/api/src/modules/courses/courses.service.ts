import { GlomPrismaService } from '@glom/prisma';
import { QueryCourseSubjectDto } from './subjects/subject.dto';
import { CourseEntity } from './course.dto';

export class CoursesService {
  constructor(private prismaService: GlomPrismaService) {}

  async getCourses(params?: QueryCourseSubjectDto) {
    const annualSubjects = await this.prismaService.annualSubject.findMany({
      include: {
        AnnualModuleHasSubjects: {
          select: {
            objective: true,
            AnnualModule: {
              select: {
                AnnualClassroom: {
                  select: {
                    classroom_level: true,
                    AnnualMajor: { select: { major_acronym: true } },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        AnnualSubjectParts: params?.annual_teacher_id
          ? { some: { annual_teacher_id: params?.annual_teacher_id } }
          : undefined,
      },
    });
    return annualSubjects.map(
      ({
        subject_code,
        subject_name,
        annual_subject_id,
        AnnualModuleHasSubjects: subjects,
      }) => {
        const hasUnsetObjective = subjects.some(
          (subject) => !subject.objective
        );
        const classroomAcronyms: string[] = [];
        subjects.forEach(
          ({
            AnnualModule: {
              AnnualClassroom: {
                classroom_level,
                AnnualMajor: { major_acronym },
              },
            },
          }) => {
            const classroomAcronym = `${major_acronym}-${classroom_level}`;
            if (!classroomAcronyms.includes(classroomAcronym))
              classroomAcronyms.push(classroomAcronym);
          }
        );
        return new CourseEntity({
          subject_code,
          subject_name,
          annual_subject_id,
          objective: hasUnsetObjective ? null : subjects[0].objective,
          classrooms: classroomAcronyms.map((classroom_acronym) => ({
            classroom_acronym,
          })),
        });
      }
    );
  }
}
