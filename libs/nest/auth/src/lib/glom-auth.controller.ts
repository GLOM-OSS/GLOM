import { GlomExceptionResponse } from '@glom/execeptions';
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiPreconditionFailedResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { encrypt } from '@glom/encrypter';
import { Request, Response } from 'express';
import {
  ResetPasswordDto,
  ResetPasswordEmail,
  SignInDto,
  SignUpDto,
  UserEntity,
} from './glom-auth.dto';
import { AuthenticatedGuard } from './glom-auth.guard';
import { GlomAuthService } from './glom-auth.service';
import { LocalGuard } from './local/local.guard';

@Controller('auth')
@ApiTags('Authentication')
@ApiBadRequestResponse({
  description:
    'Bad request. This often happens when the request payload it not respected.',
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error. An unexpected exception was thrown',
})
export class GlomAuthController {
  constructor(private glomAuthService: GlomAuthService) {}

  @Post('sign-in')
  @UseGuards(LocalGuard)
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 201, type: UserEntity })
  @ApiOperation({
    summary: 'Sign in to authenticate a user',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized request. incorrect email or password',
  })
  @ApiPreconditionFailedResponse({
    description:
      'Precondition failed, user account must be activated before signing in.',
  })
  async signIn(@Req() req: Request) {
    return req.user;
  }

  @Post('sign-up')
  @ApiResponse({ status: 201, type: UserEntity })
  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiConflictResponse({
    description:
      'Conflict, user email is already registered with another account.',
  })
  async signUp(@Req() req: Request, @Body() newUser: SignUpDto) {
    const user = await this.glomAuthService.registerUser(newUser, 'Client');
    await this.glomAuthService.login(req, user);
    return user;
  }

  @Post('reset-password')
  @ApiNoContentResponse({ description: 'OK' })
  @ApiOperation({
    summary: 'Request a reset password id for reset link',
  })
  async resetPassword(
    @Req() request: Request,
    @Body() { email }: ResetPasswordEmail
  ) {
    const origin = new URL(request.headers.origin).host;
    return await this.glomAuthService.resetPassword(email, origin);
  }

  @Post('new-password')
  @ApiNoContentResponse({ description: 'OK' })
  @ApiOperation({
    summary:
      'Set new password with the  previously requested `reset_password_id`',
  })
  async setNewPassword(
    @Req() request: Request,
    @Body() { new_password, reset_password_id }: ResetPasswordDto
  ) {
    const origin = new URL(request.headers.origin).host;
    return await this.glomAuthService.setNewPassword(
      reset_password_id,
      new_password,
      origin
    );
  }

  @Patch('reset-password/:reset_password_id/cancel')
  @ApiNoContentResponse({ description: 'OK' })
  @ApiOperation({
    summary: 'Cancel a request password request',
  })
  async cancelResetPasswordRequest(
    @Res() response: Response,
    @Param('reset_password_id') reset_password_id: string
  ) {
    await this.glomAuthService.cancelResetPasswordRequet(reset_password_id);
    return response.redirect(`https://${process.env.CLIENT_ORIGIN}`);
  }

  @Delete('log-out')
  @UseGuards(AuthenticatedGuard)
  async logOut(@Req() request, @Res() response: Response) {
    request.session.destroy((err) => {
      if (err)
        return response.status(500).json(
          new GlomExceptionResponse({
            error: 'Internal server error',
            message: err,
            path: request.url,
            timestamp: Date.now(),
          })
        );
      response.clearCookie(process.env.SESSION_NAME);
      response.send(
        encrypt(`Cleared ${process.env.SESSION_NAME} cookie successfully.`)
      );
    });
  }
}
