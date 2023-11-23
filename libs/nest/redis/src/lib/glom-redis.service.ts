import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis, RedisOptions } from 'ioredis';

export class GlomRedisService {
  constructor(@InjectRedis() redis: Redis) {
    Object.assign(this, redis);
  }
}
