import {
  Body,
  Controller,
  Get,
  Param, Put,
  Req,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
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
  @Roles(Role.REGISTRY)
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
}
