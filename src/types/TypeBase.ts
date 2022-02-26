import { User, UserMeta } from "../domains/users/UsersType";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { SessionStates } from "./TypeEnums";

export type ChatUser = User & { meta: UserMeta };

export type ChatSocket = Socket & {
  user?: ChatUser;
  sessionState?: SessionStates;
};

export type SocketMiddlewareNext = (err?: ExtendedError) => void;

export type SocketRoomsPayload = { roomName: string };

export type SocketCallback = (payload: {
  success: boolean;
  message: string;
  data?: any | SocketCallbackDataRoom;
  errors?: any[];
}) => void;

type SocketCallbackDataRoom = {
  name: string;
};
