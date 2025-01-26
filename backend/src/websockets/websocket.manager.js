const WebSocket = require('ws');
const http = require('http');
const logger = require('../config/logger');

class WebSocketManager {
  constructor(wsPort, healthCheckPort) {
    this.wss = this.initializeWebSocketServer(wsPort);
    this.handlers = {};
    this.initializeHealthCheckServer(healthCheckPort);
  }

  initializeWebSocketServer(port) {
    const server = new WebSocket.Server({ port });
    server.on('connection', (ws, req) => this.onConnection(ws, req));
    logger.info(`WebSocket server running on port ${port}`);
    return server;
  }

  onConnection(ws, req) {
    logger.info('WebSocket: New client connected');

    if (ws.readyState === WebSocket.OPEN) {
      logger.info('WebSocket: Connection is open');
    }

    ws.send(JSON.stringify({ message: 'Welcome to Kitco News WebSocket server!' }));

    ws.on('message', (message) => {
      logger.info(`WebSocket: Raw message received: ${message}`);
      logger.info(`WebSocket: Message received: ${JSON.stringify(message, null, 2)}`);
      this.onMessage(ws, message);
    });

    ws.on('close', () => logger.info('WebSocket: Client disconnected'));
    ws.on('error', (error) => logger.error('WebSocket: Error:', error));
  }

  onMessage(ws, message) {
    logger.info(`WebSocket: Received message: ${JSON.stringify(message, null, 2)}`);
    try {
      const { type, ...payload } = JSON.parse(message);
      const handler = this.handlers[type];
      if (handler) {
        handler(ws, payload);
      } else {
        this.sendError(ws, `No handler for type: ${type}`);
      }
    } catch (error) {
      this.sendError(ws, 'Invalid message format');
      logger.error('Error handling message:', error);
    }
  }

  sendError(ws, errorMessage) {
    ws.send(JSON.stringify({ error: errorMessage }));
  }

  initializeHealthCheckServer(port) {
    const server = http.createServer((req, res) => {
      if (req.url === '/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'WebSocket server is running' }));
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    server.listen(port, () => {
      logger.info(`WebSocket health check server running on port ${port}`);
    });
  }

  registerHandler(type, handler) {
    this.handlers[type] = handler;
  }
}

module.exports = WebSocketManager;
