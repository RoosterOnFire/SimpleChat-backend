import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { EventHandler } from './eventHandlers/SocketEventHandlers';
import {
  restoreSessionMiddleware,
  userValidationMiddleware,
} from './middlewares/SocketMiddleware';

const app = express();
app.use(cors({ origin: '*' }));

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    methods: ['GET', 'POST'],
  },
});

io.use(restoreSessionMiddleware);
io.use(userValidationMiddleware);
io.on('connection', EventHandler);

httpServer.listen(4000);
