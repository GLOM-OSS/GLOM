import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AssessmentService {
  constructor(private prismaService: PrismaService) {}

  async createAssessment(
    annual_credit_unit_subject_id: string,
    created_by: string
  ) {
    return this.prismaService.assessment.create({
      data: {
        AnnualCreditUnitSubject: { connect: { annual_credit_unit_subject_id } },
        AnnualTeacher: { connect: { annual_teacher_id: created_by } },
      },
    });
  }
}
