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

    const User = await UserRepository.findUser(sessionId);
    socket.user = User ?? undefined;

    return next();
  } catch (error) {
    logError(error);
    return next();
  }
}
