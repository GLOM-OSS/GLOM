import { Module, Provider } from '@nestjs/common';
import { GlomRedisModuleOptions } from './glom-redis';
import { GlomRedisService } from './glom-redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({})
export class GlomRedisModule {
  static async forRoot({ isGlobal = false, config }: GlomRedisModuleOptions) {
    const providers: Provider[] = [
      {
        provide: GlomRedisService,
        useValue: new GlomRedisService(config.url, config),
      },
    ];

    return {
      providers,
      global: isGlobal,
      exports: providers,
      module: GlomRedisModule,
      imports: [
        RedisModule.forRoot({
          config: {
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
