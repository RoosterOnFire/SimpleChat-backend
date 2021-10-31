import Realm from 'realm';
import { RealmSchemas } from '../types/TypeEnums';
import { ChatUser } from '../types/TypeBase';

const SchemaUser = {
  name: 'User',
  properties: {
    password: 'string',
    sessionId: 'string?',
    socketId: 'string?',
    userId: 'string',
    username: 'string',
  },
  primaryKey: 'userId',
};

const SchemaUserMeta = {
  name: 'UserMeta',
  properties: {
    role: 'string',
  },
};

export async function openRealm() {
  return await Realm.open({
    path: 'simplechat',
    schema: [SchemaUser, SchemaUserMeta],
    schemaVersion: 1,
  });
}

export async function openUser() {
  return (await openRealm()).objects<ChatUser>(RealmSchemas.USER);
}
