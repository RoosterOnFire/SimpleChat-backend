import { logError, logInfo } from '../helpers/loggers';
import {
  ChatSocket,
  ChatUser,
  SocketRoomsCallback,
  SocketRoomsPayload,
} from '../types/types';
import { broadcastDisconnection } from '../helpers/EventBroadcasters';
import UserRespository from '../database/RepositoryUser';
import { Roles } from '../types/enums';

export default async function handleExistingUser(
  User: ChatUser,
  socket: ChatSocket
) {
  socket.prependAny((eventName) => {
    logInfo(`Emit: ${eventName}`);
  });

  socket.on(
    'rooms:create',
    (payload: SocketRoomsPayload, callback: SocketRoomsCallback) => {
      socket.join(payload.roomName);

      callback({ success: true, message: 'Room created' });
    }
  );

  socket.on(
    'rooms:join',
    (payload: SocketRoomsPayload, callback: SocketRoomsCallback) => {
      socket.join(payload.roomName);

      callback({ success: true, message: 'Joined room' });
    }
  );

  socket.on(
    'rooms:leave',
    (payload: SocketRoomsPayload, callback: SocketRoomsCallback) => {
      socket.leave(payload.roomName);

      callback({ success: true, message: 'Left room' });
    }
  );

  socket.on('chat:message', (payload: any) => {
    socket.broadcast.emit('chat:message', payload);
  });

  socket.on(
    'user:kick',
    async (payload: { userId: string }, callback?: Function) => {
      try {
        await UserRespository.updateUserLogoff(payload.userId);
        callback && callback({ message: `User ${payload.userId} kicked` });
      } catch (error) {
        callback && callback({ error: `User ${payload.userId} not found` });
      }
    }
  );

  socket.on('user:logoff', async (callback: Function) => {
    try {
      if (socket.user?.userId) {
        await UserRespository.updateUserLogoff(socket.user?.userId);
        callback({ status: true, message: 'User logoff succesfully' });
      }
    } catch (error) {
      callback({ status: false, error: 'ERROR' });
    }
  });

  socket.on('disconnect', async () => {
    await broadcastDisconnection(socket);
  });

  try {
    await UserRespository.updateUserSocket(User.userId, socket.id);

    socket.emit('connect:valid', {
      role: Roles.ADMIN,
      sessionId: User.sessionId,
      userId: User.userId,
      username: User.username,
    });
  } catch (error) {
    logError(error);
  }
}
