import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AUTH01 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private personService: typeof this.prismaService.person;

  constructor(
    private prismaService: PrismaService,
    private authService: AuthService
  ) {
    super({
      callbackURL: `${process.env.NX_API_BASE_URL}/auth/redirect`,
      clientSecret: process.env.GOOGLE_SECRET,
      clientID: process.env.GOOGLE_CLIENT_ID,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
    this.personService = prismaService.person;
  }

  async validate(
    request: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile
  ) {
    const {
      _json: { email_verified, email },
    } = profile;
    if (email_verified) {
      return this.authService.locallyValidateUser(request, email);
    }
    throw new UnauthorizedException({
      statusCode: HttpStatus.UNAUTHORIZED,
      error: 'Unauthorized access',
      message: AUTH01['Fr'],
    });
  }
}
