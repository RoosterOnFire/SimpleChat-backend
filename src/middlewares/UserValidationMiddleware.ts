import { ChatSocket, SocketMiddlewareNext } from '../types/types';
import { Errors } from '../types/enums';
import { UserRespository } from '../helpers/database';
import { logAdmin, logInfo } from '../helpers/loggers';

export async function UserValidationMiddleware(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  logInfo('Validating user');

  if (socket.user) {
    return next();
  }

  const auth = socket.handshake.auth;

  if (!auth.username) {
    logInfo('-- user validation error: missing username');
    return next(new Error(Errors.ERROR_MISSING_USERNAME));
  } else if (!auth.password) {
    logInfo('-- user validation error: missing password');
    return next(new Error(Errors.ERROR_MISSING_PASSWORD));
  }

  const User = await UserRespository.findWithNameAndPass(
    auth.username,
    auth.password
  );
  if (User === null) {
    logInfo('-- user validation error');
    return next(new Error(Errors.ERROR_INVALID_SING_IN));
  } else {
    socket.user = User;
  }

  return next();
}
