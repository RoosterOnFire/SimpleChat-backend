import { User } from 'realm';
import { logDatabase, logError } from '../helpers/Loggers';
import { RealmSchemas, Roles } from '../types/enums';
import { openRealm } from './Connection';

export async function migrateUsers() {
  try {
    const realm = await openRealm();
    realm.write(() => {
      logDatabase('migrate users');

      const users = realm.objects<User>(RealmSchemas.USER);

      if (users.isEmpty()) {
        realm.create(RealmSchemas.USER, {
          username: 'admin',
          password: 'admin',
          userId: '685f16b63580a5396fd38068bd0966eb',
        });

        realm.create(RealmSchemas.USER, {
          username: 'user',
          password: 'user',
          userId: 'aafd6128e02bfefdfe70da64a700a420',
        });

        realm.create(RealmSchemas.USER_META, {
          role: Roles.ADMIN,
        });

        logDatabase('migrate users done');
      }
    });

    realm.close();
  } catch (error) {
    logError(error);
  }
}
