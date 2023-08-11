import { config } from '@root/config';
import logger from '@root/logger';
import { createClient } from 'redis';

export type RedisClient = ReturnType<typeof createClient>;

export abstract class BaseCache {
  client: RedisClient;

  constructor() {
    this.client = createClient({
      username: config.REDIS_USERNAME,
      password: config.REDIS_PASSWORD,
      socket: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
      },
    });
    this.cacheError();
  }

  private cacheError(): void {
    this.client.on('error', logger.error);
  }
}
