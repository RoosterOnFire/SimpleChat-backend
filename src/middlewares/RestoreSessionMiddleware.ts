import { ChatSocket, SocketMiddlewareNext } from '../types/types';
import { logError, logInfo } from '../helpers/loggers';
import UserRepository from '../database/RepositoryUser';

export async function RestoreSessionMiddleware(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  try {
    logInfo('Checking for existing session');

    const sessionId = socket.handshake.auth.sessionId;

    if (!sessionId) {
      return next();
    }

    const User = await UserRepository.findUser(sessionId);
    socket.user = User ?? undefined;
    if (socket.user) {
      logInfo('-- Existing session restored');
    }

    return next();
  } catch (error) {
    logError(error);
    return next();
  }
}
