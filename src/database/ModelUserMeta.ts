import { Model } from 'sequelize';

export interface UserMetaAttributes {
  user_id?: string;
  role: string;
}

export interface UserMetaCreationAttributes extends UserMetaAttributes {}

export default class UserMeta
  extends Model<UserMetaAttributes, UserMetaCreationAttributes>
  implements UserMetaAttributes
{
  public role!: string;
  public user_id!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
