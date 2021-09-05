import { getUsers, getUser, addUser, removeUser } from './database';
import { Socket } from 'socket.io';
import { ChatSocket } from './types/type';

export const broadcastConnection = (socket: ChatSocket) => {
  console.log(`New connection: ${socket.id}`);

  if (socket.nickname) addUser(socket.id, socket.nickname);
};

export const broadcastDisconnection = (socket: Socket) => {
  console.log(`User ${socket.id} disconnected`);

  const user = getUser(socket.id);

  removeUser(socket.id);

  if (user?.nickname) {
    socket.broadcast.emit('chat:leave', { ...user });
  }
};

export const broadcastChatJoin = (socket: Socket) => {
  console.log(`User joined chat ${socket.id}`);

  const user = getUser(socket.id);

  socket.broadcast.emit('chat:join', { ...user });
};

export const broadcastUsers = (socket: Socket) => {
  const users = getUsers();

  socket.emit('users:update', users);

  socket.broadcast.emit('users:update', users);
};
