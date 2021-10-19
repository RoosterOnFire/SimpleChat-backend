import { DataTypes } from 'sequelize';
import { RoomInstance } from '../types/types';
import { connection } from './Connection';

export default connection.define<RoomInstance>('Rooms', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  users: {
    type: DataTypes.STRING,
  },
});
