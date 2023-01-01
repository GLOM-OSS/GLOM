import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EvaluationSubTypeEnum } from '@prisma/client';
import { AUTH404 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { EvaluationQueryDto, EvaluationsQeuryDto } from '../teacher.dto';

@Injectable()
export class EvaluationService {
  private evaluationSelect = {
    evaluation_id: true,
    examination_date: true,
    published_at: true,
    anonimated_at: true,
    AnnualCreditUnitSubject: { select: { subject_title: true } },
    AnnualEvaluationSubType: { select: { evaluation_sub_type_name: true } },
  };
  constructor(private prismaService: PrismaService) {}

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
    major_id,
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
            semester_number: Number(semester_number),
            annual_credit_unit_id,
            major_id,
          },
        },
      },
    });
    return evaluations.map((evaluation) =>
      this.transformEvaluation(evaluation)
    );
  }

  async getEvaluationSubTypes(academic_year_id: string) {
    return this.prismaService.annualEvaluationSubType.findMany({
      select: {
        evaluation_sub_type_name: true,
        annual_evaluation_sub_type_id: true,
      },
      where: {
        academic_year_id,
        evaluation_sub_type_name: { in: ['CA', 'EXAM', 'RESIT'] },
      },
    });
  }

  async getEvaluationHasStudents(
    evaluation_id: string,
    useAnonymityCode: boolean
  ) {
    const evaluationHasStudents =
      await this.prismaService.evaluationHasStudent.findMany({
        select: {
          evaluation_has_student_id: true,
          anonymity_code: true,
          mark: true,
          created_at: true,
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
        },
        where: { evaluation_id, is_editable: true },
      });
    return evaluationHasStudents.map(
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
      }) =>
        useAnonymityCode
          ? {
              evaluation_has_student_id,
              anonymity_code,
              mark,
              last_updated:
                lastAudits.length === 0 ? created_at : lastAudits[0].audited_at,
            }
          : {
              mark,
              matricule,
              evaluation_has_student_id,
              fullname: `${first_name} ${last_name}`,
              last_updated:
                lastAudits.length === 0 ? created_at : lastAudits[0].audited_at,
            }
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
      where: {
        evaluation_id,
        AnnualCreditUnitSubject: {
          AnnualCreditUnitHasSubjectParts: {
            some: { annual_teacher_id: audited_by },
          },
        },
      },
    });
    if (!evaluation)
      throw new HttpException(
        JSON.stringify(AUTH404('Evaluation')),
        HttpStatus.NOT_FOUND
      );
    await this.prismaService.evaluation.update({
      data: {
        ...(anonimated_at
          ? {
              anonimated_at: new Date(anonimated_at),
              anonimated_by: audited_by,
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
}
