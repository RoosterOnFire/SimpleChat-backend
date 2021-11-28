import { logInfo } from './loggers';
import { ChatSocket } from '../types/TypeBase';
import UserRespository from '../domains/users/UsersRepository';

export async function broadcastDisconnection(socket: ChatSocket) {
  if (socket.user?.userId && socket.user?.sessionId) {
    logInfo(`${socket.user.userId} disconnected`);

    const User = await UserRespository.findUser(socket.user.sessionId);
    socket.broadcast.emit('chat:leave', { ...User });
  }
}
