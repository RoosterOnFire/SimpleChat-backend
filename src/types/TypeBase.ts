import { User, UserMeta } from '../domains/users/UsersType';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

export type ChatUser = User & { meta: UserMeta };

export type ChatSocket = Socket & {
  user?: ChatUser;
  sessionState?: 'new' | 'existings';
};

export type SocketMiddlewareNext = (err?: ExtendedError) => void;

export type SocketRoomsPayload = { roomName: string };

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
  CONNECT_LOGOUT = 'connect:logout',
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
