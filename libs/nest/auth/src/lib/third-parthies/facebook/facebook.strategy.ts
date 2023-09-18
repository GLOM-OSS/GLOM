import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Profile, Strategy } from 'passport-google-oauth20';
import { GlomAuthService } from '../../glom-auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: GlomAuthService) {
    super({
      callbackURL: `${process.env.NX_API_BASE_URL}/auth/third-parthies/facebook/callback`,
      clientSecret: process.env.FACEBOOK_SECRET,
      clientID: process.env.FACEBOOK_APP_ID,
      profileFields: ['emails', 'name'],
      passReqToCallback: true,
      scope: 'email',
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
