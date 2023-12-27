import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnprocessableEntityException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'apps/squoolr-v2/api/src/app/auth/auth.decorator';
import { Role } from 'apps/squoolr-v2/api/src/utils/enums';
import { Request } from 'express';
import * as fs from 'fs';
import { AuthenticatedGuard } from '../../../../app/auth/auth.guard';
import {
  CreateQuestionDto,
  QueryQuestionsDto,
  QuestionEntity,
  UpdateQuestionDto,
} from './question.dto';
import { QuestionsService } from './questions.service';
import path = require('path');

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

  @Post('new')
  @Roles(Role.TEACHER)
  @UseInterceptors(AnyFilesInterceptor())
  @ApiCreatedResponse({ type: QuestionEntity })
  createQuestion(
    @Req() request: Request,
    @Body() payload: CreateQuestionDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    if (payload.question_type === 'File' && files.length === 0)
      throw new BadRequestException(
        'File type questions require at least one file resource'
      );
    if (
      payload.question_type === 'MCQ' &&
      payload.options.length < 2 &&
      !payload.options.some((_) => _.is_answer)
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
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.questionsService.create(payload, files, annual_teacher_id);
  }

  @Put(':question_id')
  @Roles(Role.TEACHER)
  @UseInterceptors(AnyFilesInterceptor())
  updateQuestion(
    @Req() request: Request,
    @Param('question_id') questionId: string,
    @Body() payload: UpdateQuestionDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.questionsService.update(
      questionId,
      payload,
      files,
      annual_teacher_id
    );
  }

  @Delete(':question_id')
  @Roles(Role.TEACHER)
  deleteQuestion(
    @Req() request: Request,
    @Param('question_id') questionId: string
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.questionsService.delete(questionId, annual_teacher_id);
  }
}
