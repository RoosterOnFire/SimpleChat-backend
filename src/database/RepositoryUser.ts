import UserMeta from './ModelUserMeta';
import User from './ModelUser';
import { Roles } from '../types/enums';

async function createUser({
  session,
  socket,
  user,
  username,
  password,
}: {
  session: string;
  socket: string;
  user: string;
  username: string;
  password: string;
  role?: Roles;
}): Promise<User> {
  const resultUser = await User.findOrCreate({
    where: { user_id: user },
    defaults: {
      user_id: user,
      socket_id: socket,
      session_id: session,
      username,
      password,
    },
  });

  return resultUser[0];
}

// async function createAdmin(
//   userId: string,
//   socketId: string,
//   sessionId: string,
//   username: string = Roles.ADMIN
// ) {
//   const user = await User.create({
//     socket_id: socketId,
//     session_id: sessionId,
//   });

//   const userMeta = await UserMetaModel.create({
//     role: Roles.ADMIN,
//     user_id: userId,
//     username,
//   });

//   return { user, userMeta };
// }

async function updateUserLogoff(user_id: string) {
  return await User.update(
    { socket_id: '', session_id: '' },
    { where: { user_id } }
  );
}

async function updateUserSession(user: string, session: string) {
  await User.update({ session_id: session }, { where: { user_id: user } });
}

async function updateUserSocket(user: string, socket: string) {
  await User.update({ socket_id: socket }, { where: { user_id: user } });
}

async function findUser(sessionId: string): Promise<User | null> {
  return User.findOne({ where: { session_id: sessionId } });
}

async function findWithNameAndPass(username: string, password: string) {
  return await User.findOne({
    where: { username, password },
  });
}

async function findAndRemoveUser(id: string): Promise<User | null> {
  const user = await User.findOne({ where: { session_id: id } });

  if (user) {
    await user.destroy();
  }

  return user;
}

async function getUsers(): Promise<User[]> {
  return User.findAll();
}

async function deleteUser(userId: string): Promise<string | undefined> {
  const foundUser = await User.findOne({ where: { user_id: userId } });

  const socket = foundUser?.socket_id;

  User?.destroy();

  return socket || undefined;
}

function isAvailableUsername(username: string) {
  User.findAndCountAll({
    where: { username },
    include: UserMeta,
  }).then((users) => users.count > 0);
}

const UserRepository = {
  // createAdmin,
  createUser,
  deleteUser,
  findAndRemoveUser,
  findUser,
  findWithNameAndPass,
  getUsers,
  isAvailableUsername,
  updateUserLogoff,
  updateUserSession,
  updateUserSocket,
};

export default UserRepository;
