import Realm from 'realm';
import { RealmSchemas } from '../types/enums';
import { ChatUser } from '../types/types';

const SchemaUser = {
  name: 'User',
  properties: {
    _id: 'int',
    password: 'string',
    sessionId: 'string',
    socketId: 'string',
    userId: 'string',
    username: 'string',
  },
  primaryKey: '_id',
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
    schemaVersion: 0,
  });
}

export async function openUser() {
  return (await openRealm()).objects<ChatUser>(RealmSchemas.USER);
}
