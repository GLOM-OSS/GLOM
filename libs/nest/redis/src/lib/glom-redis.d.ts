import { RedisModuleOptions } from '@nestjs-modules/ioredis';

export type GlomRedisModuleOptions = RedisModuleOptions & {
  isGlobal?: boolean;
};
