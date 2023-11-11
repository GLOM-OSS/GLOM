import { Redis, RedisOptions } from 'ioredis';

export class GlomRedisService extends Redis {
  constructor(url: string, options: RedisOptions) {
    super(url, options);
  }
}
