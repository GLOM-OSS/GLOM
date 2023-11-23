import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { GlomRedisModuleOptions } from './glom-redis';
import { GlomRedisService } from './glom-redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({})
export class GlomRedisModule {
  static async forRoot({ isGlobal = false, config }: GlomRedisModuleOptions) {
    return {
      global: isGlobal,
      module: GlomRedisModule,
      providers: [GlomRedisService],
      exports: [GlomRedisService],
      imports: [
        RedisModule.forRoot({
          config: {
            ...config,
            url: config.url,
          },
        }),
        CacheModule.register({
          isGlobal,
          ttl: 60000,
          store: redisStore,
        }),
      ],
    };
  }
}
