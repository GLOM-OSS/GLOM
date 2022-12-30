import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { DeserializeSessionData } from '../../../utils/types';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { ExamDatePutDto } from '../teacher.dto';
import { EvaluationService } from './evaluation.service';

@Controller()
@UseGuards(AuthenticatedGuard)
export class EvaluationController {
  constructor(private evaluationService: EvaluationService) {}

  @Get('sub-types')
  async getEvaluationSubTypes(@Req() request: Request) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return this.evaluationService.getEvaluationSubTypes(academic_year_id);
  }

  @Get(':evaluation_id/students')
  async getEvaluationStudents(@Param('evaluation_id') evaluation_id: string) {
    const evaluation = await this.evaluationService.getEvaluation({
      evaluation_id,
    });
    const { evaluation_sub_type_name, is_anonimated, is_published } =
      evaluation;
    const useAnonymityCode =
      ['RESIT', 'EXAM'].includes(evaluation_sub_type_name) &&
      is_anonimated &&
      !is_published;
    return this.evaluationService.getEvaluationHasStudents(
      evaluation_id,
      useAnonymityCode
    );
  }

  @Get(':annual_credit_unit_subject_id/:annual_evaluation_sub_type_id')
  async getEvaluation(
    @Param('annual_credit_unit_subject_id')
    annual_credit_unit_subject_id: string,
    @Param('annual_evaluation_sub_type_id')
    annual_evaluation_sub_type_id: string
  ) {
    return this.evaluationService.getEvaluation({
      annual_credit_unit_subject_id,
      annual_evaluation_sub_type_id,
    });
  }

  @Put(':evaluation_id/exam-date')
  async updateEvaluation(
    @Req() request: Request,
    @Param('evaluation_id') evaluation_id: string,
    @Body() { examination_date }: ExamDatePutDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.evaluationService.updateEvaluation(
        evaluation_id,
        { examination_date: new Date(examination_date) },
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
