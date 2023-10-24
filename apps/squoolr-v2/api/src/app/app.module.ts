import { InjectRedis, Redis, RedisModule } from '@nestjs-modules/ioredis';
import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  APP_PIPE,
  Reflector,
} from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import RedisStore from 'connect-redis';
import { randomUUID } from 'crypto';
import * as session from 'express-session';
import * as passport from 'passport';

import { GlomExceptionsFilter } from '@glom/execeptions';
import { TasksModule } from '@glom/nest-tasks';
import { GlomPrismaModule } from '@glom/prisma';

import { AcademicYearsModule } from './academic-years/academic-years.module';
import { AmbassadorsModule } from './ambassadors/ambassadors.module';
import { seedData } from './app-seeder.factory';
import { AppController } from './app.controller';
import { AppInterceptor } from './app.interceptor';
import { AppMiddleware } from './app.middleware';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DemandModule } from './demand/demand.module';
import { InquiriesModule } from './inquiries/inquiries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot(),
    PassportModule.register({
      session: true,
    }),
    RedisModule.forRoot({
      config: {
        url: process.env.REDIS_URL,
      },
    }),
    GlomPrismaModule.forRoot({
      isGlobal: true,
      seedData,
    }),
    TasksModule,
    AuthModule,
    DemandModule,
    AcademicYearsModule,
    InquiriesModule,
    AmbassadorsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlomExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
      }),
    },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          name: process.env.SESSION_NAME,
          store: new RedisStore({ client: this.redis }),
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
        passport.session(),
        AppMiddleware
      )
      .forRoutes('*');
  }
}
