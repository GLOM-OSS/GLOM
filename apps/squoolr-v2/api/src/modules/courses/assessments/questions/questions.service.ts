import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import {
  CreateQuestionDto,
  QueryQuestionsDto,
  QuestionEntity,
  QuestionOptionDto,
  QuestionResourceDto,
} from './question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll(params?: QueryQuestionsDto) {
    const questions = await this.prismaService.question.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        QuestionOptions: { where: { is_deleted: true } },
        QuestionResources: { where: { deleted_at: null } },
      },
      where: {
        is_deleted: params?.is_deleted ?? false,
        assessment_id: params?.assessment_id,
        question_type: params?.question_type,
      },
    });
    return questions.map(
      ({
        QuestionOptions: options,
        QuestionResources: resources,
        ...question
      }) =>
        new QuestionEntity({
          ...question,
          resources: resources.map(
            (resource) => new QuestionResourceDto(resource)
          ),
          options: options.map((option) => new QuestionOptionDto(option)),
        })
    );
  }

  async create(
    {
      assessment_id,
      options,
      question,
      question_mark,
      question_type,
      question_answer,
    }: CreateQuestionDto,
    files: Array<Express.Multer.File>,
    created_by: string
  ) {
    const resources = files.filter((_) => _.fieldname === 'answerFile');
    const {
      QuestionOptions: newOptions,
      QuestionResources: newResources,
      ...newQuestion
    } = await this.prismaService.question.create({
      include: {
        QuestionOptions: { where: { is_deleted: true } },
        QuestionResources: { where: { deleted_at: null } },
      },
      data: {
        question,
        question_mark,
        question_type,
        question_answer: question_answer
          ? question_answer
          : resources
              .map(
                (_) =>
                  `${process.env.NX_API_BASE_URL}/${_.destination}/${_.filename}`
              )
              .join(','),
        Assessment: { connect: { assessment_id } },
        CreatedBy: { connect: { annual_teacher_id: created_by } },
        QuestionOptions: {
          createMany: {
            data: options.map((option) => ({ ...option, created_by })),
            skipDuplicates: true,
          },
        },
        QuestionResources: {
          createMany: {
            data: resources.map((file, index) => ({
              created_by,
              caption: index + 1,
              resource_ref: `${process.env.NX_API_BASE_URL}/${file.destination}/${file.filename}`,
            })),
            skipDuplicates: true,
          },
        },
      },
    });
    return new QuestionEntity({
      ...newQuestion,
      options: newOptions.map((option) => new QuestionOptionDto(option)),
      resources: newResources.map(
        (resource) => new QuestionResourceDto(resource)
      ),
    });
  }
}
