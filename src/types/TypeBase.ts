import { User, UserMeta } from "../domains/users/UsersType";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";

export type ChatUser = User & { meta: UserMeta };

export type ChatSocket = Socket & {
  user?: ChatUser;
  sessionState?: "new" | "existings";
};

export type SocketMiddlewareNext = (err?: ExtendedError) => void;

export type SocketRoomsPayload = { roomName: string };

export type SocketCallback = (payload: {
  success: boolean;
  message: string;
  data?: any;
  errors?: any[];
}) => void;
