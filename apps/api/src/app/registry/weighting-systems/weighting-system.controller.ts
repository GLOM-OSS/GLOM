import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param, Put,
  Req,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import {
  EvaluationTypeWeightingPutDto,
  WeightingPutDto
} from '../registry.dto';
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
  @Roles(Role.REGISTRY)
  async upsertWeightingSystem(
    @Req() request: Request,
    @Body() updateWeightingSystem: WeightingPutDto
  ) {
    const {
      activeYear: { academic_year_id },
      annualRegistry: { annual_registry_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.weightingSystemService.upsertAnnualWeighting(
        updateWeightingSystem,
        academic_year_id,
        annual_registry_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('evaluation-type/:cycle_id')
  async getEvaluationTypeWeighting(
    @Req() request: Request,
    @Param('cycle_id') cycle_id: string
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return this.weightingSystemService.getEvaluationTypeWeighting(
      cycle_id,
      academic_year_id
    );
  }

  @Roles(Role.REGISTRY)
  @Put('evaluation-type/:cycle_id/edit')
  async upsertEvaluationTypeWeighting(
    @Req() request: Request,
    @Param('cycle_id') cycle_id: string,
    @Body() updatedData: EvaluationTypeWeightingPutDto
  ) {
    const {
      activeYear: { academic_year_id },
      annualRegistry: { annual_registry_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.weightingSystemService.upsertEvaluationTypeWeighting(
        cycle_id,
        updatedData,
        academic_year_id,
        annual_registry_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
