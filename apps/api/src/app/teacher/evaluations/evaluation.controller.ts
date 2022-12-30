import { Request } from 'express';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { EvaluationService } from './evaluation.service';
import { DeserializeSessionData } from 'apps/api/src/utils/types';

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

}
