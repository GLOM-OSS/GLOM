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
      orderBy: { created_at: 'asc' },
      where: { ...params, is_deleted: params?.is_deleted ?? false },
    });
    let examCount = 0,
      assignmentCount = 0;
    return assessments.map(
      (assessment) =>
        new AssessmentEntity({
          ...assessment,
          assessment_name: assessment.is_assignment
            ? `Assignment ${++assignmentCount}`
            : `Exam ${++examCount}`,
        })
    );
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
    const assessmentCount = await this.prismaService.assessment.count({
      where: { is_assignment, annual_subject_id, is_deleted: false },
    });
    return new AssessmentEntity({
      ...assessment,
      assessment_name: assessment.is_assignment
        ? `Assignment ${assessmentCount}`
        : `Exam ${assessmentCount}`,
    });
  }
}
