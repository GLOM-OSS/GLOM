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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ERR11, ERR12 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { IsPrivate, Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import {
  EvaluationMarkDto,
  EvaluationQueryDto,
  EvaluationsQeuryDto,
  ExamDatePutDto,
} from '../teacher.dto';
import { EvaluationService } from './evaluation.service';

@Controller()
@ApiTags('Evaluations')
@UseGuards(AuthenticatedGuard)
export class EvaluationController {
  constructor(
    private prismaService: PrismaService,
    private evaluationService: EvaluationService
  ) {}

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
    if (annualRegistry && (is_anonimated || is_published))
      throw new HttpException(ERR12[preferred_lang], HttpStatus.FORBIDDEN);
    const useAnonymityCode =
      ['RESIT', 'EXAM'].includes(evaluation_sub_type_name) && !is_published;
    const evaluationHasStudents =
      await this.evaluationService.getEvaluationHasStudents(evaluation_id);

    return annualRegistry && !annualTeacher
      ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
        evaluationHasStudents.map(({ mark, ...data }) => ({ ...data }))
      : annualTeacher && !annualRegistry && useAnonymityCode
      ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
        evaluationHasStudents.map(({ matricule, fullname, ...data }) => ({
          ...data,
        }))
      : evaluationHasStudents;
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

  @IsPrivate()
  @Roles(Role.TEACHER)
  @Put(':evaluation_id/save')
  async saveEvaluation(
    @Req() request: Request,
    @Param('evaluation_id') evaluation_id: string,
    @Body() { studentMarks, is_published }: EvaluationMarkDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.evaluationService.saveEvaluationMarks(
        studentMarks,
        annual_teacher_id
      );
      if (is_published) await this.publishEvaluation(request, evaluation_id);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @IsPrivate()
  @Roles(Role.TEACHER)
  @Put(':evaluation_id/reset-marks')
  async resetEvaluationMarks(
    @Req() request: Request,
    @Param('evaluation_id') evaluation_id: string
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.evaluationService.resetEvaluationMarks(
        evaluation_id,
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
