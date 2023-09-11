import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  EvaluationHasStudent,
  EvaluationSubTypeEnum,
  Prisma,
} from '@prisma/client';
import { CodeGeneratorService } from 'apps/api/src/utils/code-generator';
import { AUTH404, ERR13, ERR15, ERR16 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  EvaluationQueryDto,
  EvaluationsQeuryDto,
  StudentMark,
} from '../teacher.dto';

@Injectable()
export class EvaluationService {
  private evaluationSelect = Prisma.validator<Prisma.EvaluationSelect>()({
    evaluation_id: true,
    examination_date: true,
    published_at: true,
    anonimated_at: true,
    AnnualCreditUnitSubject: { select: { subject_title: true } },
    AnnualEvaluationSubType: { select: { evaluation_sub_type_name: true } },
  });
  private evaluationHasStudentSelect =
    Prisma.validator<Prisma.EvaluationHasStudentSelect>()({
      evaluation_has_student_id: true,
      anonymity_code: true,
      mark: true,
      created_at: true,
      annual_student_id: true,
      EvaluationHasStudentAudits: {
        take: 1,
        select: { audited_at: true },
        orderBy: { audited_at: 'desc' },
      },
      AnnualStudent: {
        select: {
          Student: {
            select: {
              matricule: true,
              Login: {
                select: {
                  Person: { select: { first_name: true, last_name: true } },
                },
              },
            },
          },
        },
      },
    });
  constructor(
    private prismaService: PrismaService,
    private codeGenerator: CodeGeneratorService
  ) {}

  private transformEvaluation(evaluation: {
    anonimated_at: Date;
    published_at: Date;
    evaluation_id: string;
    examination_date: Date;
    AnnualCreditUnitSubject: {
      subject_title: string;
    };
    AnnualEvaluationSubType: {
      evaluation_sub_type_name: EvaluationSubTypeEnum;
    };
  }) {
    const {
      anonimated_at,
      published_at,
      evaluation_id,
      examination_date,
      AnnualCreditUnitSubject: { subject_title },
      AnnualEvaluationSubType: { evaluation_sub_type_name },
    } = evaluation;
    return {
      evaluation_id,
      examination_date,
      subject_title,
      evaluation_sub_type_name,
      is_published: Boolean(published_at),
      is_anonimated: Boolean(anonimated_at),
    };
  }

  async getEvaluation(
    evaluationParams: EvaluationQueryDto | { evaluation_id: string }
  ) {
    const evaluation = await this.prismaService.evaluation.findFirst({
      select: this.evaluationSelect,
      where: evaluationParams,
    });
    if (!evaluation)
      throw new HttpException(
        JSON.stringify(AUTH404('Evaluation')),
        HttpStatus.NOT_FOUND
      );
    return this.transformEvaluation(evaluation);
  }

  async getEvaluations({
    major_code,
    semester_number,
    annual_credit_unit_id,
    annual_credit_unit_subject_id,
  }: EvaluationsQeuryDto) {
    const evaluations = await this.prismaService.evaluation.findMany({
      select: this.evaluationSelect,
      where: {
        AnnualCreditUnitSubject: {
          annual_credit_unit_subject_id,
          AnnualCreditUnit: {
            semester_number,
            annual_credit_unit_id,
            Major: { major_code },
          },
        },
      },
    });
    return evaluations
      .filter(
        ({ anonimated_at, published_at }) => !anonimated_at && !published_at
      )
      .map((evaluation) => this.transformEvaluation(evaluation));
  }

  async getEvaluationSubTypes(academic_year_id: string) {
    const evaluationSubjectType =
      await this.prismaService.annualEvaluationSubType.findMany({
        select: {
          evaluation_sub_type_name: true,
          annual_evaluation_sub_type_id: true,
          EvaluationType: { select: { evaluation_type: true } },
        },
        where: {
          academic_year_id,
          evaluation_sub_type_name: { in: ['CA', 'EXAM', 'RESIT'] },
        },
      });
    return evaluationSubjectType.map(
      ({ EvaluationType: { evaluation_type }, ...subTypes }) => ({
        evaluation_type,
        ...subTypes,
      })
    );
  }

  async getEvaluationHasStudents(evaluation_id: string) {
    const {
      AnnualCreditUnitSubject: { annual_credit_unit_subject_id },
    } = await this.prismaService.evaluation.findUniqueOrThrow({
      select: {
        AnnualCreditUnitSubject: {
          select: { annual_credit_unit_subject_id: true },
        },
      },
      where: { evaluation_id },
    });
    const annualStudents = await this.prismaService.annualStudent.findMany({
      select: {
        annual_student_id: true,
        Student: {
          select: {
            matricule: true,
            Login: {
              select: {
                Person: { select: { first_name: true, last_name: true } },
              },
            },
          },
        },
      },
      where: {
        AnnualStudentHasCreditUnits: {
          some: {
            AnnualCreditUnit: {
              AnnualCreditUnitSubjects: {
                some: { annual_credit_unit_subject_id },
              },
            },
          },
        },
      },
    });

    const evaluationHasStudents =
      await this.prismaService.evaluationHasStudent.findMany({
        select: this.evaluationHasStudentSelect,
        where: { evaluation_id, is_editable: true },
      });
    const newStudents = annualStudents.filter(
      (_) =>
        !evaluationHasStudents.find(
          ({ annual_student_id }) => _.annual_student_id === annual_student_id
        )
    );
    await this.prismaService.evaluationHasStudent.createMany({
      data: newStudents.map(({ annual_student_id }) => ({
        evaluation_id,
        annual_student_id,
        anonymity_code: this.codeGenerator.getAnonymityCode(),
      })),
    });
    const newEvaluationHasStudents =
      await this.prismaService.evaluationHasStudent.findMany({
        select: this.evaluationHasStudentSelect,
        where: { evaluation_id, is_editable: true },
      });
    return newEvaluationHasStudents.map(
      ({
        evaluation_has_student_id,
        anonymity_code,
        mark,
        created_at,
        EvaluationHasStudentAudits: lastAudits,
        AnnualStudent: {
          Student: {
            matricule,
            Login: {
              Person: { first_name, last_name },
            },
          },
        },
      }) => ({
        mark,
        matricule,
        anonymity_code,
        evaluation_has_student_id,
        fullname: `${first_name} ${last_name}`,
        last_updated:
          lastAudits.length === 0 ? created_at : lastAudits[0].audited_at,
      })
    );
  }

