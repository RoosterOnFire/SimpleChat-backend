import RepositoryRoom from "./RoomsRepository";
import {
  ChatSocket,
  SocketCallback,
  SocketRoomsPayload,
} from "../../types/TypeBase";

export default function registerRoomsEvents(socket: ChatSocket) {
  socket.on(
    "rooms:join",
    async (payload: SocketRoomsPayload, callback: SocketCallback) => {
      socket.join(payload.roomName);

      await RepositoryRoom.create(payload.roomName);

      callback({
        success: true,
        message: "Joined room",
        data: {
          name: payload.roomName,
        },
      });
    }
  );

  socket.on(
    "rooms:leave",
    (payload: SocketRoomsPayload, callback: SocketCallback) => {
      socket.leave(payload.roomName);

      callback({ success: true, message: "Left room" });
    }
  );
}
