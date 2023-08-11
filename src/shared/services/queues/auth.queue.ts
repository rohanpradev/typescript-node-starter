import { IAuthJob } from '@auth/interfaces/auth.interface';
import { BaseQueue, RabbitMQEventHandler } from '@service/queues/base.queue';

class AuthQueue extends BaseQueue {
  constructor(name: string = 'AuthQueue') {
    super(name);
  }

  async addAuthUserJob(data: IAuthJob) {
    const messagePayload = { content: data, options: { contentType: 'application/json' } };
    await this.sendMessage(messagePayload);
  }

  async listenToAuthJob(handler: RabbitMQEventHandler): Promise<void> {
    await this.listenToEvent(handler);
  }
}

export const authQueue = new AuthQueue('auth');
