import { addUser, deleteUser, findUser, getUsers } from '../helpers/database';
import { ChatSocket } from '../types/types';
import { Socket } from 'socket.io';
import { logAdmin, logInfo } from '../helpers/loggers';
import { createRndId } from '../helpers/helpers';

export async function EventHandler(socket: ChatSocket) {
  await broadcastConnection(socket);

  Promise.all([broadcastUsers(socket), broadcastChatJoin(socket)]);

  socket.on('chat:message', (payload: any) => {
    socket.broadcast.emit('chat:message', payload);
  });

  socket.on('user:kick', async (payload: { userId: string }) => {
    logAdmin(`Kick user: ${payload.userId}`);

    const socketId = await deleteUser(payload.userId);
    if (socketId) {
      if (socket.id === socketId) {
        socket.emit('session:close');
      } else {
        socket.to(socketId).emit('session:close');
      }
    }

    broadcastUsers(socket);
  });

  socket.on('user:logoff', async () => {
    logAdmin(`Closing session: ${socket.userId}`);

    if (socket.userId) {
      await deleteUser(socket.userId);
      socket.emit('session:closed');
    }
  });

  socket.on('disconnect', async () => {
    await broadcastDisconnection(socket);
    broadcastUsers(socket);
  });
}

async function broadcastConnection(socket: ChatSocket): Promise<void> {
  logInfo(`New connection: ${socket.id}`);

  const newUser = await addUser({
    session: socket.sessionId || createRndId(),
    socket: socket.id,
    user: socket.userId || createRndId(),
    username: socket.handshake.auth.username,
  });

  socket.emit('session:created', {
    userId: newUser.userId,
    sessionId: newUser.sessionId,
    username: newUser.username,
    role: newUser.role,
  });
}

async function broadcastDisconnection(socket: ChatSocket) {
  if (socket.userId && socket.sessionId) {
    logInfo(`${socket.userId} disconnected`);

    const user = await findUser(socket.sessionId);
    socket.broadcast.emit('chat:leave', { ...user });
  }
}

async function broadcastUsers(socket: Socket) {
  logInfo(`Broadcasting users`);

  const users = await getUsers();
  socket.emit('users:update', users);
  socket.broadcast.emit('users:update', users);
}

async function broadcastChatJoin(socket: ChatSocket) {
  logInfo(`User joined chat: ${socket.userId}`);

  if (socket.sessionId) {
    const user = await findUser(socket.sessionId);
    socket.broadcast.emit('chat:join', { ...user });
  }
}
