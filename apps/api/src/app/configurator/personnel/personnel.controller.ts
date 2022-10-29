import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus, Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { ResetPasswordDto } from '../../auth/auth.dto';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import {
  CoordinatorPostDto,
  StaffPostData, TeacherPostDto
} from '../configurator.dto';
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

  @Post('teachers/new')
  async addNewTeacher(
    @Req() request: Request,
    @Body() newTeacher: TeacherPostDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
      school_id,
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.personnelService.addNewTeacher(
        newTeacher,
        {
          school_id,
          academic_year_id,
        },
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
}
