import Realm from 'realm';
import { RealmSchemas } from '../types/TypeEnums';
import { ChatUser } from '../types/TypeBase';
import {
  SchemaRoomMessge,
  SchemaRooms,
  SchemaUser,
  SchemaUserMeta,
} from './Schemas';

export async function openRealm() {
  return await Realm.open({
    path: 'simplechat',
    schema: [SchemaUser, SchemaUserMeta, SchemaRooms, SchemaRoomMessge],
    schemaVersion: 1,
  });
}

export async function openUser() {
  return (await openRealm()).objects<ChatUser>(RealmSchemas.USER);
}
