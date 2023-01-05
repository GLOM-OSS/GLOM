import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ChapterPostDto } from '../course.dto';

@Injectable()
export class ChapterService {
  constructor(private prismaService: PrismaService) {}

  async findOne(chapter_id: string) {
    return this.prismaService.chapter.findUnique({
      select: {
        chapter_title: true,
        chapter_objective: true,
        annual_credit_unit_subject_id: true,
        chapter_position: true,
        chapter_parent_id: true,
      },
      where: { chapter_id },
    });
  }

  async findResources(chapter_id: string) {
    return this.prismaService.resource.findMany({
      select: {
        resource_id: true,
        chapter_id: true,
        resource_ref: true,
        resource_type: true,
        resource_name: true,
        resource_extension: true,
        annual_credit_unit_subject_id: true,
      },
      where: { chapter_id, is_deleted: false },
    });
  }

  async findChapterParts(chapter_parent_id: string) {
    return this.prismaService.chapter.findMany({
      select: {
        chapter_id: true,
        chapter_title: true,
        chapter_objective: true,
        chapter_position: true,
        chapter_parent_id: true,
        annual_credit_unit_subject_id: true,
      },
      where: { chapter_parent_id, is_deleted: false },
    });
  }

  async findChapterAssessment(chapter_id: string) {
    const assessment = await this.prismaService.assessment.findFirst({
      include: {
        Evaluation: {
          select: {
            AnnualEvaluationSubType: {
              select: { evaluation_sub_type_name: true },
            },
          },
        },
      },
      where: { chapter_id, is_deleted: false },
    });
    if (assessment) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        is_deleted,
        Evaluation,
        ...data
      } = assessment;
      return {
        evaluation_sub_type_name:
          Evaluation?.AnnualEvaluationSubType?.evaluation_sub_type_name ?? null,
        ...data,
      };
    }
    return null;
  }

  async create(
    {
      chapter_parent_id,
      annual_credit_unit_subject_id,
      ...newChapter
    }: ChapterPostDto,
    created_by: string
  ) {
    return this.prismaService.chapter.create({
      data: {
        ...newChapter,
        AnnualTeacher: { connect: { annual_teacher_id: created_by } },
        AnnualCreditUnitSubject: { connect: { annual_credit_unit_subject_id } },
        ...(chapter_parent_id
          ? { ChapterParent: { connect: { chapter_id: chapter_parent_id } } }
          : {}),
        Assessment: {
          create: {
            AnnualCreditUnitSubject: {
              connect: { annual_credit_unit_subject_id },
            },
            AnnualTeacher: { connect: { annual_teacher_id: created_by } },
          },
        },
      },
    });
  }
}
