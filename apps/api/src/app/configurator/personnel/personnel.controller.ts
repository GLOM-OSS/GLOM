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
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { ResetPasswordDto } from '../../auth/auth.dto';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import {
  CoordinatorPostDto,
  StaffPostData,
  StaffPutDto,
} from '../configurator.dto';
import { PersonnelService, PersonnelType } from './personnel.service';

@Controller()
@Roles(Role.CONFIGURATOR)
@UseGuards(AuthenticatedGuard)
export class PersonnelController {
  constructor(private personnelService: PersonnelService) {}

  @Get(['configurators', 'registries', 'coordinators', 'teachers'])
  async findAllPersonnel(
    @Req() request: Request,
    @Query('keyword') keyword: string
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;

    const personnelType = request.url.includes('registries')
      ? PersonnelType.REGISTRY
      : request.url.includes('coordinators')
      ? PersonnelType.COORDINATOR
      : request.url.includes('teachers')
      ? PersonnelType.TEACHER
      : PersonnelType.CONFIGURATOR;

    const personnel = await this.personnelService.findAll(
      personnelType,
      academic_year_id,
      keyword
    );
    return { personnel };
  }

  @Get([
    'configurators/:annual_personnel_id',
    'registries/:annual_personnel_id',
    'coordinators/:annual_personnel_id',
    'teachers/:annual_personnel_id',
  ])
  async findOnePersonnel(
    @Req() request: Request,
    @Param('annual_personnel_id') annual_personnel_id: string
  ) {
    const personnelType = request.url.includes('registries')
      ? PersonnelType.REGISTRY
      : request.url.includes('coordinators')
      ? PersonnelType.COORDINATOR
      : request.url.includes('teachers')
      ? PersonnelType.TEACHER
      : PersonnelType.CONFIGURATOR;

    const personnel = await this.personnelService.findOne(
      personnelType,
      annual_personnel_id
    );
    return { personnel };
  }

  @Put([
    'teachers/:annual_teacher_id/reset-code',
    'registries/:annual_registry_id/reset-code',
  ])
  async resetStaffCode(@Req() request: Request) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    const personnelId =
      request.params[
        request.url.includes('teachers')
          ? 'annual_teacher_id'
          : 'annual_registry_id'
      ];
    const personnelRole = request.url.includes('teachers')
      ? Role.TEACHER
      : Role.REGISTRY;
    try {
      await this.personnelService.resetPrivateCode(
        personnelId,
        personnelRole,
        annual_configurator_id
      );

      return { is_code_reset: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  @Post(['registries/new', 'configurators/new'])
  async addNewStaff(@Req() request: Request, @Body() newStaff: StaffPostData) {
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
          role: request.url.includes('registries')
            ? Role.REGISTRY
            : Role.CONFIGURATOR,
        },
        academic_year_id,
        annual_configurator_id
      );
      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('coordinators/new')
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

  @Put(['registries/:login_id/edit', 'configurators/:login_id/edit'])
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
