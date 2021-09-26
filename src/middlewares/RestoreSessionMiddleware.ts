import { ChatSocket, SocketMiddlewareNext } from '../types/types';
import { findUser } from '../helpers/database';
import { logInfo } from '../helpers/loggers';

export async function RestoreSessionMiddleware(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  const sessionId = socket.handshake.auth.sessionId;

  if (!sessionId) {
    return next();
  }

  const user = await findUser(sessionId);
  if (user) {
    logInfo(`Restoring session`);

    socket.userId = user.userId;
    socket.sessionId = user.sessionId;
    socket.username = user.username;

    return next();
  }

  logInfo(`Session not restored`);

  return next();
}
