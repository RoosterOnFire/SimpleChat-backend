import { ChatSocket, SocketMiddlewareNext } from '../types/types';
import { findUser } from '../helpers/database';
import { logInfo } from '../helpers/loggers';

export async function RestoreSessionMiddleware(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  logInfo('Checking for existing session');

  const sessionId = socket.handshake.auth.sessionId;

  if (!sessionId) {
    return next();
  }

  const User = await findUser(sessionId);

  socket.user = User ?? undefined;

  if (socket.user) {
    logInfo('Existing session found');
  } else {
    logInfo('No session found');
  }

  return next();
}
