import { logInfo } from '../helpers/loggers';
import { ChatSocket, UserInstance } from '../types/types';
import { broadcastDisconnection } from '../helpers/EventBroadcasters';
import { UserRespository } from '../repositories/users';

export async function handleExistingUser(
  User: UserInstance,
  socket: ChatSocket
) {
  socket.prependAny((eventName) => {
    logInfo(`Emit: ${eventName}`);
  });

  await UserRespository.updateUserSocket(User.user_id, socket.id);

  // set event
  socket.on(
    'rooms:create',
    (payload: { roomName: string; callback?: Function }) => {
      socket.join(payload.roomName);
    }
  );

  socket.on(
    'rooms:join',
    (payload: { roomName: string; callback?: Function }) => {
      socket.join(payload.roomName);
    }
  );

  socket.on(
    'rooms:leave',
    (payload: { roomName: string; callback?: Function }) => {
      socket.leave(payload.roomName);
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
      if (count === 1) {
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

  // emit
  socket.emit('connect:valid', {
    role: User.role,
    sessionId: User.session_id,
    userId: User.user_id,
    username: User.username,
  });
}
