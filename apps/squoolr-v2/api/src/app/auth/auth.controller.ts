import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AcademicYear } from '@prisma/client';
import { Request } from 'express';
import {
  PersonEntity,
  ResetPasswordDto,
  SetNewPasswordDto,
  SignInDto,
  SingInResponse
} from './auth.dto';
import { AuthenticatedGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LocalGuard } from './local/local.guard';

@ApiBearerAuth()
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
      user = { ...user, ...result.sessionData };
    }
    await this.authService.openSession(request, user.login_id);
    return new SingInResponse({ user, academicYears });
  }

  @Post('reset-password')
  @ApiNoContentResponse()
  async resetPassword(
    @Req() request: Request,
    @Body() { email }: ResetPasswordDto
  ) {
    const squoolr_client = new URL(request.headers.origin).host;
    await this.authService.resetPassword(email, squoolr_client);
  }

  @Post('new-password')
  @ApiNoContentResponse()
  async setNewPassword(
    @Req() request: Request,
    @Body() { reset_password_id, new_password }: SetNewPasswordDto
  ) {
    const squoolr_client = new URL(request.headers.origin).host;
    await this.authService.setNewPassword(
      reset_password_id,
      new_password,
      squoolr_client
    );
  }

  @Delete('log-out')
  @UseGuards(AuthenticatedGuard)
  async logOut(@Req() request: Request) {
    await new Promise((resolve) =>
      request.session.destroy(async (err) => {
        if (err)
          throw new InternalServerErrorException('Could not detroy session');
        await this.authService.closeSession(request.sessionID, {
          logged_out_at: new Date(),
        });
        resolve(1);
      })
    );
  }

  @Get('user')
  @ApiOkResponse({ type: PersonEntity })
  @UseGuards(AuthenticatedGuard)
  async getUser(@Req() request: Request) {
    const email = request.query.email as string;
    const person = email
      ? await this.authService.getPerson(email)
      : request.user;
    return new PersonEntity(person);
  }
}
