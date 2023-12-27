import { GlomPrismaService } from '@glom/prisma';
import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  AssessmentEntity,
  CreateAssessmentDto,
  PublishAssessmentDto,
  QueryAssessmentDto,
} from './assessment.dto';
import { excludeKeys, pickKeys } from '@glom/utils';

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

  async publish(
    assessment_id: string,
    {
      assessment_date,
      duration,
      number_per_group,
      submission_type,
    }: PublishAssessmentDto,
    published_by: string
  ) {
    if (new Date(assessment_date).getTime() <= Date.now())
      throw new UnprocessableEntityException(
        'Assessment date must be a future date'
      );
    const assessment = await this.prismaService.assessment.findFirstOrThrow({
      where: { assessment_id, is_deleted: false },
    });
    if (assessment.is_published)
      throw new UnprocessableEntityException(
        'Assessment was published already !'
      );
    if (assessment.is_assignment && duration)
      throw new BadRequestException("Assignments don't have duration");
    if (!assessment.is_assignment && (number_per_group || submission_type))
      throw new BadRequestException(
        '`number_per_group` and `submission_type` are only valid for Assignments'
      );

    await this.prismaService.assessment.update({
      data: {
        duration,
        assessment_date,
        number_per_group,
        submission_type,
        AssessmentAudits: {
          create: {
            ...excludeKeys(assessment, [
              'annual_subject_id',
              'assessment_id',
              'chapter_id',
              'created_at',
              'created_by',
            ]),
            AuditedBy: { connect: { annual_teacher_id: published_by } },
          },
        },
      },
      where: { assessment_id },
    });
  }
}
