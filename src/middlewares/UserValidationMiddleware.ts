import { ChatSocket, SocketMiddlewareNext } from '../types/types';
import { Errors } from '../types/enums';
import { findUserWithNameAndPass } from '../helpers/database';

export async function UserValidationMiddleware(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  if (socket.user) {
    return next();
  }

  const auth = socket.handshake.auth;

  if (!auth.username) {
    return next(new Error(Errors.ERROR_MISSING_USERNAME));
  } else if (!auth.password) {
    return next(new Error(Errors.ERROR_MISSING_PASSWORD));
  }

  const User = await findUserWithNameAndPass(auth.username, auth.password);
  if (User === null) {
    return next(new Error(Errors.ERROR_INVALID_SING_IN));
  } else {
    socket.user = User;
  }

  return next();
}
