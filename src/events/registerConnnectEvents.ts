import UserRepository from "../domains/users/UsersRepository";
import { ChatSocket } from "../types/TypeBase";
import { createRndId } from "../helpers/helpers";
import { logError } from "../helpers/loggers";
import { ChatSocketMessages, Errors, Roles } from "../types/TypeShared";

export default function registerConnnectEvents(socket: ChatSocket) {
  socket.on(
    ChatSocketMessages.connect_registration,
    async (payload: { username: string; password: string }, callback) => {
      try {
        const isExistingUser = await UserRepository.isUsernameUsed(
          payload.username
        );
        if (isExistingUser) {
          throw new Error(Errors.error_username_in_use);
        }

        const user = await UserRepository.create(
          payload.username,
          payload.password,
          socket.id
        );

        callback({
          success: true,
          data: {
            role: Roles.admin,
            sessionId: user.meta.sessionId,
            username: user.username,
          },
        });
      } catch (error) {
        callback({ success: false, error: Errors.error_new_user_not_created });
      }
    }
  );

  socket.on(
    ChatSocketMessages.connect_signin,
    async (payload: { username: string; password: string }, callback) => {
      if (
        socket.sessionState === "new" &&
        (payload.username === undefined || payload.password === undefined)
      ) {
        return;
      }

      if (socket.sessionState === "existings" && socket.user) {
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
        callback({ success: false, error: Errors.error_invalid_sing_in });
        return;
      }

      const sessionId = createRndId();
      await UserRepository.updateSocket(user, socket.id);
      await UserRepository.updateSession(user, sessionId);
      callback({
        success: true,
        data: {
          role: Roles.admin,
          sessionId: sessionId,
          username: user.username,
        },
      });
    }
  );

  socket.on(ChatSocketMessages.connect_logout, async () => {
    try {
      await UserRepository.logout(socket.id);

      socket.disconnect();
    } catch (error) {
      logError(error as Error);
    }
  });
}
