import logger from '@root/logger';
import { BaseCache } from '@service/redis/base.class';

class RedisConnection extends BaseCache {
  constructor() {
    super();
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      const res = await this.client.ping();
      logger.info(res);
    } catch (error) {
      logger.error(error);
    }
  }
}

export const redisConnection = new RedisConnection();
