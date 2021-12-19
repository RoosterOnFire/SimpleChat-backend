import { logInfo } from './loggers';
import { ChatSocket } from '../types/TypeBase';
import UserRespository from '../domains/users/UsersRepository';

export async function broadcastDisconnection(socket: ChatSocket) {
  if (socket.user?.username && socket.user?.userMetaId) {
    logInfo(`${socket.user.username} disconnected`);

    await UserRespository.updateSocket(socket.user, '');

    socket.broadcast.emit('chat:leave', { ...socket.user });
  }
}
