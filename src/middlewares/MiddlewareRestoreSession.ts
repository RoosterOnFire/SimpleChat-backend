import { ChatSocket, SocketMiddlewareNext } from '../types/types';
import { logError } from '../helpers/Loggers';
import UserRepository from '../database/RepositoryUser';

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
