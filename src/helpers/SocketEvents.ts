import { addUser, findUser, findAndRemoveUser, getUsers } from './Database';
import { Socket } from 'socket.io';
import { ChatSocket } from '../types/type';

function logBroadcast(input: any) {
  console.log(input);
}

export async function broadcastConnection(socket: ChatSocket) {
  logBroadcast(`New connection created: ${socket.id}`);

  if (socket.nickname) {
    console.log('should be here');
    await addUser(socket.id, socket.nickname);
    getUsers().then(console.log);
  }
}

export async function broadcastDisconnection(socket: Socket) {
  logBroadcast(`User ${socket.id} disconnected`);

  const user = await findAndRemoveUser(socket.id);

  socket.broadcast.emit('chat:leave', { ...user });
}

export async function broadcastChatJoin(socket: Socket) {
  console.log(`User join chat: ${socket.id}`);

  const user = await findUser(socket.id);

  socket.broadcast.emit('chat:join', { ...user });
}

export async function broadcastUsers(socket: Socket) {
  logBroadcast(`Broadcasting users`);
  const users = await getUsers();

  console.log(users);

  socket.emit('users:update', users);

  socket.broadcast.emit('users:update', users);
}
