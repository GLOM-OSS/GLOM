import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { CarryOverSystemService } from './carry-over-system.service';
import { Request } from 'express';
import { DeserializeSessionData } from '../../../utils/types';

@Controller()
@UseGuards(AuthenticatedGuard)
export class CarryOverSystemController {
  constructor(private carryOverSystemService: CarryOverSystemService) {}

  @Get()
  async getCarryOverSystem(@Req() request: Request) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return this.carryOverSystemService.getCarryOverSystem(academic_year_id);
  }
}
