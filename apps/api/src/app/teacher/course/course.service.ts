import { PrismaService } from '../../../prisma/prisma.service';

export class CourseService {
  constructor(private prismaService: PrismaService) {}

  async findAll(academic_year_id: string, annual_teacher_id: string) {
    const subects = await this.prismaService.annualCreditUnitSubject.findMany({
      select: {
        annual_credit_unit_subject_id: true,
        subject_title: true,
        subject_code: true,
        AnnualCreditUnit: {
          select: {
            semester_number: true,
            Major: { select: { major_id: true, major_acronym: true } },
          },
        },
      },
      where: { AnnualTeacher: { annual_teacher_id } },
    });

    const classrooms = await this.prismaService.annualClassroom.findMany({
      select: {
        classroom_acronym: true,
        Classroom: {
          select: {
            level: true,
            Major: {
              select: {
                major_id: true,
                AnnualCreditUnits: {
                  select: {
                    AnnualCreditUnitHasSubjects: {
                      select: { subject_code: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        OR: subects.map(
          ({
            AnnualCreditUnit: {
              Major: { major_id },
              semester_number,
            },
          }) => ({
            Classroom: {
              academic_year_id,
              major_id,
              level: Math.ceil(semester_number / 2),
            },
          })
        ),
      },
    });

    const courses = subects.map(
      ({
        subject_code,
        ...subject
      }) => {
        const classroomAcronyms = classrooms
          .filter(
            ({
              Classroom: {
                Major: { AnnualCreditUnits },
              },
            }) =>
              AnnualCreditUnits.find(({ AnnualCreditUnitHasSubjects }) =>
                AnnualCreditUnitHasSubjects.find(
                  (_) => _.subject_code === subject_code
                )
              )
          )
          .map(({ classroom_acronym }) => classroom_acronym);
        return { ...subject, classroomAcronyms };
      }
    );
    return courses;
  }
}
