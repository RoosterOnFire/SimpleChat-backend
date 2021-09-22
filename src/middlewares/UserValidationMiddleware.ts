import { ChatSocket, SocketMiddlewareNext } from '../constants/types';
import { isUsedUsername } from '../helpers/database';
import {
  ERROR_MISSING_NICKNAME,
  ERROR_NICKNAME_IN_USE,
} from '../constants/errors';
import { createRndId } from '../helpers/helpers';

export async function UserValidationMiddleware(
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
