import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DeserializeSessionData } from '../../../utils/types';
import { Request } from 'express';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { WeightingSystemService } from './weighting-system.service';

@Controller()
@UseGuards(AuthenticatedGuard)
export class WeightingSystemController {
  constructor(private weightingSystemService: WeightingSystemService) {}

  @Get()
  async getWeightingSystem(@Req() request: Request) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return await this.weightingSystemService.getAnnualWeighting(
      academic_year_id
    );
  }
}
