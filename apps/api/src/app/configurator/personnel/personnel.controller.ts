import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Request } from 'express';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import {
    PersonnelService,
    PersonnelType
} from './personnel.service';

@Controller('personnel')
@Roles(Role.CONFIGURATOR)
@UseGuards(AuthenticatedGuard)
export class PersonnelController {
  constructor(private personnelService: PersonnelService) {}

  @Get('configurators')
  async findConfigurators(
    @Req() request: Request,
    @Query('keyword') keyword: string
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    const configurators = await this.personnelService.findAll(
      PersonnelType.CONFIGURATOR,
      academic_year_id,
      keyword
    );
    return { configurators };
  }

  @Get('registries')
  async findRegistries(
    @Req() request: Request,
    @Query('keyword') keyword: string
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    const registries = await this.personnelService.findAll(
      PersonnelType.REGISTRY,
      academic_year_id,
      keyword
    );
    return { registries };
  }

  @Get('coordinators')
  async findCoordinators(
    @Req() request: Request,
    @Query('keyword') keyword: string
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    const coordinators = await this.personnelService.findAll(
      PersonnelType.CONFIGURATOR,
      academic_year_id,
      keyword
    );
    return { coordinators };
  }

  @Get('teachers')
  async findTeachers(
    @Req() request: Request,
    @Query('keyword') keyword: string
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    const teachers = await this.personnelService.findAll(
      PersonnelType.TEACHER,
      academic_year_id,
      keyword
    );
    return { teachers };
  }
}
