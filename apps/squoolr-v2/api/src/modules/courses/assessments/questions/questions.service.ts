import { GlomPrismaService } from '@glom/prisma';
import { excludeKeys, pickKeys } from '@glom/utils';
import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  CreateQuestionDto,
  QueryQuestionsDto,
  QuestionEntity,
  QuestionOptionDto,
  QuestionResourceDto,
  UpdateQuestionDto,
} from './question.dto';
import * as fs from 'fs';
import path = require('path');

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

  async update(
    question_id: string,
    {
      options: optionsPayload,
      deletedResourceIds,
      delete: deleteQuestion,
      ...payload
    }: UpdateQuestionDto & { delete?: boolean },
    files: Array<Express.Multer.File>,
    audited_by: string
  ) {
    const {
      QuestionOptions: options,
      QuestionResources: resources,
      ...question
    } = await this.prismaService.question.findUniqueOrThrow({
      include: {
        QuestionOptions:
          optionsPayload?.deleted || optionsPayload?.updated
            ? {
                where: {
                  question_option_id: {
                    in: optionsPayload.updated
                      .map((_) => _.question_option_id)
                      .concat(optionsPayload.deleted),
                  },
                },
              }
            : undefined,
        QuestionResources: deletedResourceIds
          ? { where: { deleted_at: null } }
          : undefined,
      },
      where: { question_id },
    });
    if (
      question.question_type === 'File' &&
      resources.length === deletedResourceIds?.length &&
      files.length === 0
    )
      throw new BadRequestException(
        'File type questions require at least one file resource'
      );
    const unchangedOptions = options.filter(
      (_) =>
        ![
          ...optionsPayload?.deleted,
          ...optionsPayload?.updated?.map((_) => _.question_option_id),
        ].some(
          (question_option_id) => _.question_option_id === question_option_id
        )
    );
    if (
      question.question_type === 'MCQ' &&
      optionsPayload &&
      (![
        ...(optionsPayload?.added ?? []),
        ...(optionsPayload?.updated ?? []),
      ].some((_) => _.is_answer) ||
        !unchangedOptions.some((_) => _.is_answer) ||
        (optionsPayload?.added?.length ?? 0) +
          (optionsPayload?.updated?.length ?? 0) +
          unchangedOptions.length -
          (optionsPayload?.deleted?.length ?? 0) <
          2)
    ) {
      files.forEach((file) =>
        fs.unlinkSync(
          path.join(__dirname, `${file.destination}${file.filename}`)
        )
      );
      throw new UnprocessableEntityException(
        'MCQ must have at least two options with one the options being an answer'
      );
    }
    const newResources = files.filter((_) => _.fieldname === 'answerFile');
    await this.prismaService.$transaction([
      this.prismaService.question.update({
        data: {
          ...payload,
          question_answer: payload.question_answer
            ? payload.question_answer
            : question.question_type === 'File' &&
              (newResources.length > 0 || deletedResourceIds.length > 0)
            ? newResources
                .map(
                  (_) =>
                    `${process.env.NX_API_BASE_URL}/${_.destination}/${_.filename}`
                )
                .concat(
                  resources
                    .filter(
                      (_) =>
                        !deletedResourceIds?.includes(_.question_resource_id)
                    )
                    .map((_) => _.resource_ref)
                )
                .join(',')
            : undefined,
          is_deleted: deleteQuestion ? !question.is_deleted : undefined,
          QuestionAudits:
            deleteQuestion !== undefined && Object.keys(payload).length > 0
              ? {
                  create: {
                    ...pickKeys(question, [
                      'is_deleted',
                      'question',
                      'question_mark',
                    ]),
                    AuditedBy: { connect: { annual_teacher_id: audited_by } },
                  },
                }
              : undefined,
          QuestionResources: deletedResourceIds
            ? {
                createMany: {
                  data: newResources.map((file, index) => ({
                    caption: index + 1,
                    created_by: audited_by,
                    resource_ref: `${process.env.NX_API_BASE_URL}/${file.destination}/${file.filename}`,
                  })),
                  skipDuplicates: true,
                },
                updateMany: {
                  data: { deleted_at: new Date(), deleted_by: audited_by },
                  where: { question_resource_id: { in: deletedResourceIds } },
                },
              }
            : undefined,
          QuestionOptions: optionsPayload
            ? {
                createMany: optionsPayload?.added
                  ? {
                      data: optionsPayload.added.map((option) => ({
                        ...option,
                        created_by: audited_by,
                      })),
                      skipDuplicates: true,
                    }
                  : undefined,
                updateMany: optionsPayload?.deleted
                  ? {
                      data: { is_deleted: true },
                      where: {
                        question_option_id: { in: optionsPayload.deleted },
                      },
                    }
                  : undefined,
              }
            : undefined,
        },
        where: { question_id },
      }),
      ...(optionsPayload?.updated
        ? optionsPayload?.updated.map(({ question_option_id, ...option }) =>
            this.prismaService.questionOption.update({
              data: option,
              where: { question_option_id },
            })
          )
        : []),
      this.prismaService.questionOptionAudit.createMany({
        data: options.map((option) => ({
          ...excludeKeys(option, ['created_at', 'created_by', 'question_id']),
          audited_by,
        })),
        skipDuplicates: true,
      }),
    ]);
  }
}
