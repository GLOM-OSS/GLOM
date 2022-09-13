import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import * as connectRedis from 'connect-redis';
import { randomUUID } from 'crypto';
import * as session from 'express-session';
import * as passport from 'passport';
import { createClient } from 'redis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
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
            maxAge: 10 * 60 * 1000, //10 minutes of inativity
          },
        }),
        passport.initialize(),
        passport.session()
      )
      .forRoutes('*');
  }
}
