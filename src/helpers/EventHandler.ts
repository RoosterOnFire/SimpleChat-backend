import { addUser, findUser, findAndRemoveUser, getUsers } from './Database';
import { ChatSocket } from '../constants/type';
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

function broadcastConnection(socket: ChatSocket): Promise<void> | undefined {
  logBroadcast(`New connection created: ${socket.id}`);

  if (socket.nickname) {
    return addUser(socket.id, socket.nickname);
  }
}

async function broadcastDisconnection(socket: Socket) {
  logBroadcast(`User ${socket.id} disconnected`);

  const user = await findAndRemoveUser(socket.id);

  socket.broadcast.emit('chat:leave', { ...user });
}

async function broadcastChatJoin(socket: Socket) {
  console.log(`User join chat: ${socket.id}`);

  const user = await findUser(socket.id);

  socket.broadcast.emit('chat:join', { ...user });
}

async function broadcastUsers(socket: Socket) {
  logBroadcast(`Broadcasting users`);
  const users = await getUsers();

  socket.emit('users:update', users);

  socket.broadcast.emit('users:update', users);
}
