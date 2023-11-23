import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class GlomRedisService {
  redis: Redis;
  constructor(@InjectRedis() redis: Redis) {
    Object.assign(this, redis);
  }
}
