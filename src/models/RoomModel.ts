import { DataTypes } from 'sequelize';
import { RoomInstance } from '../types/types';
import { sequelize } from '../helpers/ConnectionSequelize';

export default sequelize.define<RoomInstance>('Rooms', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  users: {
    type: DataTypes.STRING,
  },
});
