import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { GlomAuthService } from './glom-auth.service';
import { User } from './glom-auth.type';

@Injectable()
export class GlomAuthSerializer extends PassportSerializer {
  constructor(private authService: GlomAuthService) {
    super();
  }
  serializeUser(user: User, done: (err, user: { login_id: string }) => void) {
    done(null, { login_id: user.login_id });
  }

  async deserializeUser(
    user: { login_id: string },
    done: (err, user: User) => void
  ) {
    const deserializeUser = await this.authService.findOne(user.login_id);
    done(null, deserializeUser);
  }
}
