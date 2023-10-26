import { Module, Provider } from '@nestjs/common';
import { GlomRedisModuleOptions } from './glom-redis';
import { GlomRedisService } from './glom-redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

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
        CacheModule.register({
          ttl: 5, // seconds
          isGlobal,
          store: redisStore,
        }),
      ],
    };
  }
}
