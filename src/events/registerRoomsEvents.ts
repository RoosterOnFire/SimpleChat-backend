import {
  ChatSocket,
  SocketCallback,
  SocketRoomsPayload,
} from '../types/TypeBase';

export default function registerRoomsEvents(socket: ChatSocket) {
  socket.on(
    'rooms:create',
    (payload: SocketRoomsPayload, callback: SocketCallback) => {
      socket.join(payload.roomName);

      callback({ success: true, message: 'Room created' });
    }
  );

  socket.on(
    'rooms:join',
    (payload: SocketRoomsPayload, callback: SocketCallback) => {
      socket.join(payload.roomName);

      callback({ success: true, message: 'Joined room' });
    }
  );

  socket.on(
    'rooms:leave',
    (payload: SocketRoomsPayload, callback: SocketCallback) => {
      socket.leave(payload.roomName);

      callback({ success: true, message: 'Left room' });
    }
  );
}
