import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

export type ChatSocket = Socket & {
  userId?: string;
  sessionId?: string;
  username?: string;
};

export type SocketMiddlewareNext = (err?: ExtendedError) => void;

export type User = {
  userId: string;
  sessionId: string;
  username: string;
};

export type Users = User[];

export type ChatSession = { userId: string; sessionId: string };
