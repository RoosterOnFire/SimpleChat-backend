import { logError, logInfo } from '../helpers/loggers';
import {
  ChatSocket,
  SocketRoomsCallback,
  SocketRoomsPayload,
} from '../types/types';
import { broadcastDisconnection } from '../helpers/EventBroadcasters';
import UserRespository from '../repositories/UserRepository';
import User from '../models/UserModel';

export default async function handleExistingUser(
  User: User,
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
      const [count, Users] = await UserRespository.updateUserLogoff(
        payload.userId
      );
      if (count === 1 && Users[0].socket_id) {
        socket.to(Users[0].socket_id).emit('session:close');

        callback && callback({ message: `User ${payload.userId} kicked` });
      } else {
        callback && callback({ error: `User ${payload.userId} not found` });
      }
    }
  );

  socket.on('user:logoff', async (callback: Function) => {
    if (socket.user?.user_id) {
      const [updated] = await UserRespository.updateUserLogoff(
        socket.user?.user_id
      );

      if (updated === 1) {
        callback({ status: true, message: 'User logoff succesfully' });
      } else {
        callback({ status: false, error: 'ERROR' });
      }
    }
  });

  socket.on('disconnect', async () => {
    await broadcastDisconnection(socket);
  });

  try {
    await UserRespository.updateUserSocket(User.user_id, socket.id);

    const userMeta = await User.getMeta();

    socket.emit('connect:valid', {
      role: userMeta.role,
      sessionId: User.session_id,
      userId: User.user_id,
      username: User.username,
    });
  } catch (error) {
    logError(error);
  }
}
