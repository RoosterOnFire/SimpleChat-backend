import { ChatSocket, SocketMiddlewareNext } from '../types/types';
import { addAdmin, isUsedUsername } from '../helpers/database';
import { createRndId } from '../helpers/helpers';
import { logInfo } from '../helpers/loggers';
import { Errors, Roles } from '../types/enums';

export async function UserValidationMiddleware(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  if (socket.sessionId) {
    return next();
  }

  const adminAccessKey = socket.handshake.auth.adminAccessKey;
  if (adminAccessKey === Roles.ADMIN) {
    logInfo(`admin access key: ${adminAccessKey}`);

    const sessionId = createRndId();
    const userId = createRndId();
    const username = 'Admin';

    socket.sessionId = sessionId;
    socket.userId = userId;
    socket.username = username;

    await addAdmin(userId, socket.id, sessionId, username);

    return next();
  }

  const username = socket.handshake.auth.nickname;
  if (!username) {
    return next(new Error(Errors.ERROR_MISSING_NICKNAME));
  }

  const isUsed = await isUsedUsername(username);
  if (isUsed) {
    return next(new Error(Errors.ERROR_NICKNAME_IN_USE));
  }

  socket.sessionId = createRndId();
  socket.userId = createRndId();
  socket.username = username;

  return next();
}
