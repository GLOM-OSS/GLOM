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
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiBody({ type: SignInDto })
  @ApiCreatedResponse({ type: UserEntity })
  async signIn(@Req() request: Request) {
    let user = request.user;
    if (user.school_id) {
      const annualSessionData = await this.authService.getAnnualSessionData(
        request,
        user.login_id
      );
      user = { ...user, ...annualSessionData };
    }
    await this.authService.createSessionLog(request);
    return new UserEntity(await this.authService.getUser(user));
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
