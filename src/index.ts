import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { EventHandler } from './helpers/EventHandler';
import { userValidationMiddleware } from './helpers/SocketMiddleware';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: '*' }));

io.on('connection', EventHandler);

io.use(userValidationMiddleware);

httpServer.listen(4000);
