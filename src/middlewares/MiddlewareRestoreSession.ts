import { ChatSocket, SocketMiddlewareNext } from '../types/TypeBase';
import { logError } from '../helpers/loggers';
import UserRepository from '../domains/users/UsersRepository';

export async function MiddlewareRestoreSession(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  try {
    const sessionId = socket.handshake.auth.sessionId;

    if (!sessionId) {
      return next();
    }
    const user = await UserRepository.findWithSession(sessionId);
    socket.user = user ?? undefined;

    return next();
  } catch (error) {
    logError(error);
    return next();
  }
}
