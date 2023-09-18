import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Profile, Strategy } from 'passport-google-oauth20';
import { GlomAuthService } from '../../glom-auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: GlomAuthService) {
    super({
      callbackURL: `${process.env.NX_API_BASE_URL}/auth/third-parthies/google/callback`,
      clientSecret: process.env.GOOGLE_SECRET,
      clientID: process.env.GOOGLE_CLIENT_ID,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(request: Request, _a: string, _r: string, profile: Profile) {
    const {
      _json: { email_verified },
    } = profile;
    console.log(profile);
    if (!email_verified) throw new UnauthorizedException();
    return this.authService.authenticateUser(request, profile);
  }
}
