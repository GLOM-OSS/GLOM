import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { GlomAuthService } from '../glom-auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: GlomAuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(request: Request, email: string, password: string) {
    const user = await this.authService.validateUser(request, email, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
