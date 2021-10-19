import { ChatSocket, SocketMiddlewareNext } from '../types/types';
import { Errors } from '../types/enums';
import { logError, logInfo } from '../helpers/loggers';
import UserRepository from '../database/RepositoryUser';

export async function UserValidationMiddleware(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  try {
    logInfo('Validating user');

    if (socket.user) {
      return next();
    }

    const auth = socket.handshake.auth;

    if (!auth.username) {
      logError('-- user validation error: missing username');
      return next(new Error(Errors.ERROR_MISSING_USERNAME));
    } else if (!auth.password) {
      logError('-- user validation error: missing password');
      return next(new Error(Errors.ERROR_MISSING_PASSWORD));
    }

    const User = await UserRepository.findWithNameAndPass(
      auth.username,
      auth.password
    );

    if (User === null) {
      logError('-- user validation error');
      return next(new Error(Errors.ERROR_INVALID_SING_IN));
    } else {
      socket.user = User;
    }

    return next();
  } catch (error) {
    logError(error);

    return next();
  }
}
