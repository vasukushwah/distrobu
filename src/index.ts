import mongoose from 'mongoose';
import config from './config/config';
import logger from './modules/logger/logger';
import startApp from './app';


let server: any;
mongoose.connect(config.mongoose.url).then(() => {
  logger.info('Connected to MongoDB');
  server = startApp()
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
