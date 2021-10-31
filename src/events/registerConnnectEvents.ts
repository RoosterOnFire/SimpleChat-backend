import { openRealm, openUser } from '../database/Connection';
import UserRepository from '../database/RepositoryUser';
import { createRndId } from '../helpers/helpers';
import { Errors, RealmSchemas, Roles } from '../types/TypeEnums';
import { ChatSocket, ChatSocketMessages, ChatUser } from '../types/TypeBase';

export default function registerConnnectEvents(socket: ChatSocket) {
  socket.on(
    ChatSocketMessages.CONNECT_REGISTRATION,
    async (
      payload: { username: string; password: string },
      callback: Function
    ) => {
      try {
        const isExistingUser = (await openUser()).find(
          (user) => user.username === payload.username
        );
        if (isExistingUser) {
          throw new Error(Errors.ERROR_USERNAME_IN_USE);
        }

        const userId = createRndId();
        const realm = await openRealm();
        realm.write(() => {
          realm.create<ChatUser>(RealmSchemas.USER, {
            userId,
            username: payload.username,
            password: payload.password,
            sessionId: createRndId(),
            socketId: socket.id,
          });
        });

        const user = (await openUser()).filtered('userId == $0', userId)[0];

        callback({
          success: true,
          data: {
            role: Roles.ADMIN,
            sessionId: user.sessionId,
            userId: user.userId,
            username: user.username,
          },
        });
      } catch (error) {
        callback({
          success: false,
          error: Errors.ERROR_NEW_USER_NOT_CREATED,
        });
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
            role: Roles.ADMIN,
            sessionId: socket.user.sessionId,
            userId: socket.user.userId,
            username: socket.user.username,
          },
        });
      }

      const isValid = validateFields(payload);
      if (!isValid.valid) {
        callback({
          success: false,
          error: isValid.error,
        });
        return;
      }

      const user = await UserRepository.findWithNameAndPass(
        payload.username,
        payload.password
      );
      if (user === null) {
        callback({
          success: false,
          error: Errors.ERROR_INVALID_SING_IN,
        });
        return;
      }

      await UserRepository.updateUserSocket(user.userId, socket.id);

      callback({
        success: true,
        data: {
          role: Roles.ADMIN,
          sessionId: user.sessionId,
          userId: user.userId,
          username: user.username,
        },
      });
    }
  );

  socket.on(ChatSocketMessages.CONNECT_LOGOFF, async (callback: Function) => {
    try {
      if (socket.user?.userId) {
        await UserRepository.updateUserLogoff(socket.user?.userId);

        callback({ status: true, message: 'User logoff succesfully' });

        socket.disconnect();
      }
    } catch (error) {
      callback({ status: false, error: 'ERROR' });
    }
  });
}

function validateFields(auth: { username: string; password: string }) {
  const result: { valid: boolean; error: Errors | undefined } = {
    valid: false,
    error: undefined,
  };

  if (!auth.username && auth.username === '') {
    result.error = Errors.ERROR_MISSING_USERNAME;

    return result;
  } else if (!auth.password && auth.password === '') {
    result.error = Errors.ERROR_MISSING_PASSWORD;
    return result;
  }

  result.valid = true;
  return result;
}
