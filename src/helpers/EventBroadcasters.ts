import { UserRespository } from './database';
import { logInfo } from './loggers';
import { ChatSocket } from '../types/types';

export async function broadcastDisconnection(socket: ChatSocket) {
  if (socket.user?.user_id && socket.user?.session_id) {
    logInfo(`${socket.user.user_id} disconnected`);

    const User = await UserRespository.findUser(socket.user.session_id);
    socket.broadcast.emit('chat:leave', { ...User });
  }
}