import { ChatSocket } from '../types/types';
import { logAdmin } from '../helpers/loggers';
import { handleExistingUser } from './ExistingUserHandler';

export async function SocketEventHandlers(socket: ChatSocket) {
  if (socket.user) {
    return handleExistingUser(socket.user, socket);
  } else {
    logAdmin('work in progress');
  }
}
