import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { DeserializeSessionData } from 'apps/api/src/utils/types';
import { Request } from 'express';
import { AuthenticatedGuard } from '../../auth/auth.guard';
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
}
