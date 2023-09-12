import { GlomPrismaModule } from '@glom/prisma';
import { Module } from '@nestjs/common';

@Module({})
export class GlomAuthModule {
  forRoot() {
    return {
      exports: [],
      providers: [],
      module: GlomAuthModule,
      imports: [GlomPrismaModule.forRoot({})],
    };
  }
}
