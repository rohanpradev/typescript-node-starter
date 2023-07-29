import pino from 'pino';
import pretty from 'pino-pretty';

const logger = pino(
  pretty({
    colorize: true,
    hideObject: true,
    translateTime: 'HH:MM:ss',
    messageFormat: '{if req}url:{req.url}{end} {msg}',
    levelFirst: true,
  })
);

export default logger;
