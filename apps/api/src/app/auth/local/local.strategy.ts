import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { LogService } from '../../../services/log.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private logService: LogService
  ) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(request: Request, email: string, password: string) {
    const origin = request.headers.origin.replace('https://', '');
    const user = await this.authService.validateUser(origin, email, password);
    const { log_id } = await this.logService.create({
      Login: { connect: { login_id: user.login_id } },
    });
    return { log_id, ...user };
  }
}
