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
      socket.sessionState = 'new';
      next();
      return;
    }

    const user = await UserRepository.findWithSession(sessionId);
    if (user) {
      socket.user;
      socket.sessionState = 'existings';
    } else {
      socket.user = undefined;
      socket.sessionState = 'new';
    }

    next();
  } catch (error: unknown) {
    logError(error as Error);
    next();
  }
}
