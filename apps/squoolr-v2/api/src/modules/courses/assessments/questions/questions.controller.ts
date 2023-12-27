import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { QueryQuestionsDto, QuestionEntity } from './question.dto';
import { AuthenticatedGuard } from '../../../../app/auth/auth.guard';

@UseGuards(AuthenticatedGuard)
@ApiTags('Course assessment questions')
@Controller('courses/assessments/questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get()
  @ApiOkResponse({ type: [QuestionEntity] })
  getQuestions(@Query() params: QueryQuestionsDto) {
    return this.questionsService.findAll(params);
  }
}
