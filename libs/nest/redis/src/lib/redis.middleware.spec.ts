import { RedisMiddleware } from './redis.middleware';

describe('RedisMiddleware', () => {
  it('should be defined', () => {
    expect(new RedisMiddleware()).toBeDefined();
  });
});
