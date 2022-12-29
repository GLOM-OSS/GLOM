import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TasksModule } from '@squoolr/tasks';

import * as connectRedis from 'connect-redis';
import { randomUUID } from 'crypto';
import * as session from 'express-session';
import * as passport from 'passport';
import { createClient } from 'redis';
// import * as csurf from 'csurf';
import helmet from 'helmet';

import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppInterceptor } from './app.interceptor';
import { AppMiddleware } from './app.middleware';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfiguratorModule } from './configurator/configurator.module';
import { CoordinatorModule } from './coordinator/coordinator.module';
import { DemandModule } from './demand/demand.module';
import { RegistryModule } from './registry/registry.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ConfigModule.forRoot(),
    PassportModule.register({
      session: true,
    }),
    PrismaModule,
    TasksModule,
    AuthModule,
    DemandModule,
    ConfiguratorModule,
    CoordinatorModule,
    RegistryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const redisClient = createClient({
      legacyMode: true,
      url: `redis://${process.env.REDIS_HOST}`,
    });
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
        helmet(),
        // csurf(),
        AppMiddleware
      )
      .forRoutes('*');
  }
}
