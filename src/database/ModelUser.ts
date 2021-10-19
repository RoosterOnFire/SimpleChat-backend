import {
  Association,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  Model,
  Optional,
} from 'sequelize';
import { HasOneSetAssociationMixin } from 'sequelize';
import UserMeta from './ModelUserMeta';

export interface UserAttributes {
  password: string;
  session_id: string;
  socket_id: string | null;
  user_id: string;
  username: string;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'user_id'> {}

export default class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public session_id!: string;
  public socket_id!: string | null;
  public user_id!: string;
  public username!: string;

  public getMeta!: HasOneGetAssociationMixin<UserMeta>;
  public setMeta!: HasOneSetAssociationMixin<UserMeta, string>;
  public createMeta!: HasOneCreateAssociationMixin<UserMeta>;

  public static associations: {
    meta: Association<User, UserMeta>;
  };
}