  async updateEvaluation(
    evaluation_id: string,
    {
      anonimated_at,
      examination_date,
      published_at,
    }: { anonimated_at?: Date; examination_date?: Date; published_at?: Date },
    audited_by: string
  ) {
    const evaluation = await this.prismaService.evaluation.findFirst({
      select: {
        examination_date: true,
        anonimated_at: true,
        annual_credit_unit_subject_id: true,
        AnnualEvaluationSubType: { select: { evaluation_sub_type_name: true } },
      },
      where: {
        evaluation_id,
        ...(anonimated_at
          ? {}
          : {
              AnnualCreditUnitSubject: {
                AnnualCreditUnitHasSubjectParts: {
                  some: { annual_teacher_id: audited_by },
                },
              },
            }),
      },
    });
    if (!evaluation)
      throw new HttpException(
        JSON.stringify(AUTH404('Evaluation')),
        HttpStatus.NOT_FOUND
      );
    const {
      annual_credit_unit_subject_id,
      AnnualEvaluationSubType: { evaluation_sub_type_name: sub_type },
    } = evaluation;
    if (
      anonimated_at &&
      sub_type === EvaluationSubTypeEnum.RESIT &&
      !evaluation.examination_date
    )
      throw new HttpException(JSON.stringify(ERR15), HttpStatus.EARLYHINTS);

    if (
      published_at &&
      (sub_type === EvaluationSubTypeEnum.RESIT ||
        sub_type === EvaluationSubTypeEnum.EXAM) &&
      !evaluation.anonimated_at
    )
      throw new HttpException(JSON.stringify(ERR16), HttpStatus.EARLYHINTS);
    const annualStudents = await this.prismaService.annualStudent.findMany({
      where: {
        AnnualStudentHasCreditUnits: {
          some: {
            AnnualCreditUnit: {
              AnnualCreditUnitSubjects: {
                some: { annual_credit_unit_subject_id },
              },
            },
          },
        },
      },
    });

    await this.prismaService.evaluation.update({
      data: {
        ...(anonimated_at
          ? {
              anonimated_at: new Date(anonimated_at),
              anonimated_by: audited_by,
              EvaluationHasStudents: {
                createMany: {
                  data: annualStudents.map(({ annual_student_id }) => ({
                    annual_student_id,
                    anonymity_code: this.codeGenerator.getAnonymityCode(),
                  })),
                },
              },
            }
          : {}),
        ...(published_at
          ? { published_at: new Date(published_at), published_by: audited_by }
          : {}),
        ...(examination_date
          ? {
              examination_date,
              EvaluationAudits: {
                create: {
                  audited_by,
                  examination_date: evaluation.examination_date,
                },
              },
            }
          : {}),
      },
      where: { evaluation_id },
    });
  }

  async saveEvaluationMarks(studentMarks: StudentMark[], audited_by: string) {
    const evaluationHasStudents =
      await this.prismaService.evaluationHasStudent.findMany({
        where: {
          OR: studentMarks.map(({ evaluation_has_student_id }) => ({
            evaluation_has_student_id,
          })),
        },
      });
    if (evaluationHasStudents.length !== studentMarks.length)
      throw new HttpException(JSON.stringify(ERR13), HttpStatus.NOT_FOUND);
    await this.updateStudentsMarks(
      studentMarks,
      evaluationHasStudents,
      audited_by
    );
  }

  async resetEvaluationMarks(evaluation_id: string, audited_by: string) {
    const evaluationHasStudents =
      await this.prismaService.evaluationHasStudent.findMany({
        where: { evaluation_id },
      });
    const studentMarks = evaluationHasStudents.map(
      ({ evaluation_has_student_id }) => ({
        evaluation_has_student_id,
        mark: null,
      })
    );
    await this.updateStudentsMarks(
      studentMarks,
      evaluationHasStudents,
      audited_by
    );
  }

  async updateStudentsMarks(
    studentMarks: StudentMark[],
    evaluationHasStudents: EvaluationHasStudent[],
    audited_by: string
  ) {
    const evaluationHasStudentAudits = evaluationHasStudents.map(
      ({ evaluation_has_student_id, mark, is_deleted, is_editable }) => ({
        mark,
        is_deleted,
        is_editable,
        audited_by,
        evaluation_has_student_id,
      })
    );
    return this.prismaService.$transaction([
      ...studentMarks.map(({ evaluation_has_student_id, mark }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { evaluation_has_student_id: _, ...auditData } =
          evaluationHasStudentAudits.find(
            ({ evaluation_has_student_id: id }) =>
              id === evaluation_has_student_id
          );
        return this.prismaService.evaluationHasStudent.update({
          data: {
            mark,
            EvaluationHasStudentAudits: {
              create: {
                ...auditData,
              },
            },
          },
          where: { evaluation_has_student_id },
        });
      }),
    ]);
  }
}
