import { IAuthJob } from '@auth/interfaces/auth.interface';
import { authService } from '@service/db/auth.service';
import { BaseQueue } from '@service/queues/base.queue';

class AuthQueue extends BaseQueue {
  constructor(name: string = 'AuthQueue') {
    super(name);
  }

  async addAuthUserJob(data: IAuthJob) {
    const messagePayload = { content: data, options: { contentType: 'application/json' } };
    await this.sendMessage(messagePayload);
    await this.listenToEvent(authService.createAuthUser);
  }
}

export const authQueue = new AuthQueue('auth');
