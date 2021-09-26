import { DataTypes, Sequelize } from 'sequelize';
import { User, UserInstance, Users } from '../types/types';
import { Roles } from '../types/enums';
import { logDatabase } from './loggers';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  logging: logDatabase,
});

const UserModel = sequelize.define<UserInstance>('User', {
  socketId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
  },
});

UserModel.sync();

export async function addUser({
  session,
  socket,
  user,
  username,
}: {
  session: string;
  socket: string;
  user: string;
  username: string;
}): Promise<User> {
  const User = await UserModel.findOrCreate({
    where: { userId: user },
    defaults: {
      userId: user,
      socketId: socket,
      sessionId: session,
      username: username,
      role: Roles.USER,
    },
  });

  return User[0];
}

export async function addAdmin(
  userId: string,
  socketId: string,
  sessionId: string,
  username: string = Roles.ADMIN
) {
  return await UserModel.create({
    userId,
    socketId,
    sessionId,
    username,
    role: Roles.ADMIN,
  });
}

export async function findUser(sessionId: string): Promise<User | null> {
  return UserModel.findOne({ where: { sessionId } });
}

export async function findAndRemoveUser(id: string): Promise<User | null> {
  const user = await UserModel.findOne({ where: { sessionId: id } });

  if (user) {
    await user.destroy();
  }

  return user;
}

export async function getUsers(): Promise<Users> {
  return UserModel.findAll();
}

export async function isAvailableUsername(username: string) {
  return await UserModel.findAndCountAll({ where: { username } }).then(
    (users) => users.count > 0
  );
}

export async function deleteUser(userId: string): Promise<string | undefined> {
  const user = await UserModel.findOne({ where: { userId } });

  const socket = user?.socketId;

  user?.destroy();

  return socket;
}
