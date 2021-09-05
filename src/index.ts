import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import {
  broadcastChatJoin,
  broadcastConnection,
  broadcastDisconnection,
  broadcastUsers,
} from './events';
import { ChatSocket } from '@/types/type';
import { isExistingNickname } from './database';
import { MISSING_NICKNAME, NICKNAME_IN_USE } from './constants/errors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: '*' }));

io.on('connection', (socket: ChatSocket) => {
  broadcastConnection(socket);
  broadcastUsers(socket);
  broadcastChatJoin(socket);

  socket.on('chat:message', (payload) => {
    socket.broadcast.emit('chat:message', payload);
  });

  socket.on('disconnect', () => {
    broadcastDisconnection(socket);
    broadcastUsers(socket);
  });
});

io.use((socket: ChatSocket, next) => {
  const nickname = socket.handshake.auth.nickname;

  if (!nickname) {
    return next(new Error(MISSING_NICKNAME));
  }

  if (isExistingNickname(nickname)) {
    return next(new Error(NICKNAME_IN_USE));
  }

  socket.nickname = nickname;

  next();
});

httpServer.listen(4000);
