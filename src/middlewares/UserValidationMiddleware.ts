import { ChatSocket, SocketMiddlewareNext } from '../types/types';
import { Errors } from '../types/enums';
import { findUserWithNameAndPass } from '../helpers/database';

export async function UserValidationMiddleware(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  if (socket.user?.session_id) {
    return next();
  }

  if (!socket.handshake.auth.username) {
    return next(new Error(Errors.ERROR_MISSING_USERNAME));
  }

  if (!socket.handshake.auth.password) {
    return next(new Error(Errors.ERROR_MISSING_PASSWORD));
  }

  const isUser = await findUserWithNameAndPass(
    socket.handshake.auth.username,
    socket.handshake.auth.password
  );
  if (isUser === null) {
    return next(new Error(Errors.ERROR_INVALID_SING_IN));
  }

  return next();
}
