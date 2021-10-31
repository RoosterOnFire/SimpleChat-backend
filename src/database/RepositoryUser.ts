import { ChatUser } from '../types/TypeBase';
import { openRealm, openUser } from './Connection';

async function findUserWithId(userId: string) {
  const users = (await openUser()).filtered('userId == $0', userId);

  if (users.isEmpty()) {
    throw new Error('User not found');
  }

  return users[0];
}

async function updateUserLogoff(userId: string) {
  const user = await findUserWithId(userId);
  const realm = await openRealm();

  realm.write(() => {
    user.socketId = '';
    user.sessionId = '';
  });
}

async function updateUserSession(userId: string, sessionId: string) {
  const user = await findUserWithId(userId);
  const realm = await openRealm();

  realm.write(() => {
    user.sessionId = sessionId;
  });
}

async function updateUserSocket(userId: string, socketId: string) {
  const user = await findUserWithId(userId);
  const realm = await openRealm();

  realm.write(() => {
    user.sessionId = socketId;
  });
}

async function findUserWithSessionId(
  sessionId: string
): Promise<ChatUser | null> {
  try {
    return (await openUser()).filtered('sessionId == $0', sessionId)[0];
  } catch (error) {
    return null;
  }
}

async function findWithNameAndPass(
  username: string,
  password: string
): Promise<ChatUser | null> {
  const user = (await openUser()).filtered(
    'username == $0 and password == $1',
    username,
    password
  );
  if (user.isEmpty()) {
    return null;
  }

  return user[0];
}

async function findAndRemoveUser(userId: string) {
  const user = await findUserWithId(userId);

  const realm = await openRealm();
  realm.write(() => {
    realm.delete(user);
  });
}

async function getUsers(): Promise<ChatUser[]> {
  return (await openUser()).map((row) => row);
}

const UserRepository = {
  findAndRemoveUser,
  findUser: findUserWithSessionId,
  findWithNameAndPass,
  getUsers,
  updateUserLogoff,
  updateUserSession,
  updateUserSocket,
};

export default UserRepository;
