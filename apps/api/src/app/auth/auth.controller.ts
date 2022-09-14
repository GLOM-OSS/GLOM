import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import {
  AUTH04, AUTH404,
  AUTH500, sAUTH404
} from '../../errors';
import { PrismaService } from '../../prisma/prisma.service';
import { AnnualConfiguratorService } from '../../services/annual-configurator.service';
import { AnnualRegistryService } from '../../services/annual-registry.service';
import { AnnualStudentService } from '../../services/annual-student.service';
import { AnnualTeacherService } from '../../services/annual-teacher.service';
import { LoginService } from '../../services/login.service';
import { ResetPasswordService } from '../../services/reset-password.service';
import {
  DeserializeSessionData,
  Role,
  SerializeSessionData,
  UserRole
} from '../../utils/types';
import { NewPasswordDto } from '../class-vaditor';
import { AuthenticatedGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LocalGuard } from './local/local.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private prismaService: PrismaService,
    private resetPasswordService: ResetPasswordService,
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
    const { login_id } = request.user as DeserializeSessionData;
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

  @Post('reset-password')
  async resetPassword(@Req() request: Request, @Body('email') email: string) {
    const squoolr_client = request.headers.host.replace('https://', '');
    const login = await this.loginService.findOne({
      Person: { email },
      School:
        squoolr_client !== process.env.SQUOOLR_URL
          ? { subdomain: squoolr_client }
          : undefined,
    });
    if (login) {
      const resetPasswords = await this.prismaService.resetPassword.count({
        where: { OR: { is_valid: true, expires_at: { gt: new Date() } } },
      });
      if (resetPasswords === 1)
        throw new HttpException(AUTH04['Fr'], HttpStatus.NOT_FOUND);
      const { reset_password_id } = await this.resetPasswordService.create({
        Login: { connect: { login_id: login.login_id } },
        expires_at: new Date(
          new Date().setMinutes(new Date().getMinutes() + 30)
        ),
      });

      return {
        reset_link: `${request.headers.host}/forgot-password/${reset_password_id}/new-password`,
      };
    }
    throw new HttpException(AUTH404('Email')['Fr'], HttpStatus.NOT_FOUND);
  }

  @Post('new-password')
  async setNewPassword(
    @Req() request: Request,
    @Body() { reset_password_id, new_password }: NewPasswordDto
  ) {
    const squoolr_client = request.headers.host.replace('https://', '');
    const login = await this.loginService.findOne({
      School:
        squoolr_client !== process.env.SQUOOLR_URL
          ? { subdomain: squoolr_client }
          : undefined,
      ResetPasswords: {
        some: {
          reset_password_id,
          is_valid: true,
          expires_at: { gte: new Date() },
        },
      },
    });
    if (login) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { created_at, person_id, school_id, ...data } = login;
      return await this.prismaService.$transaction([
        this.prismaService.loginAudit.create({ data }),
        this.prismaService.login.update({
          data: {
            password: bcrypt.hashSync(new_password, Number(process.env.SALT)),
          },
          where: { login_id: login.login_id },
        }),
        this.prismaService.resetPassword.update({
          data: { is_valid: false },
          where: { reset_password_id },
        }),
      ]);
    }
    throw new HttpException(sAUTH404['Fr'], HttpStatus.NOT_FOUND);
  }

  @Patch('log-out')
  @UseGuards(AuthenticatedGuard)
  async logOut(@Req() request: Request) {
    const { log_id } = request.session['passport']['user'];

    return request.session.destroy(async (err) => {
      if (!err)
        throw new HttpException(
          AUTH500['Fr'],
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      await this.prismaService.log.update({
        data: { logged_out_at: new Date() },
        where: { log_id },
      });
    });
  }

  @Get('user')
  @UseGuards(AuthenticatedGuard)
  async getUser(@Req() request) {
    return request.user;
  }
}
