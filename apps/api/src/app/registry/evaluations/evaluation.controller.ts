import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { DeserializeSessionData } from '../../../utils/types';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { EvaluationService } from './evaluation.service';

@Controller()
@UseGuards(AuthenticatedGuard)
export class EvaluationController {
  constructor(private evaluationService: EvaluationService) {}

  @Get('hall-access')
  async getEvaluationTypeWeighting(@Req() request: Request) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return this.evaluationService.getExamAccess(academic_year_id);
  }
}
