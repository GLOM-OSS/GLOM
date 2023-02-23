import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ERR20, ERR22 } from '../../../../src/errors';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { StudentAnswerDto } from '../courses/course.dto';
import {
  AssessmentPostDto,
  AssessmentPutDto,
  PublishAssessmentDto,
  QuestionPostDto,
  QuestionPutDto,
} from '../teacher.dto';
import { AssessmentService } from './assessment.service';

@Controller()
@ApiTags('Assessments')
@UseGuards(AuthenticatedGuard)
export class AssessmentController {
  constructor(private assessmentService: AssessmentService) {}

  @Get(':assessment_id')
  async getAssessment(
    @Req() request: Request,
    @Param('assessment_id') assessment_id: string
  ) {
    const { annualStudent } = request.user as DeserializeSessionData;
    return this.assessmentService.getAssessment(
      assessment_id,
      Boolean(annualStudent)
    );
  }

  @Post('new')
  @Roles(Role.TEACHER)
  async createAssessment(
    @Req() request: Request,
    @Body() newAssessment: AssessmentPostDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      return await this.assessmentService.createAssessment(
        newAssessment,
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(Role.TEACHER)
  @Delete(':assessment_id/delete')
  async deleteAssessment(
    @Req() request: Request,
    @Param('assessment_id') assessment_id: string
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.assessmentService.updateAssessment(
        assessment_id,
        { is_deleted: true },
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(Role.TEACHER)
  @Put(':assessment_id/activate')
  async updateAssessment(
    @Req() request: Request,
    @Param('assessment_id') assessment_id: string,
    @Body() updatedData: AssessmentPutDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.assessmentService.updateAssessment(
        assessment_id,
        updatedData,
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':assessment_id/publish')
  @Roles(Role.TEACHER)
  async publishAssessment(
    @Req() request: Request,
    @Param('assessment_id') assessment_id: string,
    @Body() assessment: PublishAssessmentDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      return this.assessmentService.publishAssessment(
        assessment_id,
        annual_teacher_id,
        assessment?.annual_evaluation_sub_type_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':assessment_id/questions')
  async getAssessmentQuestions(
    @Req() request: Request,
    @Param('assessment_id') assessment_id: string
  ) {
    const { annualStudent } = request.user as DeserializeSessionData;
    return this.assessmentService.getAssessmentQuestions(
      assessment_id,
      annualStudent as unknown as boolean
    );
  }

  @Get('questions/:question_id')
  async getQuestion(@Param('question_id') question_id: string) {
    return this.assessmentService.getQuestion(question_id);
  }

  @Get(':assessment_id/submissions')
  async getAssessmentSubmissions(
    @Param('assessment_id') assessment_id: string
  ) {
    return this.assessmentService.getAssessmentSubmissions(assessment_id);
  }

  @Roles(Role.TEACHER)
  @Get(':assessment_id/answers')
  async getStudentAnswers(
    @Req() request: Request,
    @Param('assessment_id') assessment_id: string,
    @Query('annual_student_id') annual_student_id: string
  ) {
    const { annualStudent, preferred_lang } =
      request.user as DeserializeSessionData;
    if (!annualStudent && !annual_student_id)
      throw new HttpException(
        ERR20('student id')[preferred_lang],
        HttpStatus.BAD_REQUEST
      );
    return this.assessmentService.getStudentAnswers(
      annualStudent?.annual_student_id ?? annual_student_id,
      assessment_id
    );
  }

  @Get(':assessment_id/statistics')
  async getAssessmentStats(
    @Param('assessment_id') assessment_id: string,
    @Query('distribution_interval') distribution_interval: number
  ) {
    return this.assessmentService.getAssessmentStats(
      assessment_id,
      distribution_interval ?? 5
    );
  }

  @Roles(Role.STUDENT)
  @Post(':assessment_id/take')
  async takeAssessment(
    @Req() request: Request,
    @Param('assessment_id') assessment_id: string,
    @Query('annual_student_id') annual_student_id: string
  ) {
    const { annualStudent, preferred_lang } =
      request.user as DeserializeSessionData;
    if (!annualStudent && !annual_student_id)
      throw new HttpException(
        ERR20('student id')[preferred_lang],
        HttpStatus.BAD_REQUEST
      );
    try {
      return this.assessmentService.takeAssessment(
        annualStudent?.annual_student_id ?? annual_student_id,
        assessment_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(Role.STUDENT)
  @Post(':assessment_id/submit')
  @UseInterceptors(FilesInterceptor('responseFiles'))
  async submitAssessment(
    @Req() request: Request,
    @Param('assessment_id') assessment_id: string,
    @Body() { answers }: StudentAnswerDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    const {
      annualStudent: { annual_student_id },
    } = request.user as DeserializeSessionData;
    try {
      return this.assessmentService.submitStudentAnswers(
        annual_student_id,
        assessment_id,
        answers,
        files
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(Role.TEACHER)
  @Post('questions/new')
  @UseInterceptors(FileInterceptor('answerFile'))
  async createNewQuestion(
    @Req() request: Request,
    @Body() { question_answer, question_type, ...newQuestion }: QuestionPostDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const {
      preferred_lang,
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    if (
      (question_type === 'File' && !file) ||
      (question_type === 'Structural' && !question_answer)
    )
      throw new HttpException(ERR22[preferred_lang], HttpStatus.BAD_REQUEST);
    try {
      return await this.assessmentService.createAssessmentQuestion(
        {
          question_answer:
            question_type === 'File' ? file.filename : question_answer,
          question_type,
          ...newQuestion,
        },
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(Role.TEACHER)
  @Post('questions/:question_id/new-resources')
  @UseInterceptors(FilesInterceptor('questionResources'))
  async saveQuestionResources(
    @Req() request: Request,
    @Param('question_id') question_id: string,
    @UploadedFiles()
    files: Array<Express.Multer.File>
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      return await this.assessmentService.createQuestionResources(
        question_id,
        files ?? [],
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(Role.TEACHER)
  @Put('questions/:question_id/edit')
  async updateQuestion(
    @Req() request: Request,
    @Param('question_id') question_id: string,
    @Body() updatedQuestion: QuestionPutDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.assessmentService.updateQuestion(
        question_id,
        updatedQuestion,
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(Role.TEACHER)
  @Put('questions/:question_id/delete')
  async deleteQuestion(
    @Req() request: Request,
    @Param('question_id') question_id: string
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.assessmentService.deleteQuestion(
        question_id,
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
