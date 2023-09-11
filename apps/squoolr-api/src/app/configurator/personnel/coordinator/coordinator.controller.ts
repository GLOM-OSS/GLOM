import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeserializeSessionData, Role } from '../../../../utils/types';
import { Request } from 'express';
import { Roles } from '../../../app.decorator';
import { AuthenticatedGuard } from '../../../auth/auth.guard';
import { CoordinatorPostDto, PersonnelQueryDto } from '../../configurator.dto';
import { PersonnelService } from '../personnel.service';

@Controller()
@ApiTags('Coordinators')
@UseGuards(AuthenticatedGuard)
export class CoordinatorController {
  constructor(private personnelService: PersonnelService) {}

  @Get('all')
  async findAll(@Req() request: Request, @Query() query: PersonnelQueryDto) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;

    const coordinators = await this.personnelService.findAll(
      Role.COORDINATOR,
      academic_year_id,
      query
    );
    return { coordinators };
  }

  @Get(':annual_coordinator_id')
  async findOne(@Param('annual_coordinator_id') annual_coordinator_id: string) {
    const configurator = await this.personnelService.findOne(
      Role.COORDINATOR,
      annual_coordinator_id
    );
    return { configurator };
  }

  @Put(':annual_coordinator_id/archive')
  @Roles(Role.CONFIGURATOR)
  async archive(
    @Req() request: Request,
    @Param('annual_coordinator_id') annual_coordinator_id: string
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;

    try {
      await this.personnelService.archivePersonnel(
        annual_coordinator_id,
        Role.COORDINATOR,
        annual_configurator_id
      );
      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('new')
  @Roles(Role.CONFIGURATOR)
  async addNewCoordinator(
    @Req() request: Request,
    @Body() data: CoordinatorPostDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.personnelService.addNewCoordinator(
        data,
        annual_configurator_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
