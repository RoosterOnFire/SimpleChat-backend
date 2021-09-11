import {
  addUser,
  findUser,
  findAndRemoveUser,
  getUsers,
} from '../helpers/Database';
import { ChatSession, ChatSocket } from '../constants/type';
import { Socket } from 'socket.io';

export async function EventHandler(socket: ChatSocket) {
  await broadcastConnection(socket);
  await broadcastUsers(socket);
  await broadcastChatJoin(socket);

  socket.on('chat:message', (payload) => {
    socket.broadcast.emit('chat:message', payload);
  });

  socket.on('disconnect', async () => {
    await broadcastDisconnection(socket);
    broadcastUsers(socket);
  });
}

function logBroadcast(input: any) {
  console.log(input);
}

async function broadcastConnection(socket: ChatSocket): Promise<void> {
  logBroadcast(`New connection: ${socket.userId}`);

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
  logBroadcast(`User ${socket.userId} disconnected`);

  if (socket.sessionId) {
    const user = await findUser(socket.sessionId);

    socket.broadcast.emit('chat:leave', { ...user });
  }
}

async function broadcastUsers(socket: Socket) {
  logBroadcast(`Broadcasting users`);
  const users = await getUsers();

  socket.emit('users:update', users);

  socket.broadcast.emit('users:update', users);
}

async function broadcastChatJoin(socket: ChatSocket) {
  console.log(`User joined chat: ${socket.userId}`);

  if (socket.sessionId) {
    const user = await findUser(socket.sessionId);

    socket.broadcast.emit('chat:join', { ...user });
  }
}
