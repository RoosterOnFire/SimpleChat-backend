import { Model } from 'sequelize/types';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import User from '../database/ModelUser';
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
