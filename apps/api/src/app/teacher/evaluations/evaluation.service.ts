import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/api/src/prisma/prisma.service';

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
}
