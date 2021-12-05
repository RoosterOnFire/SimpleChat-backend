import Realm from 'realm';
import { RealmSchemas } from '../types/TypeEnums';
import { ChatUser } from '../types/TypeBase';
import { TypeRoom } from '../domains/rooms/RoomsType';
import { RoomsMessageSchema, RoomsSchema } from '../domains/rooms/RoomsSchema';

export async function openRealm() {
  return await Realm.open({
    path: 'simplechat',
    schema: [RoomsSchema, RoomsMessageSchema],
    schemaVersion: 3,
  });
}

export async function openRooms() {
  return (await openRealm()).objects<TypeRoom>(RealmSchemas.ROOMS);
}
