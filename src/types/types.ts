import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { Roles } from './enums';

export type ChatUser = {
  _id: number;
  password: string;
  sessionId: string;
  socketId: string;
  userId: string;
  username: string;
};

export type ChatSocket = Socket & {
  user?: ChatUser;
};

export type SocketMiddlewareNext = (err?: ExtendedError) => void;

export type UserMeta = {
  role: Roles;
};

export type ChatSession = {
  userId: string;
  sessionId: string;
};

export type SocketRoomsPayload = {
  roomName: string;
};

export type SocketRoomsCallback = (payload: {
  success: boolean;
  message: string;
  data?: any;
  errors?: any[];
}) => void;
