import { Roles } from '../types/enums';
import { UserInstance, UserInstances } from '../types/types';
import { UserModel } from './sequelize';

async function createUser({
  session,
  socket,
  user,
  username,
  password,
  role = Roles.USER,
}: {
  session: string;
  socket: string;
  user: string;
  username: string;
  password: string;
  role?: Roles;
}): Promise<UserInstance> {
  const User = await UserModel.findOrCreate({
    where: { user_id: user },
    defaults: {
      user_id: user,
      socket_id: socket,
      session_id: session,
      username,
      password,
      role,
    },
  });

  return User[0];
}

async function createAdmin(
  userId: string,
  socketId: string,
  sessionId: string,
  username: string = Roles.ADMIN
) {
  return await UserModel.create({
    user_id: userId,
    socket_id: socketId,
    session_id: sessionId,
    username,
    role: Roles.ADMIN,
  });
}

async function updateUserLogoff(user_id: string) {
  return await UserModel.update(
    { socket_id: '', session_id: '' },
    { where: { user_id } }
  );
}

async function updateUserSession(user: string, session: string) {
  await UserModel.update({ session_id: session }, { where: { user_id: user } });
}

async function updateUserSocket(user: string, socket: string) {
  await UserModel.update({ socket }, { where: { user_id: user } });
}

async function findUser(sessionId: string): Promise<UserInstance | null> {
  return UserModel.findOne({ where: { session_id: sessionId } });
}

async function findWithNameAndPass(username: string, password: string) {
  return UserModel.findOne({
    where: { username, password },
  });
}

async function findAndRemoveUser(id: string): Promise<UserInstance | null> {
  const user = await UserModel.findOne({ where: { sessionId: id } });

  if (user) {
    await user.destroy();
  }

  return user;
}

async function getUsers(): Promise<UserInstances> {
  return UserModel.findAll();
}

async function deleteUser(userId: string): Promise<string | undefined> {
  const User = await UserModel.findOne({ where: { user_id: userId } });

  const socket = User?.socket_id;

  User?.destroy();

  return socket;
}

async function isAvailableUsername(username: string) {
  return await UserModel.findAndCountAll({ where: { username } }).then(
    (users) => users.count > 0
  );
}

export const UserRespository = {
  createAdmin,
  createUser,
  deleteUser,
  findAndRemoveUser,
  findUser,
  findWithNameAndPass,
  getUsers,
  isAvailableUsername,
  updateUserLogoff,
  updateUserSession,
  updateUserSocket,
};
