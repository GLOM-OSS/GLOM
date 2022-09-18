import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Login, Person } from '@prisma/client';
import { AUTH01, AUTH401 } from '../../../errors';
import { Request } from 'express';
import { Profile, Strategy } from 'passport-google-oauth20';
import { PersonService } from '../../../services/person.service';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    private personService: PersonService
  ) {
    super({
      callbackURL: `${process.env.NX_API_BASE_URL}/auth/redirect`,
      clientSecret: process.env.GOOGLE_SECRET,
      clientID: process.env.GOOGLE_CLIENT_ID,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
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
      const person = (await this.personService.findOne({
        where: { email },
        include: {
          Logins: true,
        },
      })) as Person & { Logins: Login[] };
      if (person) {
        const { Logins: userLogins } = person;
        for (let i = 0; i < userLogins.length; i++) {
          const login = userLogins[i];
          const user = await this.authService.validateLogin(
            new URL(request.headers.origin).hostname,
            login
          );
          return { ...person, ...user };
        }
      }
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized access',
        message: AUTH401['Fr'],
      });
    }
    throw new UnauthorizedException({
      statusCode: HttpStatus.UNAUTHORIZED,
      error: 'Unauthorized access',
      message: AUTH01['Fr'],
    });
  }
}
