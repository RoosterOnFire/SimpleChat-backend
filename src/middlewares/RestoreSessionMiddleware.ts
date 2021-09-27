import { ChatSocket, SocketMiddlewareNext } from '../types/types';
import { findUser } from '../helpers/database';
import { logInfo } from '../helpers/loggers';

export async function RestoreSessionMiddleware(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  logInfo('Trying to restore session');

  const sessionId = socket.handshake.auth.sessionId;

  if (!sessionId) {
    return next();
  }

  const User = await findUser(sessionId);
  if (User) {
    logInfo(`Restoring session`);

    socket.user = User;

    return next();
  }

  logInfo(`Session not restored`);

  return next();
}
