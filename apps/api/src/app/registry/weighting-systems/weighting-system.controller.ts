import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { DeserializeSessionData } from '../../../utils/types';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { WeightingPutDto } from '../registry.dto';
import { WeightingSystemService } from './weighting-system.service';

@Controller()
@UseGuards(AuthenticatedGuard)
export class WeightingSystemController {
  constructor(private weightingSystemService: WeightingSystemService) {}

  @Get(':cycle_id')
  async getWeightingSystem(
    @Req() request: Request,
    @Param('cycle_id') cycle_id: string
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return await this.weightingSystemService.getAnnualWeighting(
      academic_year_id,
      cycle_id
    );
  }

  @Put('upsert')
  async upsertWeightingSystem(
    @Req() request: Request,
    @Body() updateWeightingSystem: WeightingPutDto
  ) {
    const {
      activeYear: { academic_year_id },
      annualRegistry: { annual_registry_id },
    } = request.user as DeserializeSessionData;
    await this.weightingSystemService.upsertAnnualWeighting(
      updateWeightingSystem,
      academic_year_id,
      annual_registry_id
    );
  }

  @Get('grades/:cylce_id/all')
  async getGradeWeightings(@Param('cycle_id') cycle_id: string) {
    return await this.weightingSystemService.getAnnualGradeWeightings(cycle_id);
  }

  @Get('grades/:annnual_grade_weighting_id')
  async getGradeWeighting(
    @Param('annual_grade_weighting_id') annual_grade_weighting_id: string
  ) {
    return await this.weightingSystemService.getAnnualWeightingGrade(
      annual_grade_weighting_id
    );
  }
}
