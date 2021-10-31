import { logError, logInfo } from '../helpers/Loggers';
import { ChatSocket, ChatSocketMessages } from '../types/TypeBase';
import { broadcastDisconnection } from '../helpers/EventBroadcasters';
import registerRoomsEvents from './registerRoomsEvents';
import registerUserEvents from './registerUserEvents';
import registerConnnectEvents from './registerConnnectEvents';

export async function SocketHandler(socket: ChatSocket) {
  try {
    socket.prependAny((eventName) => {
      logInfo(`Emit: ${eventName}`);
    });

    registerConnnectEvents(socket);
    registerRoomsEvents(socket);
    registerUserEvents(socket);

    socket.on(ChatSocketMessages.CHAT_MESSAGE, (payload: any) => {
      socket.broadcast.emit('chat:message', payload);
    });

    socket.on('disconnect', async () => {
      await broadcastDisconnection(socket);
    });
  } catch (error) {
    logError(error);
  }
}
