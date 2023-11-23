import { RedisModule } from '@nestjs-modules/ioredis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { GlomRedisModuleOptions } from './glom-redis';
import { GlomRedisService } from './glom-redis.service';

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
          store: require('cache-manager-ioredis'),
        }),
      ],
    };
  }
}
