import { Prisma } from '@prisma/client';
import { CourseEntity } from './course.dto';

export class CourseArgsFactory {
  static getIncludeArgs = () =>
    Prisma.validator<Prisma.AnnualSubjectInclude>()({
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
    });

  private static includeArgs = CourseArgsFactory.getIncludeArgs();
  static getCourseEntity = ({
    subject_code,
    subject_name,
    annual_subject_id,
    AnnualModuleHasSubjects: subjects,
  }: Prisma.AnnualSubjectGetPayload<{
    include: typeof CourseArgsFactory.includeArgs;
  }>) => {
    const hasUnsetObjective = subjects.some((subject) => !subject.objective);
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
  };
}
