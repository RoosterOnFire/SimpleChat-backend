import { ChatSocket, SocketMiddlewareNext } from '../types/types';
import { logInfo } from '../helpers/loggers';
import { UserRespository } from '../repositories/users';

export async function RestoreSessionMiddleware(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  logInfo('Checking for existing session');

  const sessionId = socket.handshake.auth.sessionId;

  if (!sessionId) {
    return next();
  }

  const User = await UserRespository.findUser(sessionId);
  socket.user = User ?? undefined;
  if (socket.user) {
    logInfo('-- Existing session restored');
  }

  return next();
}
