import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { PassportUser, RecordValue, UserRole } from './auth';
import { AuthService } from './auth.service';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  serializeUser(user: Express.User, done: (err, user: PassportUser) => void) {
    done(null, {
      // log_id: user.lo,
      // roles: user.roles,
      login_id: user.login_id,
      // job_name: user.job_name,
      // cookie_age: Number(user.cookie_age ?? 3600), //1 hour equivalent
      // academic_year_id: user.academic_year_id,
    });
  }

  async deserializeUser(
    user: PassportUser,
    done: (err, user: Express.User) => void
  ) {
    const deserialedUser = await this.authService.deserializeUser(user);
    done(null, deserialedUser);
  }
}
