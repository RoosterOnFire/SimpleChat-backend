import { logDatabase, logError } from '../../helpers/loggers';
import { RealmSchemas } from '../../types/TypeEnums';
import { openRealm, openRooms } from '../../database/Connection';

async function createRoom(name: string): Promise<boolean> {
  try {
    const realm = await openRealm();

    const rooms = (await openRooms()).filtered('name == $0', name);

    if (rooms.isEmpty()) {
      realm.write(() => {
        logDatabase('create new room - start');

        realm.create(RealmSchemas.ROOMS, {
          name,
          messages: [],
          users: [],
        });

        logDatabase('create new room - success');
      });

      realm.close();

      return true;
    }

    return false;
  } catch (error) {
    logError(error);

    return false;
  }
}

export async function addUser(
  roomName: string,
  username: string
): Promise<boolean> {
  try {
    const room = await findRoom(roomName);
    const realm = await openRealm();
    realm.write(() => {
      room.users.push(username);
    });
    realm.close();

    return true;
  } catch (error) {
    logError(error);

    return false;
  }
}

async function findRoom(name: string) {
  const rooms = (await openRooms()).filtered('name == $0', name);

  if (rooms.isEmpty()) {
    throw new Error('Room not found');
  }

  return rooms[0];
}

const RepositoryRoom = {
  createRoom,
  addUser,
};

export default RepositoryRoom;
