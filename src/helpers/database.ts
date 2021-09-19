import { DataTypes, Sequelize } from 'sequelize';
import { DATABASE_FILE } from '../constants/const';
import { User, UserInstance, Users } from '../constants/types';
import { logDatabase } from './helpers';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DATABASE_FILE,
  logging: (msg) => logDatabase(msg),
});

const UserModel = sequelize.define<UserInstance>('User', {
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
});

UserModel.sync();

export async function addUser(
  userId: string,
  sessionId: string,
  username: string
): Promise<User> {
  const user = await UserModel.findOrCreate({
    where: { userId },
    defaults: { userId, sessionId, username },
  });

  return user[0];
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

export async function isUsedUsername(username: string) {
  const user = await UserModel.findAll({ where: { username } });

  return user.length > 0;
}

export async function deleteUser(userId: string): Promise<{ message: string }> {
  const user = await UserModel.findOne({ where: { userId } });

  user?.destroy();

  return { message: `user deleted` };
}
