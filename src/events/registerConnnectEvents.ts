import UserRepository from '../domains/users/UsersRepository';
import { Errors, Roles } from '../types/TypeEnums';
import { ChatSocket, ChatSocketMessages } from '../types/TypeBase';

export default function registerConnnectEvents(socket: ChatSocket) {
  socket.on(
    ChatSocketMessages.CONNECT_REGISTRATION,
    async (
      payload: { username: string; password: string },
      callback: Function
    ) => {
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
    async (
      payload: { username: string; password: string },
      callback: Function
    ) => {
      if (socket.user) {
        callback({
          success: true,
          data: {
            username: socket.user.username,
            role: socket.user.role,
            sessionId: socket.user.meta.sessionId,
          },
        });
      }

      const user = await UserRepository.findWithNameAndPassword(
        payload.username,
        payload.password
      );
      console.log('user', user);
      if (user === null) {
        callback({ success: false, error: Errors.ERROR_INVALID_SING_IN });
        return;
      } else {
        await UserRepository.updateSocket(user, socket.id);
      }

      callback({
        success: true,
        data: {
          role: Roles.ADMIN,
          sessionId: user,
          username: user.username,
        },
      });
    }
  );

  socket.on(ChatSocketMessages.CONNECT_LOGOFF, async (callback: Function) => {
    try {
      if (socket.user) {
        await UserRepository.updateLogoff(socket.user);

        callback({ status: true, message: 'User logged off succesfully' });

        socket.disconnect();
      }
    } catch (error) {
      callback({ status: false, error: 'ERROR' });
    }
  });
}
