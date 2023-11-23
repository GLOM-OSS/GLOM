import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PassportUser } from './auth';
import { AuthService } from './auth.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    super();
  }

  serializeUser(user: Express.User, done: (err, user: PassportUser) => void) {
    done(null, {
      login_id: user.login_id,
      cache_key: `cacheKey-${randomUUID()}`,
    });
  }

  async deserializeUser(
    user: PassportUser,
    done: (err, user: Express.User) => void
  ) {
    const cacheKey = user.cache_key;
    let deserialedUser = await this.cacheManager.get<Express.User>(cacheKey);
    if (!deserialedUser) {
      deserialedUser = await this.authService.deserializeUser(user);
      await this.cacheManager.set(cacheKey, deserialedUser);
    }
    done(null, deserialedUser);
  }
}
