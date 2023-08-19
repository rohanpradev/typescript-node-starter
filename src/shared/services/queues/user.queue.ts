import { userService } from '@service/db/user.service';
import { BaseQueue } from '@service/queues/base.queue';
import { IUserJob } from '@user/interfaces/user.interface';

class UserQueue extends BaseQueue {
  constructor(name: string = 'UserQueue') {
    super(name);
  }

  async addUserJob(data: IUserJob) {
    const messagePayload = { content: data, options: { contentType: 'application/json' } };
    await this.sendMessage(messagePayload);
    await this.listenToEvent(userService.addUserData);
  }
}

export const userQueue = new UserQueue('user');
