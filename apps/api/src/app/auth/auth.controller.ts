import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { AUTH500 } from '../../errors';
import { PrismaService } from '../../prisma/prisma.service';
import {
  DeserializeSessionData,
  DesirializeRoles,
  PassportSession
} from '../../utils/types';
import { NewPasswordDto } from '../class-vaditor';
import { AuthenticatedGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { GoogleGuard } from './google/google.guard';
import { LocalGuard } from './local/local.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService
  ) {}

  @Post('signin')
  @UseGuards(LocalGuard)
  async userSignIn(@Req() request: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { created_at, cookie_age, roles, job_name, ...user } =
      request.user as DeserializeSessionData & PassportSession;

    const academic_years = await this.authService.getAcademicYears(
      user.login_id
    );
    if (academic_years.length === 1) {
      const selected_roles = await this.setActiveYear(
        request,
        academic_years[0].academic_year_id
      );
      return {
        user: {
          ...user,
          ...selected_roles,
        },
      };
    }
    return { user, academic_years };
  }

  @Patch('active-year')
  @UseGuards(AuthenticatedGuard)
  async setActiveYear(
    @Req() request: Request,
    @Body('selected_academic_year_id') academic_year_id: string
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
  async resetPassword(@Req() request: Request, @Body('email') email: string) {
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
  async getUser(@Req() request) {
    return request.user;
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
