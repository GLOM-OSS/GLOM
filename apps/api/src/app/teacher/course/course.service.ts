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
        objective: true,
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
        objective,
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
          objective,
          subject_code,
          subject_title,
          classroomAcronyms,
          annual_credit_unit_subject_id,
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

  async findOne(annual_credit_unit_subject_id: string) {
    const classrooms = await this.prismaService.annualClassroom.findMany({
      select: {
        classroom_acronym: true,
        Classroom: {
          select: {
            level: true,
            Major: {
              select: {
                AnnualCreditUnits: { select: { semester_number: true } },
              },
            },
          },
        },
      },
      where: {
        Classroom: {
          Major: {
            AnnualCreditUnits: {
              some: {
                AnnualCreditUnitSubjects: {
                  some: { annual_credit_unit_subject_id },
                },
              },
            },
          },
        },
      },
    });
    const annualCreditUnitSubject =
      await this.prismaService.annualCreditUnitSubject.findUnique({
        select: {
          objective: true,
          annual_credit_unit_id: true,
          subject_code: true,
          subject_title: true,
        },
        where: { annual_credit_unit_subject_id },
      });
    return {
      ...annualCreditUnitSubject,
      classroomAcronyms: classrooms
        .filter(
          ({
            Classroom: {
              level,
              Major: { AnnualCreditUnits },
            },
          }) =>
            AnnualCreditUnits.find(
              (_) => Math.ceil(_.semester_number / 2) === level
            )
        )
        .map((_) => _.classroom_acronym),
    };
  }

  async findResources(annual_credit_unit_subject_id: string) {
    return this.prismaService.resource.findMany({
      select: {
        annual_credit_unit_subject_id: true,
        resource_extension: true,
        resource_name: true,
        resource_ref: true,
        resource_type: true,
        resource_id: true,
        chapter_id: true,
      },
      where: { annual_credit_unit_subject_id, is_deleted: false },
    });
  }
}
