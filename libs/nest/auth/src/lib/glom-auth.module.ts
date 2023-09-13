import { GlomPrismaModule } from '@glom/prisma';
import { Module } from '@nestjs/common';
import { GlomAuthService } from './glom-auth.service';

@Module({})
export class GlomAuthModule {
  forRoot() {
    return {
      module: GlomAuthModule,
      exports: [GlomAuthService],
      providers: [GlomAuthService],
      imports: [GlomPrismaModule.forRoot({})],
    };
  }
}
