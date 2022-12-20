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
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { CarryOverSystemService } from './carry-over-system.service';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { CarryOverSystemPutDto } from '../registry.dto';
import { Roles } from '../../app.decorator';

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

  @Put('edit')
  @Roles(Role.REGISTRY)
  async updateCarryOverSystem(
    @Req() request: Request,
    @Body() updatedData: CarryOverSystemPutDto
  ) {
    const {
      activeYear: { academic_year_id },
      annualRegistry: { annual_registry_id },
    } = request.user as DeserializeSessionData;
    try {
      return await this.carryOverSystemService.updateCarryOverSytem(
        updatedData,
        academic_year_id,
        annual_registry_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
