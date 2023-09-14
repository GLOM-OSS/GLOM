import { GlomPrismaModule } from '@glom/prisma';
import { Module } from '@nestjs/common';
import { GlomAuthService } from './glom-auth.service';
import { GlomMailerModule } from '@glom/nest-mailer';
import { LocalStrategy } from './local/local.strategy';

@Module({})
export class GlomAuthModule {
  static forRoot() {
    return {
      module: GlomAuthModule,
      exports: [GlomAuthService],
      providers: [GlomAuthService, LocalStrategy],
      imports: [GlomPrismaModule.forRoot({}), GlomMailerModule],
    };
  }
}
