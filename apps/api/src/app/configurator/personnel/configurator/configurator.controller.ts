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
import { PersonnelQueryDto, StaffPostData } from '../../configurator.dto';
import { PersonnelService } from '../personnel.service';

@Controller()
@ApiTags('Personnel/configurators')
@UseGuards(AuthenticatedGuard)
export class ConfiguratorController {
  constructor(private personnelService: PersonnelService) {}

  @Get('all')
  async findAll(@Req() request: Request, @Query() query: PersonnelQueryDto) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;

    const configurators = await this.personnelService.findAll(
      Role.CONFIGURATOR,
      academic_year_id,
      query
    );
    return { configurators };
  }

  @Get(':annual_configurator_id')
  async findOne(
    @Param('annual_configurator_id') annual_configurator_id: string
  ) {
    const configurator = await this.personnelService.findOne(
      Role.CONFIGURATOR,
      annual_configurator_id
    );
    return { configurator };
  }

  @Put(':annual_configurator_id/archive')
  @Roles(Role.CONFIGURATOR)
  async archive(
    @Req() request: Request,
    @Param('annual_configurator_id') annual_configurator_id: string
  ) {
    const {
      annualConfigurator: { annual_configurator_id: audited_by },
    } = request.user as DeserializeSessionData;

    try {
      await this.personnelService.archivePersonnel(
        annual_configurator_id,
        Role.CONFIGURATOR,
        audited_by
      );
      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/new')
  @Roles(Role.CONFIGURATOR)
  async create(@Req() request: Request, @Body() newStaff: StaffPostData) {
    const {
      annualConfigurator: { annual_configurator_id },
      school_id,
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.personnelService.addNewStaff(
        newStaff,
        {
          school_id,
          role: Role.CONFIGURATOR,
        },
        academic_year_id,
        annual_configurator_id
      );
      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
