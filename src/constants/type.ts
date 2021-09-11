import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

export type ChatSocket = Socket & { nickname?: string };

export type SocketMiddlewareNext = (err?: ExtendedError) => void;

export type User = {
  id: string;
  nickname: string;
};

export type Users = User[];
