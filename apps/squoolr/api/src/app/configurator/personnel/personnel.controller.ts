import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { ResetPasswordDto } from '../../auth/auth.dto';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { PersonnelQueryDto, StaffPutDto } from '../configurator.dto';
import { PersonnelService } from './personnel.service';

@Controller()
@ApiTags('Personnel')
@UseGuards(AuthenticatedGuard)
export class PersonnelController {
  constructor(private personnelService: PersonnelService) {}

  @Get('all')
  async findAllPersonnel(
    @Req() request: Request,
    @Query() query: PersonnelQueryDto
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;

    const teachers = await this.personnelService.findAll(
      Role.TEACHER,
      academic_year_id,
      query
    );
    const registries = await this.personnelService.findAll(
      Role.REGISTRY,
      academic_year_id,
      query
    );
    const configurators = await this.personnelService.findAll(
      Role.CONFIGURATOR,
      academic_year_id,
      query
    );
    const personnel = teachers.map(
      ({
        annual_teacher_id,
        annual_configurator_id,
        annual_registry_id,
        ...personnelData
      }) => ({
        personnel_id:
          annual_teacher_id || annual_configurator_id || annual_registry_id,
        ...personnelData,
      })
    );
    [...registries, ...configurators].map(
      ({
        annual_teacher_id,
        annual_configurator_id,
        annual_registry_id,
        ...personnelData
      }) => {
        if (!personnel.find(({ email }) => email === personnelData.email))
          personnel.push({
            personnel_id:
              annual_teacher_id || annual_configurator_id || annual_registry_id,
            ...personnelData,
          });
      }
    );
    return { personnel };
  }

  @Put('reset-password')
  @Roles(Role.CONFIGURATOR)
  async resetPassword(
    @Req() request: Request,
    @Body() { email }: ResetPasswordDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    const squoolr_client = new URL(request.headers.origin).host;

    try {
      const { reset_password_id } = await this.personnelService.resetPassword(
        email,
        squoolr_client,
        annual_configurator_id
      );
      return {
        reset_link: `${request.headers.origin}/forgot-password/${reset_password_id}/new-password`,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':login_id/edit')
  @Roles(Role.CONFIGURATOR)
  async editStaff(
    @Req() request: Request,
    @Param('login_id') login_id: string,
    @Body() staffData: StaffPutDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.personnelService.editStaff(
        login_id,
        staffData,
        annual_configurator_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
