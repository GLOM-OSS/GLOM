import { GlomMailerModule } from '@glom/nest-mailer';
import { GlomPrismaModule } from '@glom/prisma';
import { DynamicModule, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { GlomAuthController } from './glom-auth.controller';
import { AUTH_ROLES, GlomAuthSeeder } from './glom-auth.seed';
import { GlomAuthService } from './glom-auth.service';
import { GlomAuthModuleOptions } from './glom-auth.type';
import { LocalStrategy } from './local/local.strategy';
import { ThirdParthiesModule } from './third-parthies/third-parthies.module';
import { PassportModule } from '@nestjs/passport';
import { GlomAuthSerializer } from './glom-auth.serializer';

@Module({})
export class GlomAuthModule {
  static forRoot<R>({
    roles,
    strategies,
    omitModuleDeps,
  }: GlomAuthModuleOptions<R>): DynamicModule {
    const ThirdParthiesDynamicModule = ThirdParthiesModule.forRoot({
      strategies: strategies ?? [],
      roles,
    });
    const ClsDynamicModule = ClsModule.forRoot({
      global: true,
      middleware: {
        // automatically mount the
        // ClsMiddleware for all routes
        mount: true,
        // and use the setup method to
        // provide default store values.
        setup: (cls, req) => {
          cls.set('refererUrl', req.body['referer-url']);
        },
      },
    });
    return {
      module: GlomAuthModule,
      exports: [GlomAuthService],
      providers: [
        LocalStrategy,
        GlomAuthSeeder,
        GlomAuthService,
        GlomAuthSerializer,
        {
          provide: AUTH_ROLES,
          useValue: roles,
        },
      ],
      controllers: [GlomAuthController],
      imports: [
        PassportModule.register({
          session: true,
        }),
        ClsDynamicModule,
        ThirdParthiesDynamicModule,
        ...(omitModuleDeps
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
            ]),
      ],
    };
  }
}
