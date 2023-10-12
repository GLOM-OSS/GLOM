import { GlomPrismaService } from '@glom/prisma';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PassportUser, User } from './auth';
import { NewPasswordDto, ResetPasswordDto, SignInDto } from './auth.dto';
import { AuthenticatedGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { GoogleGuard } from './google/google.guard';
import { LocalGuard } from './local/local.guard';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prismaService: GlomPrismaService
  ) {}

  @Post('signin')
  @UseGuards(LocalGuard)
  async signIn(@Req() request: Request, @Body() login: SignInDto) {
    Logger.debug(`Successfully login ${login.email} !!!`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { created_at, cookie_age, roles, job_name, school_id, ...user } =
      request.user as User & PassportUser;

    if (!school_id) return { user };
    const { academicYears, desirializedRoles } =
      await this.authService.updateUserRoles(request, user.login_id);

    return {
      user: {
        ...user,
        ...(desirializedRoles ? desirializedRoles : {}),
      },
      academic_years: academicYears,
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Req() request: Request,
    @Body() { email }: ResetPasswordDto
  ) {
    const squoolr_client = new URL(request.headers.origin).host;
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
    const squoolr_client = new URL(request.headers.origin).host;
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
    return request.session.destroy(async (err) => {
      if (err)
        throw new InternalServerErrorException('Could not detroy session');
      await this.prismaService.log.update({
        data: { logged_out_at: new Date() },
        where: { log_id },
      });
    });
  }

  @Get('user')
  @UseGuards(AuthenticatedGuard)
  async getUser(@Req() request: Request) {
    const email = request.query.email as string;
    return {
      user: email ? await this.authService.getUser(email) : request.user,
    };
  }

  @Get('google')
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
