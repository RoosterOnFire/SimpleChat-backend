import { DataTypes, Sequelize } from 'sequelize';
import { createRndId } from '../helpers/helpers';
import { logDatabase } from '../helpers/loggers';
import { Roles } from '../types/enums';
import { RoomInstance, UserInstance } from '../types/types';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  logging: logDatabase,
});

export const UserModel = sequelize.define<UserInstance>('User', {
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

export const RoomModel = sequelize.define<RoomInstance>('Rooms', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  users: {
    type: DataTypes.STRING,
  },
});
