import { ChatSocket, SocketMiddlewareNext } from "../types/TypeBase";
import { logError } from "../helpers/loggers";
import UserRepository from "../domains/users/UsersRepository";
import { SessionStates } from "../types/TypeEnums";

export async function MiddlewareRestoreSession(
  socket: ChatSocket,
  next: SocketMiddlewareNext
) {
  try {
    const sessionId = socket.handshake.auth.sessionId;

    if (!sessionId) {
      socket.sessionState = SessionStates.new;
      next();
      return;
    }

    const user = await UserRepository.findWithSession(sessionId);
    if (user) {
      socket.user;
      socket.sessionState = SessionStates.existings;
    } else {
      socket.user = undefined;
      socket.sessionState = SessionStates.new;
    }

    next();
  } catch (error: unknown) {
    logError(error as Error);
    next();
  }
}
