import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import * as connectRedis from 'connect-redis';
import { randomUUID } from 'crypto';
import * as session from 'express-session';
import * as passport from 'passport';
import { createClient } from 'redis';

import { PassportModule } from '@nestjs/passport';
import { AnnualConfiguratorService } from '../services/annual-configurator.service';
import { LoginService } from '../services/login.service';
import { StudentService } from '../services/student.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PersonService } from '../services/person.service';
import { AnnualStudentService } from '../services/annual-student.service';
import { AppInterceptor } from './app.interceptor';
import { AppMiddleware } from './app.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TasksModule } from '@squoolr/tasks';
import { DemandModule } from './demand/demand.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({
      session: true,
    }),
    PrismaModule,
    TasksModule,
    AuthModule,
    DemandModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoginService,
    PersonService,
    StudentService,
    AnnualStudentService,
    AnnualConfiguratorService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const redisClient = createClient({ legacyMode: true });
    redisClient.connect().catch((message) => Logger.error(message));
    const RedisStore = connectRedis(session);

    consumer
      .apply(
        session({
          name: process.env.SESSION_NAME,
          store: new RedisStore({
            client: redisClient,
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          }),
          secret: process.env.SESSION_SECRET,
          genid: () => randomUUID(),
          saveUninitialized: false,
          resave: false,
          rolling: true,
          cookie: {
            maxAge: 60 * 60 * 1000, //60 minutes of inativity
          },
        }),
        passport.initialize(),
        passport.session(),
        AppMiddleware
      )
      .forRoutes('*');
  }
}
