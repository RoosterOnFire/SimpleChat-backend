import { Socket } from 'socket.io';

export type ChatSocket = Socket & { nickname?: string };

export type User = {
  id: string;
  nickname: string;
};

export type Users = User[];
