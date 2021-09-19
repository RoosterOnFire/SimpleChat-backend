import { addUser, deleteUser, findUser, getUsers } from '../helpers/Database';
import { ChatSocket } from '../constants/type';
import { Socket } from 'socket.io';
import { logAdmin, logInfo } from '../helpers/helpers';

export async function EventHandler(socket: ChatSocket) {
  await broadcastConnection(socket);

  await broadcastUsers(socket);

  await broadcastChatJoin(socket);

  socket.on('chat:message', (payload: any) => {
    socket.broadcast.emit('chat:message', payload);
  });

  socket.on('user:kick', async (payload: { userId: string }) => {
    logAdmin(`Kick user: ${payload.userId}`);

    await deleteUser(payload.userId);

    broadcastUsers(socket);
  });

  socket.on('disconnect', async () => {
    await broadcastDisconnection(socket);

    broadcastUsers(socket);
  });
}

async function broadcastConnection(socket: ChatSocket): Promise<void> {
  logInfo(`New connection: ${socket.userId}`);

  if (socket.userId && socket.sessionId && socket.username) {
    await addUser(socket.userId, socket.sessionId, socket.username);

    socket.emit('session', {
      userId: socket.userId,
      sessionId: socket.sessionId,
      username: socket.username,
    });
  }
}

async function broadcastDisconnection(socket: ChatSocket) {
  logInfo(`${socket.userId} disconnected`);

  if (socket.sessionId) {
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
