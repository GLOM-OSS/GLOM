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
import { DeserializeSessionData, Role } from 'apps/api/src/utils/types';
import { Request } from 'express';
import { Roles } from '../../../app.decorator';
import { AuthenticatedGuard } from '../../../auth/auth.guard';
import { PersonnelQueryDto, StaffPostData } from '../../configurator.dto';
import { PersonnelService } from '../personnel.service';

@Controller()
@ApiTags('Personnel/registries')
@Roles(Role.CONFIGURATOR)
@UseGuards(AuthenticatedGuard)
export class RegistryController {
  constructor(private personnelService: PersonnelService) {}

  @Get('all')
  async findAll(@Req() request: Request, @Query() query: PersonnelQueryDto) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;

    const registries = await this.personnelService.findAll(
      Role.REGISTRY,
      academic_year_id,
      query
    );
    return { registries };
  }

  @Get(':annual_registry_id')
  async findOne(@Param('annual_registry_id') annual_registry_id: string) {
    const registry = await this.personnelService.findOne(
      Role.REGISTRY,
      annual_registry_id
    );
    return { registry };
  }

  @Put(':annual_registry_id/archive')
  async archive(
    @Req() request: Request,
    @Param('annual_registry_id') annual_registry_id: string
  ) {
    const {
      annualConfigurator: { annual_configurator_id: audited_by },
    } = request.user as DeserializeSessionData;

    try {
      await this.personnelService.archivePersonnel(
        annual_registry_id,
        Role.REGISTRY,
        audited_by
      );
      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/new')
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
          role: Role.REGISTRY,
        },
        academic_year_id,
        annual_configurator_id
      );
      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':annual_registry_id/reset-code')
  async resetStaffCode(
    @Req() request: Request,
    @Param('annual_registry_id') annual_registry_id: string
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.personnelService.resetPrivateCode(
        annual_registry_id,
        Role.REGISTRY,
        annual_configurator_id
      );

      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
