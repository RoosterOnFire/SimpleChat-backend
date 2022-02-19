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

export enum Roles {
  admin = "admin",
  user = "user",
}

export enum Errors {
  error_invalid_sing_in = "error_invalid_sing_in",
  error_username_in_use = "error_username_in_use",
  error_new_user_not_created = "error_new_user_not_created",
}
