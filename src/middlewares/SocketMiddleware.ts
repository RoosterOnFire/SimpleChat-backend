import { ChatSocket, SocketMiddlewareNext } from '../constants/types';
import { isUsedUsername, findUser } from '../helpers/database';
import {
  ERROR_MISSING_NICKNAME,
  ERROR_NICKNAME_IN_USE,
} from '../constants/errors';
import { createRndId, logInfo } from '../helpers/helpers';

export async function restoreSessionMiddleware(
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

      next();
    } else {
      logInfo(`Session id ${sessionId} not found`);
    }

    next();
  }

  next();
}

export async function userValidationMiddleware(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  if (socket.sessionId) {
    next();
  }

  const username = socket.handshake.auth.nickname;

  if (!username) {
    return next(new Error(ERROR_MISSING_NICKNAME));
  }

  const isUsed = await isUsedUsername(username);
  if (isUsed) {
    return next(new Error(ERROR_NICKNAME_IN_USE));
  }

  socket.sessionId = createRndId();
  socket.userId = createRndId();
  socket.username = username;

  next();
}
