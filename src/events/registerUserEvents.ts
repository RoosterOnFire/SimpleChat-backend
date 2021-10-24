import UserRepository from '../database/RepositoryUser';
import { ChatSocket } from '../types/types';

export default function registerUserEvents(socket: ChatSocket) {
  socket.on(
    'user:kick',
    async (payload: { userId: string }, callback?: Function) => {
      try {
        await UserRepository.updateUserLogoff(payload.userId);
        callback && callback({ message: `User ${payload.userId} kicked` });
      } catch (error) {
        callback && callback({ error: `User ${payload.userId} not found` });
      }
    }
  );
}
