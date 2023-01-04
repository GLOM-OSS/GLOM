import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AssessmentPutDto } from '../teacher.dto';

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

  async getAssessment(assessment_id: string) {
    return this.prismaService.assessment.findUnique({
      where: { assessment_id },
    });
  }

  async updateAssessment(
    assessment_id: string,
    newAssessment: AssessmentPutDto,
    audited_by: string
  ) {
    const assessment = await this.prismaService.assessment.findUnique({
      select: { assessment_date: true, duration: true, is_deleted: true },
      where: { assessment_id },
    });
    await this.prismaService.assessment.update({
      data: {
        ...newAssessment,
        AssessmentAudits: { create: { ...assessment, audited_by: audited_by } },
      },
      where: { assessment_id },
    });
  }
}
