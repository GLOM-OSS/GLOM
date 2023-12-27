import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    UnprocessableEntityException,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'apps/squoolr-v2/api/src/app/auth/auth.decorator';
import { Role } from 'apps/squoolr-v2/api/src/utils/enums';
import { Request } from 'express';
import * as fs from 'fs';
import { AuthenticatedGuard } from '../../../../app/auth/auth.guard';
import {
    CreateQuestionDto,
    QueryQuestionsDto,
    QuestionEntity,
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
  createQuestion(
    @Req() request: Request,
    @Body() payload: CreateQuestionDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    if (payload.question_type === 'File' && files.length === 0)
      throw new BadRequestException(
        'File question require file resource to be uploaded'
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
}
