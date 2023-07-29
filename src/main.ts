import express, { Express } from 'express';
import ApplicationServer from '@root/setup-server';
import databaseConnection from '@root/setup-database';
import { config } from '@root/config';

class Application {
  public initialize(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const server: ApplicationServer = new ApplicationServer(app);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.initialize();
