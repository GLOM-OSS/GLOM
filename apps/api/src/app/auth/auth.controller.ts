import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AUTH500 } from '../../errors';
import { PrismaService } from '../../prisma/prisma.service';
import {
  DeserializeSessionData,
  DesirializeRoles,
  PassportSession,
} from '../../utils/types';
import { AcademicYearQueryDto } from '../app.dto';
import { AcademicYearService } from '../configurator/academic-year/academic-year.service';
import { NewPasswordDto, ResetPasswordDto } from './auth.dto';
import { AuthenticatedGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { GoogleGuard } from './google/google.guard';
import { LocalGuard } from './local/local.guard';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
    private academicYearService: AcademicYearService
  ) {}

  @Post('signin')
  @UseGuards(LocalGuard)
  async userSignIn(@Req() request: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { created_at, cookie_age, roles, job_name, school_id, ...user } =
      request.user as DeserializeSessionData & PassportSession;

    if (!school_id) return { user };
    const academic_years = await this.academicYearService.getAcademicYears(
      user.login_id
    );
    if (academic_years.length === 1) {
      const selected_roles = await this.getActiveRoles(request, {
        academic_year_id: academic_years[0].academic_year_id,
      });
      return {
        user: {
          ...user,
          ...selected_roles,
        },
      };
    }
    return { user, academic_years };
  }

  @Put('active-roles')
  @UseGuards(AuthenticatedGuard)
  async getActiveRoles(
    @Req() request: Request,
    @Body() { academic_year_id }: AcademicYearQueryDto
  ): Promise<DesirializeRoles> {
    const { login_id } = request.session.passport.user;
    const { availableRoles, userRoles } = await this.authService.getActiveRoles(
      login_id,
      academic_year_id
    );

    await new Promise((resolve) =>
      request.login(
        {
          ...request.session.passport.user,
          roles: userRoles,
          academic_year_id,
        },
        (err) => {
          if (err)
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
          resolve(1);
        }
      )
    );
    return availableRoles;
  }

  @Post('reset-password')
  async resetPassword(
    @Req() request: Request,
    @Body() { email }: ResetPasswordDto
  ) {
    const squoolr_client = new URL(request.headers.origin).hostname;
    const { reset_password_id } = await this.authService.resetPassword(
      email,
      squoolr_client
    );
    return {
      reset_link: `${request.headers.origin}/forgot-password/${reset_password_id}/new-password`,
    };
  }

  @Post('new-password')
  async setNewPassword(
    @Req() request: Request,
    @Body() { reset_password_id, new_password }: NewPasswordDto
  ) {
    const squoolr_client = new URL(request.headers.origin).hostname;
    await this.authService.setNewPassword(
      reset_password_id,
      new_password,
      squoolr_client
    );
    return { is_new_password_set: true };
  }

  @Delete('log-out')
  @UseGuards(AuthenticatedGuard)
  async logOut(@Req() request: Request) {
    const { log_id } = request.session.passport.user;

    try {
      return request.session.destroy(async (err) => {
        if (err)
          throw new HttpException(
            AUTH500['Fr'],
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        await this.prismaService.log.update({
          data: { logged_out_at: new Date() },
          where: { log_id },
        });
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user')
  @UseGuards(AuthenticatedGuard)
  async getUser(@Req() request: Request) {
    const email = request.query.email as string;
    return { user: email ? await this.authService.getUser(email) : request.user };
  }

  @Get('google-signin')
  @UseGuards(GoogleGuard)
  async googleSignIn() {
    // google authentication will redirect
  }

  @Get('redirect')
  @UseGuards(GoogleGuard)
  async googleSignInRedirect(@Req() request: Request) {
    return request.user;
  }
}
