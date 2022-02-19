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

export enum ChatSocketMessages {
  chat_join = "chat:join",
  chat_message = "chat:message",
  connect_error = "connect_error",
  connect_logout = "connect:logout",
  connect_registration = "connect:registration",
  connect_signin = "connect:signin",
  rooms_create = "rooms:create",
  rooms_join = "rooms:join",
  rooms_leave = "rooms:leave",
  session_closed = "session:closed",
  session_created = "session:created",
  session_restore = "session:restore",
  user_kick = "user:kick",
  users_update = "users:update",
}
