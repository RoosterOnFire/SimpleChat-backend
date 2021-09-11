import { ChatSocket, SocketMiddlewareNext } from '../constants/type';
import { isUsedUsername, findUser } from '../helpers/Database';
import { MISSING_NICKNAME, NICKNAME_IN_USE } from '../constants/errors';
import { createRndId } from '../helpers/helpers';

export async function restoreSessionMiddleware(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  const sessionId = socket.handshake.auth.sessionId;
  if (sessionId) {
    const user = await findUser(sessionId);
    if (user) {
      socket.userId = user.userId;
      socket.sessionId = user.sessionId;
      socket.username = user.username;

      next();
    }
  }

  next();
}

export async function userValidationMiddleware(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  const username = socket.handshake.auth.nickname;
  if (!username) {
    return next(new Error(MISSING_NICKNAME));
  }

  const isUsed = await isUsedUsername(username);
  if (isUsed) {
    return next(new Error(NICKNAME_IN_USE));
  }

  socket.sessionId = createRndId();
  socket.userId = createRndId();
  socket.username = username;

  next();
}
