import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/api/src/prisma/prisma.service';
import { EvaluationParamDto } from '../teacher.dto';

@Injectable()
export class EvaluationService {
  constructor(private prismaService: PrismaService) {}

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

  async getEvaluation(evaluationParams: EvaluationParamDto) {
    const evaluation = await this.prismaService.evaluation.findFirst({
      select: {
        evaluation_id: true,
        examination_date: true,
        published_at: true,
        anonimated_at: true,
        AnnualCreditUnitSubject: { select: { subject_title: true } },
        AnnualEvaluationSubType: { select: { evaluation_sub_type_name: true } },
      },
      where: evaluationParams,
    });
    if (evaluation) {
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
  }
}
