import { addUser, deleteUser, findUser, getUsers } from '../helpers/database';
import { ChatSocket } from '../types/types';
import { Socket } from 'socket.io';
import { logAdmin, logInfo } from '../helpers/loggers';
import { createRndId } from '../helpers/helpers';

export async function EventHandler(socket: ChatSocket) {
  if (!socket.user) {
    await broadcastConnection(socket);

    Promise.all([broadcastUsers(socket), broadcastChatJoin(socket)]);
  }

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
    logAdmin(`Closing session: ${socket.user?.user_id}`);

    if (socket.user?.user_id) {
      await deleteUser(socket.user?.user_id);
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
    session: createRndId(),
    socket: socket.id,
    user: createRndId(),
    username: socket.handshake.auth.username,
    password: socket.handshake.auth.password,
  });

  socket.emit('session:created', {
    userId: newUser.user_id,
    sessionId: newUser.session_id,
    role: newUser.role,
  });
}

async function broadcastDisconnection(socket: ChatSocket) {
  if (socket.user?.user_id && socket.user?.session_id) {
    logInfo(`${socket.user.user_id} disconnected`);

    const User = await findUser(socket.user.session_id);
    socket.broadcast.emit('chat:leave', { ...User });
  }
}

async function broadcastUsers(socket: Socket) {
  logInfo(`Broadcasting users`);

  const User = await getUsers();
  socket.emit('users:update', User);
  socket.broadcast.emit('users:update', User);
}

async function broadcastChatJoin(socket: ChatSocket) {
  logInfo(`User joined chat: ${socket.user?.user_id}`);

  if (socket.user?.session_id) {
    const user = await findUser(socket.user?.session_id);
    socket.broadcast.emit('chat:join', { ...user });
  }
}
