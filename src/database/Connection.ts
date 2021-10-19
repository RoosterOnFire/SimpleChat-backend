import { DataTypes, Sequelize } from 'sequelize';
import { logError, logInfo } from '../helpers/loggers';
import { Roles } from '../types/enums';
import UserMeta from './ModelUserMeta';
import User from './ModelUser';

export const connection = new Sequelize(
  'simplechat',
  'simplechat',
  'simplechat',
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
  }
);

connection
  .authenticate()
  .then(() => logInfo('Database connected'))
  .catch(logError);

User.init(
  {
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
  },
  { sequelize: connection }
);

UserMeta.init(
  {
    user_id: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: connection,
  }
);

User.hasOne(UserMeta, {
  as: 'meta',
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});
UserMeta.belongsTo(User);

Promise.all([User.sync(), UserMeta.sync()]).then(() => {
  /** HARD CODED TEST USERS */
  Promise.all([
    User.findOrCreate({
      where: {
        user_id: '685f16b63580a5396fd38068bd0966eb',
      },
      defaults: {
        password: 'admin',
        session_id: '6c0ddb2d3ab37ed18a0e39f71ce0db0d',
        user_id: '685f16b63580a5396fd38068bd0966eb',
        username: 'admin',
        socket_id: '',
      },
    }),
    UserMeta.findOrCreate({
      where: {
        user_id: '685f16b63580a5396fd38068bd0966eb',
      },
      defaults: {
        user_id: '685f16b63580a5396fd38068bd0966eb',
        role: Roles.ADMIN,
      },
    }),
    User.findOrCreate({
      where: {
        username: 'user',
        user_id: 'aafd6128e02bfefdfe70da64a700a420',
      },
      defaults: {
        password: 'user',
        session_id: 'da41d684650c48cec8dc20ea8beab7da',
        user_id: 'aafd6128e02bfefdfe70da64a700a420',
        username: 'user',
        socket_id: '',
      },
    }),
    UserMeta.findOrCreate({
      where: {
        user_id: 'aafd6128e02bfefdfe70da64a700a420',
      },
      defaults: {
        user_id: 'aafd6128e02bfefdfe70da64a700a420',
        role: Roles.USER,
      },
    }),
  ]).catch(console.error);
});
