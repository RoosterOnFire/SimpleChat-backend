import { DataTypes, Sequelize } from 'sequelize';
import { UserInstance, UserInstances } from '../types/types';
import { Roles } from '../types/enums';
import { logDatabase } from './loggers';
import { createRndId } from './helpers';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  logging: logDatabase,
});

const UserModel = sequelize.define<UserInstance>('User', {
  socket_id: {
    type: DataTypes.STRING,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  session_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
  },
});

UserModel.sync().then(() => {
  /** HARD CODED TEST USERS */
  UserModel.create({
    user_id: createRndId(),
    session_id: createRndId(),
    username: 'admin',
    password: 'admin',
    role: Roles.ADMIN,
  });

  UserModel.create({
    user_id: createRndId(),
    session_id: createRndId(),
    username: 'user',
    password: 'user',
    role: Roles.USER,
  });
});

export async function createUser({
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

export async function createAdmin(
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

export async function updateSocket(user: string, socket: string) {
  await UserModel.update({ socket }, { where: { user_id: user } });
}

export async function findUser(
  sessionId: string
): Promise<UserInstance | null> {
  return UserModel.findOne({ where: { session_id: sessionId } });
}

export async function findUserWithNameAndPass(
  username: string,
  password: string
) {
  return UserModel.findOne({
    where: { username, password },
  });
}

export async function findAndRemoveUser(
  id: string
): Promise<UserInstance | null> {
  const user = await UserModel.findOne({ where: { sessionId: id } });

  if (user) {
    await user.destroy();
  }

  return user;
}

export async function getUsers(): Promise<UserInstances> {
  return UserModel.findAll();
}

export async function isAvailableUsername(username: string) {
  return await UserModel.findAndCountAll({ where: { username } }).then(
    (users) => users.count > 0
  );
}

export async function deleteUser(userId: string): Promise<string | undefined> {
  const User = await UserModel.findOne({ where: { user_id: userId } });

  const socket = User?.socket_id;

  User?.destroy();

  return socket;
}
