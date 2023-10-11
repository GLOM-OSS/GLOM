import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { RoleEnum } from './app.decorators';
import { AppService } from './app.service';

import { GlomAuthModule } from '@glom/nest-auth';
import { GlomMailerModule } from '@glom/nest-mailer';
import { GlomPrismaModule } from '@glom/prisma';

import { randomUUID } from 'crypto';
import * as session from 'express-session';
import * as passport from 'passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GlomPrismaModule.forRoot({
      isGlobal: true,
    }),
    GlomMailerModule.forRoot({
      authType: 'Login',
      user: process.env.APP_EMAIL,
      host: process.env.EMAIL_HOST,
      pass: process.env.EMAIL_PASS,
      templatesDir: `${process.env.NX_API_BASE_URL}/templates`,
    }),
    GlomAuthModule.forRoot<RoleEnum>({
      omitModuleDeps: true,
      strategies: ['google', 'facebook'],
      roles: [
        {
          role_name: RoleEnum.Client,
          origin: process.env.CLIENT_ORIGIN,
        },
        {
          role_name: RoleEnum.Admin,
          origin: process.env.ADMIN_ORIGIN,
        },
        {
          role_name: RoleEnum.Merchant,
          origin: process.env.MERCHANT_ORIGIN,
        },
        {
          role_name: RoleEnum.Technician,
          origin: process.env.TECHNICIAN_ORIGIN,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          name: process.env.SESSION_NAME,
          secret: process.env.SESSION_SECRET,
          genid: () => randomUUID(),
          saveUninitialized: false,
          resave: false,
          rolling: true,
          cookie: {
            maxAge: 60 * 60 * 1000, //60 minutes of inativity,
          },
        }),
        passport.initialize(),
        passport.session()
      )
      .forRoutes('*');
  }
}
