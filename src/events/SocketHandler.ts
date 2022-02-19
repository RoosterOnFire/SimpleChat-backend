import { logError, logInfo } from "../helpers/loggers";
import { ChatSocket } from "../types/TypeBase";
import { broadcastDisconnection } from "../helpers/EventBroadcasters";
import registerRoomsEvents from "../domains/rooms/RoomsSocketEvents";
import registerUserEvents from "../domains/users/UsersSocketEvents";
import registerConnnectEvents from "./registerConnnectEvents";
import { ChatSocketMessages } from "simplechat-types";

export async function SocketHandler(socket: ChatSocket) {
  try {
    socket.prependAny((eventName) => {
      logInfo(`Emit: ${eventName}`);
    });

    registerConnnectEvents(socket);
    registerRoomsEvents(socket);
    registerUserEvents(socket);

    socket.on(
      ChatSocketMessages.chat_message,
      (payload: {
        room: string;
        message: {
          id: number;
          user: string;
          value: string;
        };
      }) => {
        socket.to(payload.room).emit("chat:message", payload);
      }
    );

    socket.on("disconnect", async () => {
      await broadcastDisconnection(socket);
    });
  } catch (error) {
    logError(error as Error);
  }
}
