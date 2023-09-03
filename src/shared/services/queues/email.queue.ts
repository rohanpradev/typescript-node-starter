import logger from '@root/logger';
import { mailTransport } from '@service/emails/mail.transport';
import { BaseQueue } from '@service/queues/base.queue';
import { IEmailJob } from '@user/interfaces/user.interface';

class EmailQueue extends BaseQueue {
  constructor(name: string = 'EmailQueue') {
    super(name);
  }

  async addEmailJob(data: IEmailJob) {
    const messagePayload = { content: data, options: { contentType: 'application/json' } };
    await this.sendMessage(messagePayload);
    await this.listenToEvent(this.processSendEmail);
  }

  private async processSendEmail(value: IEmailJob) {
    try {
      const { receiverEmail, subject, template } = value;
      console.log(receiverEmail, subject);
      await mailTransport.sendEmail(receiverEmail, subject, template);
      logger.info('Email sent successfully');
    } catch (error) {
      logger.error(error);
    }
  }
}

export const emailQueue = new EmailQueue('email');
