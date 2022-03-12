import UserRepository from "../domains/users/UsersRepository";
import { ChatSocket } from "../types/TypeBase";
import { createToken } from "../helpers/helpers";
import { logError } from "../helpers/loggers";
import { ChatSocketMessages, Errors, Roles } from "../types/TypeShared";
import { SessionStates } from "../types/TypeEnums";

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
            token: user.meta.token,
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
        socket.sessionState === SessionStates.new &&
        (payload.username === undefined || payload.password === undefined)
      ) {
        return;
      }

      if (socket.sessionState === SessionStates.existings && socket.user) {
        UserRepository.updateSocket(socket.user, socket.id);

        callback({
          success: true,
          data: {
            username: socket.user.username,
            role: socket.user.role,
            token: socket.user.meta.token,
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

      const token = createToken();
      await UserRepository.updateSocket(user, socket.id);
      await UserRepository.updateSession(user, token);

      callback({
        success: true,
        data: {
          role: user.role,
          token,
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
