import mongoose from 'mongoose';
import { config } from './config';
import logger from './logger';

export default () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URL!)
      .then(() => logger.info('Successfully connect to DB'))
      .catch((err) => {
        logger.error(err);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
