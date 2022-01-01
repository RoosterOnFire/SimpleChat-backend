import UserRepository from '../domains/users/UsersRepository';
import { Errors, Roles } from '../types/TypeEnums';
import { ChatSocket, ChatSocketMessages } from '../types/TypeBase';
import { createRndId } from '../helpers/helpers';
import { logError } from '../helpers/loggers';

export default function registerConnnectEvents(socket: ChatSocket) {
  socket.on(
    ChatSocketMessages.CONNECT_REGISTRATION,
    async (payload: { username: string; password: string }, callback) => {
      try {
        const isExistingUser = await UserRepository.isUsernameUsed(
          payload.username
        );
        if (isExistingUser) {
          throw new Error(Errors.ERROR_USERNAME_IN_USE);
        }

        const user = await UserRepository.create(
          payload.username,
          payload.password,
          socket.id
        );

        callback({
          success: true,
          data: {
            role: Roles.ADMIN,
            sessionId: user.meta.sessionId,
            username: user.username,
          },
        });
      } catch (error) {
        callback({ success: false, error: Errors.ERROR_NEW_USER_NOT_CREATED });
      }
    }
  );

  socket.on(
    ChatSocketMessages.CONNECT_SIGNIN,
    async (payload: { username: string; password: string }, callback) => {
      if (
        socket.sessionState === 'new' &&
        (payload.username === undefined || payload.password === undefined)
      ) {
        return;
      }

      if (socket.sessionState === 'existings' && socket.user) {
        UserRepository.updateSocket(socket.user, socket.id);
        callback({
          success: true,
          data: {
            username: socket.user.username,
            role: socket.user.role,
            sessionId: socket.user.meta.sessionId,
          },
        });

        return;
      }

      const user = await UserRepository.findWithNameAndPassword(
        payload.username,
        payload.password
      );
      if (user === null) {
        callback({ success: false, error: Errors.ERROR_INVALID_SING_IN });
        return;
      }

      const sessionId = createRndId();
      await UserRepository.updateSocket(user, socket.id);
      await UserRepository.updateSession(user, sessionId);
      callback({
        success: true,
        data: {
          role: Roles.ADMIN,
          sessionId: sessionId,
          username: user.username,
        },
      });
    }
  );

  socket.on(ChatSocketMessages.CONNECT_LOGOUT, async () => {
    try {
      await UserRepository.logout(socket.id);

      socket.disconnect();
    } catch (error) {
      logError(error as Error);
    }
  });
}
