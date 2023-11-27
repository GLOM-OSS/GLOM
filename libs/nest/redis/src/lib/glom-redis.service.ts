import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class GlomRedisService {
  constructor(@InjectRedis() public client: Redis) {}
}
