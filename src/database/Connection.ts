import Realm from 'realm';
import { RealmSchemas } from '../types/TypeEnums';
import { ChatUser } from '../types/TypeBase';
import { UserSchema, UserMetaSchema } from '../domains/users/UsersSchemas';
import { TypeRoom } from '../domains/rooms/RoomsType';
import { RoomsMessageSchema, RoomsSchema } from '../domains/rooms/RoomsSchema';

export async function openRealm() {
  return await Realm.open({
    path: 'simplechat',
    schema: [UserSchema, UserMetaSchema, RoomsSchema, RoomsMessageSchema],
    schemaVersion: 3,
  });
}

export async function openUser() {
  return (await openRealm()).objects<ChatUser>(RealmSchemas.USER);
}

export async function openRooms() {
  return (await openRealm()).objects<TypeRoom>(RealmSchemas.ROOMS);
}
