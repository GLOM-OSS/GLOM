import {
  Body,
  Controller,
  Get,
  Param, Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { ResetPasswordDto } from '../../auth/auth.dto';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { PersonnelService, PersonnelType } from './personnel.service';

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

  @Put('teachers/:annual_teacher_id/reset-code')
  async resetTeacherCode(
    @Req() request: Request,
    @Param('annual_teacher_id') annual_teacher_id: string
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    await this.personnelService.resetPrivateCode(
      annual_teacher_id,
      Role.TEACHER,
      annual_configurator_id
    );

    return { is_code_reset: true };
  }

  @Put('registries/:annual_registry_id/reset-code')
  async resetRegistryCode(
    @Req() request: Request,
    @Param('annual_registry_id') annual_registry_id: string
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    await this.personnelService.resetPrivateCode(
      annual_registry_id,
      Role.TEACHER,
      annual_configurator_id
    );

    return { is_code_reset: true };
  }

  @Put('reset-password')
  async resetPassword(
    @Req() request: Request,
    @Body() { email }: ResetPasswordDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    const squoolr_client = new URL(request.headers.origin).hostname;
    const { reset_password_id } = await this.personnelService.resetPassword(
      email,
      squoolr_client,
      annual_configurator_id
    );
    return {
      reset_link: `${request.headers.origin}/forgot-password/${reset_password_id}/new-password`,
    };
  }
}
