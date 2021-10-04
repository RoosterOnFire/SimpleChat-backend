import { Model } from 'sequelize/types';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

export type ChatSocket = Socket & {
  user?: UserInstance;
};

export type SocketMiddlewareNext = (err?: ExtendedError) => void;

export type User = {
  userId: string;
  sessionId: string;
  username: string;
  role: string;
};

export type Users = User[];

export type ChatSession = {
  userId: string;
  sessionId: string;
};

export interface UserInstance extends Model {
  password: string;
  role: string;
  session_id: string;
  socket_id: string;
  user_id: string;
  username: string;
}

export type UserInstances = UserInstance[];

export interface RoomInstance extends Model {
  name: string;
  users: string;
}

export type RoomInstances = RoomInstance[];
