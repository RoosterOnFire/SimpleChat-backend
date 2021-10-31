import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { Roles } from './TypeEnums';

export type ChatUser = {
  password: string;
  sessionId?: string;
  socketId?: string;
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

export type SocketRoomsPayload = {
  roomName: string;
};

export type SocketCallback = (payload: {
  success: boolean;
  message: string;
  data?: any;
  errors?: any[];
}) => void;

export enum ChatSocketMessages {
  CHAT_JOIN = 'chat:join',
  CHAT_MESSAGE = 'chat:message',
  CONNECT_ERROR = 'connect_error',
  CONNECT_LOGOFF = 'connect:logoff',
  CONNECT_REGISTRATION = 'connect:registration',
  CONNECT_SIGNIN = 'connect:signin',
  ROOMS_CREATE = 'rooms:create',
  ROOMS_JOIN = 'rooms:join',
  ROOMS_LEAVE = 'rooms:leave',
  SESSION_CLOSED = 'session:closed',
  SESSION_CREATED = 'session:created',
  SESSION_RESTORE = 'session:restore',
  USER_KICK = 'user:kick',
  USERS_UPDATE = 'users:update',
}
