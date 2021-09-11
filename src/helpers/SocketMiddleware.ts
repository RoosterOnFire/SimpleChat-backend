import { ChatSocket, SocketMiddlewareNext } from '../constants/type';
import { isExistingNickname } from './Database';
import { MISSING_NICKNAME, NICKNAME_IN_USE } from '../constants/errors';

export async function userValidationMiddleware(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  const nickname = socket.handshake.auth.nickname;
  if (!nickname) {
    return next(new Error(MISSING_NICKNAME));
  }

  const isUsedNickname = await isExistingNickname(nickname);
  if (isUsedNickname) {
    return next(new Error(NICKNAME_IN_USE));
  }

  socket.nickname = nickname;

  next();
}
