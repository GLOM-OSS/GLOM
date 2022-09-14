import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AnnualConfiguratorService } from '../../services/annual-configurator.service';
import { AnnualRegistryService } from '../../services/annual-registry.service';
import { AnnualStudentService } from '../../services/annual-student.service';
import { AnnualTeacherService } from '../../services/annual-teacher.service';
import { Role, SerializeSessionData, UserRole } from '../../utils/types';
import { AuthenticatedGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LocalGuard } from './local/local.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private annualStudentService: AnnualStudentService,
    private annualTeacherService: AnnualTeacherService,
    private annualRegistryService: AnnualRegistryService,
    private AnnualConfiguratorService: AnnualConfiguratorService
  ) {}

  @Post('signin')
  @UseGuards(LocalGuard)
  async userSignIn(@Req() request: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { roles, ...user } = request.user as SerializeSessionData;
    const academic_years = await this.authService.getAcademicYears(
      user.login_id
    );
    if (academic_years.length === 1) {
      return {
        user: {
          ...user,
          ...(await this.setSelectedYear(
            request,
            academic_years[0].academic_year_id
          )),
        },
      };
    }
    return { user, academic_years };
  }

  @Patch('active-year')
  @UseGuards(AuthenticatedGuard)
  async setSelectedYear(
    @Req() request,
    @Body('selected_academic_year_id') academic_year_id: string
  ) {
    const { login_id } = request.user as SerializeSessionData;
    const userRoles: UserRole[] = [];
    //check for annual student
    const annualStudent = await this.annualStudentService.findOne({
      academic_year_id,
      Student: { login_id },
    });
    if (annualStudent) {
      userRoles.push({
        user_id: annualStudent.annual_student_id,
        role: Role.STUDENT,
      });
      request.session.passport.user.roles = userRoles;
      return {
        login_id,
        annualStudent,
      };
    }
    //check for annual configurator
    const annualConfigurator = await this.AnnualConfiguratorService.findOne({
      login_id,
      academic_year_id,
    });
    if (annualConfigurator)
      userRoles.push({
        user_id: annualConfigurator.annual_configurator_id,
        role: Role.CONFIGURATOR,
      });

    //check for annual registry
    const annualRegistry = await this.annualRegistryService.findOne({
      login_id,
      academic_year_id,
    });
    if (annualRegistry)
      userRoles.push({
        user_id: annualRegistry.annual_registry_id,
        role: Role.REGISTRY,
      });

    //check for annual registry
    const annualTeacher = await this.annualTeacherService.findOne({
      academic_year_id,
      login_id,
    });
    if (annualTeacher)
      userRoles.push({
        user_id: annualTeacher.annual_teacher_id,
        role: Role.TEACHER,
      });
    request.session.passport.user.roles = userRoles;
    return {
      login_id,
      annualConfigurator,
      annualRegistry,
      annualTeacher,
    };
  }

  @Get('user')
  @UseGuards(AuthenticatedGuard)
  async getUser(@Req() request) {
    return request.user;
  }
}
