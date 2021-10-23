import { User } from 'realm';
import { logDatabase, logError } from '../helpers/loggers';
import { Roles } from '../types/enums';
import { openRealm } from './Connection';

export async function migrateUsers() {
  try {
    const realm = await openRealm();
    realm.write(() => {
      logDatabase('migrate users');

      const users = realm.objects<User>('User');

      if (users.isEmpty()) {
        realm.create('User', {
          _id: 1,
          username: 'admin',
          password: 'admin',
          sessionId: '6c0ddb2d3ab37ed18a0e39f71ce0db0d',
          socketId: '',
          userId: '685f16b63580a5396fd38068bd0966eb',
        });

        realm.create('User', {
          _id: 2,
          username: 'user',
          password: 'user',
          sessionId: 'da41d684650c48cec8dc20ea8beab7da',
          socketId: '',
          userId: 'aafd6128e02bfefdfe70da64a700a420',
        });

        realm.create('UserMeta', {
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
