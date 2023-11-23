import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import RedisStore from 'connect-redis';
import { randomUUID } from 'crypto';
import * as session from 'express-session';
import * as passport from 'passport';

import { GlomExceptionsFilter } from '@glom/execeptions';
import { GlomPrismaModule } from '@glom/prisma';

import { GlomPaymentModule } from '@glom/payment';
import { GlomRedisModule } from '@glom/redis';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AcademicYearsModule } from '../modules/academic-years/academic-years.module';
import { AmbassadorsModule } from '../modules/ambassadors/ambassadors.module';
import { ClassroomsModule } from '../modules/classrooms/classrooms.module';
import { DepartmentsModule } from '../modules/departments/departments.module';
import { MajorsModule } from '../modules/majors/majors.module';
import { PaymentsModule } from '../modules/payments/payments.module';
import { SchoolsModule } from '../modules/schools/schools.module';
import { StaffModule } from '../modules/staff/staff.module';
import { seedData } from './app-seeder.factory';
import { AppController } from './app.controller';
import { AppInterceptor } from './app.interceptor';
import { AppMiddleware } from './app.middleware';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
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
    GlomRedisModule.forRoot({
      isGlobal: true,
      config: {
        url: process.env.REDIS_URL,
      },
    }),
    GlomPrismaModule.forRoot({
      isGlobal: true,
      seedData,
    }),
    GlomPaymentModule.forRoot({
      isGlobal: true,
      aggrConfigs: [
        {
          aggr: 'notchpay',
          options: {
            apiKey: process.env.NOTCH_API_KEY,
            endpoint: 'api.notchpay.co',
          },
        },
      ],
    }),
    AuthModule,
    PaymentsModule,
    SchoolsModule,
    AcademicYearsModule,
    InquiriesModule,
    AmbassadorsModule,
    DepartmentsModule,
    MajorsModule,
    ClassroomsModule,
    StaffModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ...[AppInterceptor, ClassSerializerInterceptor, CacheInterceptor].map(
      (Interceptor) => ({ provide: APP_INTERCEPTOR, useClass: Interceptor })
    ),
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
  constructor(@InjectRedis() private redisClient: Redis) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          name: process.env.SESSION_NAME,
          store: new RedisStore({ client: this.redisClient }),
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
