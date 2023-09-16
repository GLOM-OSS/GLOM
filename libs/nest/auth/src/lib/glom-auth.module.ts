import { GlomPrismaModule } from '@glom/prisma';
import { DynamicModule, Module } from '@nestjs/common';
import { GlomAuthService } from './glom-auth.service';
import { GlomMailerModule } from '@glom/nest-mailer';
import { LocalStrategy } from './local/local.strategy';
import { GlomAuthModuleOptions } from './glom-auth.type';
import { AUTH_ROLES, GlomAuthSeeder } from './glom-auth.seed';
import { GlomAuthController } from './glom-auth.controller';

@Module({})
export class GlomAuthModule {
  static forRoot({
    roles,
    useGlobalDeps,
  }: GlomAuthModuleOptions): DynamicModule {
    return {
      module: GlomAuthModule,
      exports: [GlomAuthService],
      providers: [
        LocalStrategy,
        GlomAuthSeeder,
        GlomAuthService,
        {
          provide: AUTH_ROLES,
          useValue: roles,
        },
      ],
      controllers: [GlomAuthController],
      imports: useGlobalDeps
        ? []
        : [
            GlomPrismaModule.forRoot(),
            GlomMailerModule.forRoot({
              authType: 'Login',
              user: process.env.APP_EMAIL,
              host: process.env.EMAIL_HOST,
              pass: process.env.EMAIL_PASS,
              templatesDir: `${process.env.NX_API_BASE_URL}/templates`,
            }),
          ],
    };
  }
}
