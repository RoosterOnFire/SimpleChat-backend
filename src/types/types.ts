import { Model, Optional } from 'sequelize/types';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import User from '../models/UserModel';
import { Roles } from './enums';

export type ChatSocket = Socket & {
  user?: User;
};

export type SocketMiddlewareNext = (err?: ExtendedError) => void;

export type UserMeta = {
  role: Roles;
};

export type ChatSession = {
  userId: string;
  sessionId: string;
};

export interface UserAttributes {
  password: string;
  session_id: string;
  socket_id: string | null;
  user_id: string;
  username: string;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'user_id'> {}

export interface UserMetaAttributes {
  user_id?: string;
  role: string;
}

export interface UserMetaCreationAttributes extends UserMetaAttributes {}

export interface RoomInstance extends Model {
  name: string;
  users: string;
}

export type RoomInstances = RoomInstance[];

export type SocketRoomsPayload = {
  roomName: string;
};

export type SocketRoomsCallback = (payload: {
  success: boolean;
  message: string;
  data?: any;
  errors?: any[];
}) => void;
