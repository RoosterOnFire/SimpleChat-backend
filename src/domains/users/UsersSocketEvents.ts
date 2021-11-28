import UserRepository from './UsersRepository';
import { ChatSocket } from '../../types/TypeBase';

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
