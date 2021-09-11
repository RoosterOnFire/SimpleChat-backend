import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import {
  broadcastChatJoin,
  broadcastConnection,
  broadcastDisconnection,
  broadcastUsers,
} from './helpers/SocketEvents';
import { ChatSocket } from '@/types/type';
import { isExistingNickname } from './helpers/Database';
import { MISSING_NICKNAME, NICKNAME_IN_USE } from './constants/errors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: '*' }));

io.on('connection', async (socket: ChatSocket) => {
  await broadcastConnection(socket);
  console.log(socket.nickname);
  await broadcastUsers(socket);
  await broadcastChatJoin(socket);

  socket.on('chat:message', (payload) => {
    socket.broadcast.emit('chat:message', payload);
  });

  socket.on('disconnect', async () => {
    console.log('should disconnect');
    await broadcastDisconnection(socket);
    broadcastUsers(socket);
  });
});

io.use(async (socket: ChatSocket, next) => {
  const nickname = socket.handshake.auth.nickname;
  if (!nickname) {
    return next(new Error(MISSING_NICKNAME));
  }

  const isUsedNickname = await isExistingNickname(nickname);
  if (isUsedNickname) {
    return next(new Error(NICKNAME_IN_USE));
  }

  socket.nickname = nickname;

  next();
});

httpServer.listen(4000);
