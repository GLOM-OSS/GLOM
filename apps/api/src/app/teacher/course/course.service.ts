import { Injectable } from '@nestjs/common';
import { EvaluationSubTypeEnum } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prismaService: PrismaService) {}

  async findAll(academic_year_id: string, annual_teacher_id: string) {
    const subects = await this.prismaService.annualCreditUnitSubject.findMany({
      select: {
        annual_credit_unit_subject_id: true,
        subject_title: true,
        subject_code: true,
        Chapters: {
          select: { chapter_id: true },
        },
        Evaluations: {
          select: {
            published_at: true,
            examination_date: true,
            EvaluationHasStudents: {
              select: { evaluation_has_student_id: true },
            },
            AnnualEvaluationSubType: {
              select: { evaluation_sub_type_name: true },
            },
          },
        },
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
                    AnnualCreditUnitSubjects: {
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
            academic_year_id,
            Classroom: {
              major_id,
              level: Math.ceil(semester_number / 2),
            },
          })
        ),
      },
    });

    const activeYear = await this.prismaService.academicYear.findUnique({
      where: { academic_year_id },
    });
    const courses = subects.map(
      ({
        Chapters,
        Evaluations,
        subject_code,
        subject_title,
        annual_credit_unit_subject_id,
      }) => {
        const classroomAcronyms = classrooms
          .filter(
            ({
              Classroom: {
                Major: { AnnualCreditUnits },
              },
            }) =>
              AnnualCreditUnits.find(({ AnnualCreditUnitSubjects }) =>
                AnnualCreditUnitSubjects.find(
                  (_) => _.subject_code === subject_code
                )
              )
          )
          .map(({ classroom_acronym }) => classroom_acronym);
        const resitEvaluation = Evaluations.find(
          ({ AnnualEvaluationSubType: { evaluation_sub_type_name } }) =>
            evaluation_sub_type_name === EvaluationSubTypeEnum.RESIT
        );

        return {
          annual_credit_unit_subject_id,
          subject_code,
          subject_title,
          classroomAcronyms,
          has_course_plan: Chapters.length > 0,
          is_ca_available: Boolean(
            Evaluations.find(
              ({ AnnualEvaluationSubType: { evaluation_sub_type_name } }) =>
                evaluation_sub_type_name === EvaluationSubTypeEnum.CA
            )?.published_at
          ),
          is_exam_available: Boolean(
            Evaluations.find(
              ({ AnnualEvaluationSubType: { evaluation_sub_type_name } }) =>
                evaluation_sub_type_name === EvaluationSubTypeEnum.EXAM
            )?.published_at
          ),
          is_resit_available: Boolean(
            activeYear.ended_at ?? resitEvaluation
              ? (new Date(resitEvaluation.examination_date) < new Date() &&
                  resitEvaluation.EvaluationHasStudents.length === 0) ??
                  resitEvaluation.published_at
              : false
          ),
        };
      }
    );
    return courses;
  }
}
