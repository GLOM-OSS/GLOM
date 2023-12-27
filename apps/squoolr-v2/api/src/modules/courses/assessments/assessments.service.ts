import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import {
  AssessmentEntity,
  CreateAssessmentDto,
  QueryAssessmentDto,
} from './assessment.dto';

@Injectable()
export class AssessmentsService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll(params?: QueryAssessmentDto) {
    const assessments = await this.prismaService.assessment.findMany({
      where: { ...params, is_deleted: params?.is_deleted ?? false },
    });
    return assessments.map((assessment) => new AssessmentEntity(assessment));
  }

  async create(
    { annual_subject_id, chapter_id, is_assignment }: CreateAssessmentDto,
    created_by: string
  ) {
    const assessment = await this.prismaService.assessment.create({
      data: {
        is_assignment,
        AnnualSubject: { connect: { annual_subject_id } },
        Chapter: chapter_id ? { connect: { chapter_id } } : undefined,
        CreatedBy: { connect: { annual_teacher_id: created_by } },
      },
    });
    return new AssessmentEntity(assessment);
  }
}
