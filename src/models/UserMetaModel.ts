import { Model } from 'sequelize';
import { UserMetaAttributes, UserMetaCreationAttributes } from '../types/types';

export default class UserMeta
  extends Model<UserMetaAttributes, UserMetaCreationAttributes>
  implements UserMetaAttributes
{
  public role!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
