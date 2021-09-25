import { ChatSocket, SocketMiddlewareNext } from '../types/types';
import { findUser } from '../helpers/database';
import { logInfo } from '../helpers/loggers';

export async function RestoreSessionMiddleware(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  const sessionId = socket.handshake.auth.sessionId;
  if (sessionId) {
    logInfo(`Trying to restoring session for ${sessionId}`);

    const user = await findUser(sessionId);
    if (user) {
      socket.userId = user.userId;
      socket.sessionId = user.sessionId;
      socket.username = user.username;

      logInfo(`Restoring session for ${sessionId}`);

      return next();
    } else {
      logInfo(`Session id ${sessionId} not found`);
    }

    return next();
  }

  return next();
}
