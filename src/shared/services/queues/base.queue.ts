import amqp from 'amqplib';
import { IAuthJob } from '@auth/interfaces/auth.interface';
import { IUserJob } from '@user/interfaces/user.interface';
import { config } from '@root/config';
import logger from '@root/logger';

type IBaseJob = IAuthJob | IUserJob;

export interface RabbitMQMessage {
  content: IBaseJob;
  options?: amqp.Options.Publish;
}

export type RabbitMQEventHandler = (content: IBaseJob) => void;

export abstract class BaseQueue {
  protected connectionPromise: Promise<amqp.Connection>;
  protected channelPromise: Promise<amqp.Channel>;

  constructor(protected queueName: string) {
    this.connectionPromise = this.createConnection();
    this.channelPromise = this.createChannel();
  }

  private async createConnection(): Promise<amqp.Connection> {
    const connection = await amqp.connect(config.RABBIT_MQ_URL!);
    return connection;
  }

  private async createChannel(): Promise<amqp.Channel> {
    const connection = await this.createConnection();
    const channel = await connection.createChannel();
    await channel.assertQueue(this.queueName, { durable: true });
    return channel;
  }

  protected async sendMessage(message: RabbitMQMessage): Promise<void> {
    const channel = await this.channelPromise;
    const messageOptions: amqp.Options.Publish = {
      persistent: true,
      ...message.options,
    };
    channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message.content)), messageOptions);
  }

  protected async listenToEvent(handler: RabbitMQEventHandler): Promise<void> {
    const channel = await this.channelPromise;
    channel.consume(this.queueName, async (message) => {
      if (message) {
        const content = JSON.parse(message.content.toString());
        handler(content);
        channel.ack(message);
      }
    });
  }

  async close(): Promise<void> {
    const channel = await this.channelPromise;
    await channel.close();
    const connection = await this.connectionPromise;
    await connection.close();
  }
}
