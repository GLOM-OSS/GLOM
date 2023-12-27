import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { AssessmentEntity, QueryAssessmentDto } from './assessment.dto';

@Injectable()
export class AssessmentsService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll(params?: QueryAssessmentDto) {
    const assessments = await this.prismaService.assessment.findMany({
      where: { ...params, is_deleted: params?.is_deleted ?? false },
    });
    return assessments.map((assessment) => new AssessmentEntity(assessment));
  }
}
