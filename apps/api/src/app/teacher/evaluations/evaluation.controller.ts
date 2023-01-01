import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { ERR11, ERR12 } from '../../../errors';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import {
  EvaluationQueryDto,
  EvaluationsQeuryDto,
  ExamDatePutDto
} from '../teacher.dto';
import { EvaluationService } from './evaluation.service';

@Controller()
@UseGuards(AuthenticatedGuard)
export class EvaluationController {
  constructor(private evaluationService: EvaluationService) {}

  @Get()
  async getEvaluation(
    @Req() request: Request,
    @Query() evaluationQuery: EvaluationQueryDto
  ) {
    const { preferred_lang } = request.user as DeserializeSessionData;
    const {
      evaluation_id,
      annual_credit_unit_subject_id,
      annual_evaluation_sub_type_id,
    } = evaluationQuery;
    if (
      evaluation_id ||
      (annual_credit_unit_subject_id && annual_evaluation_sub_type_id)
    )
      return this.evaluationService.getEvaluation(evaluationQuery);
    throw new HttpException(ERR11[preferred_lang], HttpStatus.BAD_REQUEST);
  }

  @Get('all')
  async getEvaluations(@Query() evaluationQuery: EvaluationsQeuryDto) {
    return this.evaluationService.getEvaluations(evaluationQuery);
  }

  @Get('sub-types')
  async getEvaluationSubTypes(@Req() request: Request) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return this.evaluationService.getEvaluationSubTypes(academic_year_id);
  }

  @Get(':evaluation_id/students')
  @Roles(Role.REGISTRY, Role.TEACHER)
  async getEvaluationStudents(
    @Req() request: Request,
    @Param('evaluation_id') evaluation_id: string
  ) {
    const { annualRegistry, annualTeacher, preferred_lang } =
      request.user as DeserializeSessionData;
    const { evaluation_sub_type_name, is_published, is_anonimated } =
      await this.evaluationService.getEvaluation({
        evaluation_id,
      });
    if (annualRegistry && is_anonimated)
      throw new HttpException(ERR12[preferred_lang], HttpStatus.FORBIDDEN);
    const useAnonymityCode = annualTeacher
      ? ['RESIT', 'EXAM'].includes(evaluation_sub_type_name) && !is_published
      : !is_anonimated;
    return this.evaluationService.getEvaluationHasStudents(
      evaluation_id,
      useAnonymityCode
    );
  }

  @Roles(Role.TEACHER)
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

  @Roles(Role.REGISTRY)
  @Put(':evaluation_id/anonimate')
  async anonimateEvaluation(
    @Req() request: Request,
    @Param('evaluation_id') evaluation_id: string
  ) {
    const {
      annualRegistry: { annual_registry_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.evaluationService.updateEvaluation(
        evaluation_id,
        { anonimated_at: new Date() },
        annual_registry_id
      );
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(Role.TEACHER)
  @Put(':evaluation_id/publish')
  async publishEvaluation(
    @Req() request: Request,
    @Param('evaluation_id') evaluation_id: string
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.evaluationService.updateEvaluation(
        evaluation_id,
        { published_at: new Date() },
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
