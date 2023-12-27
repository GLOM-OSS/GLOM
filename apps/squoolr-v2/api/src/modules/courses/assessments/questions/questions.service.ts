import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import {
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
}
