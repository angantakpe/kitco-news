const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const WebSocketManager = require('./websockets/websocket.manager');
const generateArticleHandler = require('./websockets/handlers/article.handler');

let server;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};

const startServer = () => {
  server = app.listen(config.port, () => {
    logger.info(`App listening to port ${config.port}`);
    initializeWebSocketManager();
  });
};

const initializeWebSocketManager = () => {
  const websocketManager = new WebSocketManager(8080, 8081);
  websocketManager.registerHandler('generateArticle', generateArticleHandler);
};

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

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

const registerProcessHandlers = () => {
  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
};

const runApp = async () => {
  await connectToDatabase();
  startServer();
  registerProcessHandlers();
};

runApp();
