import { InjectRedis, Redis, RedisModule } from '@nestjs-modules/ioredis';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import RedisStore from 'connect-redis';
import { randomUUID } from 'crypto';
import * as session from 'express-session';
import * as passport from 'passport';

import { AppController } from './app.controller';
import { AppInterceptor } from './app.interceptor';
import { AppMiddleware } from './app.middleware';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot(),
    PassportModule.register({
      session: true,
    }),
    RedisModule.forRoot({
      config: {
        url: process.env.REDIS_URL,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
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
