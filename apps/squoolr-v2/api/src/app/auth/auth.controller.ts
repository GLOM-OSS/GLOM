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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { PassportUser } from './auth';
import {
  SetNewPasswordDto,
  ResetPasswordDto,
  SignInDto,
  User,
  SingInResponse,
  PersonEntity,
} from './auth.dto';
import { AuthenticatedGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LocalGuard } from './local/local.guard';
import { AcademicYear } from '@prisma/client';

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
  @ApiCreatedResponse({ type: SingInResponse })
  async signIn(@Req() request: Request, @Body() login: SignInDto) {
    let user = request.user;
    let academicYears: AcademicYear[] = [];
    if (user.school_id) {
      const [result] = await Promise.all([
        this.authService.updateUserSession(request, user.login_id),
        this.authService.openSession(request.sessionID, user.login_id),
      ]);
      academicYears = result.academicYears;
      user = { ...user, ...result.sessionData };
    }
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
    return request.session.destroy(async (err) => {
      if (err)
        throw new InternalServerErrorException('Could not detroy session');
      await this.prismaService.log.updateMany({
        data: { logged_out_at: new Date() },
        where: { log_id: request.sessionID },
      });
    });
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
