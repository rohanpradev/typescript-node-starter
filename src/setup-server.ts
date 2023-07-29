import { Application, json, urlencoded, Request, Response, NextFunction } from 'express';
import { Server as HttpServer } from 'http';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { config } from '@root/config';
import applicationRoutes from '@root/routes';
import { CustomError, IErrorResponse } from '@global/helpers/error-handler';
import logger from '@root/logger';

const SERVER_PORT = 5000;

class ApplicationServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600,
        secure: config.NODE_ENV !== 'development',
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({ origin: config.CLIENT_URL, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], credentials: true })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routesMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  private globalErrorHandler(app: Application): void {
    app.all('*', (req: Request, res: Response, _next: NextFunction) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found.` });
    });
    app.use((err: IErrorResponse, _req: Request, res: Response, _next: NextFunction) => {
      logger.error(err);
      if (err instanceof CustomError) return res.status(err.statusCode).json(err.serializeErrors());
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: HttpServer = new HttpServer(app);
      const socketIO: Server = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOConnections(socketIO);
    } catch (error) {
      logger.error(error);
    }
  }

  private async createSocketIO(httpServer: HttpServer): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      },
    });
    const pubClient = createClient({
      username: config.REDIS_USERNAME,
      password: config.REDIS_PASSWORD,
      socket: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
      },
    });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: HttpServer): void {
    logger.info(`Server has started with process ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      logger.info(`Server running on port ${SERVER_PORT}`);
    });
  }

  private socketIOConnections(_io: Server): void {}
}

export default ApplicationServer;
