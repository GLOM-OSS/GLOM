import { encrypt } from '@glom/encrypter';
import { GlomExceptionResponse } from '@glom/execeptions';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AcademicYear } from '@prisma/client';
import { Request, Response } from 'express';
import {
  ResetPasswordDto,
  SetNewPasswordDto,
  SignInDto,
  SingInResponse,
  UserEntity,
} from './auth.dto';
import { AuthenticatedGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LocalGuard } from './local/local.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @UseGuards(LocalGuard)
  @ApiCreatedResponse({ type: SingInResponse })
  async signIn(@Req() request: Request, @Body() login: SignInDto) {
    let user = request.user;
    let academicYears: AcademicYear[] = [];
    if (user.school_id) {
      const result = await this.authService.updateUserSession(
        request,
        user.login_id
      );
      academicYears = result.academicYears;
      user = { ...user, ...result.annualSessionData };
    }
    await this.authService.openSession(request, user.login_id);
    return new SingInResponse({
      academicYears,
      user: await this.authService.getUser(user),
    });
  }

  @Post('reset-password')
  @ApiNoContentResponse()
  async resetPassword(
    @Req() request: Request,
    @Body() { email }: ResetPasswordDto
  ) {
    const requestHost = new URL(request.headers.origin).host;
    await this.authService.resetPassword(email, requestHost);
  }

  @Post('new-password')
  @ApiNoContentResponse()
  async setNewPassword(
    @Req() request: Request,
    @Body() { reset_password_id, new_password }: SetNewPasswordDto
  ) {
    const requestHost = new URL(request.headers.origin).host;
    await this.authService.setNewPassword(
      reset_password_id,
      new_password,
      requestHost.split('.')[0]
    );
  }

  @Delete('log-out')
  @ApiNoContentResponse()
  @UseGuards(AuthenticatedGuard)
  async logOut(@Req() request: Request, @Res() response: Response) {
    const sessionName = process.env.SESSION_NAME;
    await new Promise((resolve, reject) =>
      request.session.destroy((err) => {
        if (err) reject(err);
        resolve(1);
      })
    ).catch((err) =>
      response.status(500).json(
        new GlomExceptionResponse({
          error: 'Internal server error',
          message: err,
          path: request.url,
          timestamp: Date.now(),
        })
      )
    );
    response.clearCookie(sessionName);
    response.send(encrypt(`Cleared ${sessionName} cookie successfully.`));
  }

  @Get('user')
  @ApiOkResponse({ type: UserEntity })
  @UseGuards(AuthenticatedGuard)
  async getUser(@Req() request: Request) {
    return this.authService.getUser(request.user);
  }
}
