import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import {
  DeserializeSessionData,
  PassportSession,
  RecordValue,
  UserRole,
} from '../../utils/types';
import { AuthService } from './auth.service';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  serializeUser(
    user: Record<string, RecordValue>,
    done: (err, user: PassportSession) => void
  ) {
    done(null, {
      log_id: user['log_id'] as string,
      roles: user['roles'] as UserRole[],
      login_id: user['login_id'] as string,
      job_name: user['job_name'] as string,
      cookie_age: Number(user['cookie_age'] ?? 3600), //1 hour equivalent
      academic_year_id: user['academic_year_id'] as string,
    });
  }

  async deserializeUser(
    user: PassportSession,
    done: (err, user: DeserializeSessionData) => void
  ) {
    const deserialedUser = await this.authService.deserializeUser(user);
    done(null, deserialedUser);
  }
}
