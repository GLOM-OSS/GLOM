import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DeserializeSessionData } from '../../../utils/types';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { ResourceOwner } from '../courses/course.dto';
import { AssessmentPutDto, PublishAssessmentDto } from '../teacher.dto';
import { AssessmentService } from './assessment.service';

@Controller()
@ApiTags('Assessments')
@UseGuards(AuthenticatedGuard)
export class AssessmentController {
  constructor(private assessmentService: AssessmentService) {}

  @Get(':assessment_id')
  async getAssessment(@Param('assessment_id') assessment_id: string) {
    return this.assessmentService.getAssessment(assessment_id);
  }

  @Post('new')
  async createAssessment(
    @Req() request: Request,
    @Body() { annual_credit_unit_subject_id }: ResourceOwner
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      return await this.assessmentService.createAssessment(
        annual_credit_unit_subject_id,
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':assessment_id/edit')
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

  @Put('publish')
  async publishAssessment(
    @Req() request: Request,
    @Body() assessment: PublishAssessmentDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      return this.assessmentService.publishAssessment(
        assessment,
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':assessment_id/questions')
  async getAssessmentQuestions(@Param('assessment_id') assessment_id: string) {
    return this.assessmentService.getAssessmentQuestions(assessment_id);
  }

  @Get('questions/:question_id')
  async getQuestion(@Param('question_id') question_id: string) {
    return this.assessmentService.getQuestion(question_id);
  }

  @Get(':assessment_id/marks')
  async getStudentAssessmentMarks(
    @Param('assessment_id') assessment_id: string
  ) {
    return this.assessmentService.getStudentAssessmentMarks(assessment_id);
  }
}
