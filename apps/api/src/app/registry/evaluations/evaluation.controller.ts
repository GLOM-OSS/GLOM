import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { SemesterExamAccessPutDto } from '../registry.dto';
import { EvaluationService } from './evaluation.service';

@Controller()
@UseGuards(AuthenticatedGuard)
export class EvaluationController {
  constructor(private evaluationService: EvaluationService) {}

  @Get('hall-access')
  async getExamAccess(@Req() request: Request) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return this.evaluationService.getExamAccess(academic_year_id);
  }

  @Put('hall-access')
  @Roles(Role.REGISTRY)
  async updateExamHallAcess(
    @Req() request: Request,
    @Body() updatedData: SemesterExamAccessPutDto
  ) {
    const {
      activeYear: { academic_year_id },
      annualRegistry: { annual_registry_id },
    } = request.user as DeserializeSessionData;
    try {
      return await this.evaluationService.updateSemesterExamAccess(
        updatedData,
        academic_year_id,
        annual_registry_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
