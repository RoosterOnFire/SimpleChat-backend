import { ChatUser } from '../../types/TypeBase';
import { prisma } from '../../database/ConnectionPrisma';
import { User, UserMeta } from './UsersType';

async function create(username: string, password: string, socketId: string) {
  return await prisma.user.create({
    data: {
      username,
      password,
      meta: { create: { socketId, sessionId: '' } },
    },
    include: { meta: true },
  });
}

async function isUsernameUsed(username: string): Promise<boolean> {
  try {
    return (await prisma.user.count({ where: { username } })) === 1;
  } catch (error) {
    return false;
  }
}

async function findWithNameAndPassword(
  username: string,
  password: string
): Promise<(User & { meta: UserMeta }) | null> {
  try {
    return await prisma.user.findFirst({
      where: { username, password },
      include: { meta: true },
    });
  } catch (error) {
    return null;
  }
}

async function updateSocket(user: User, socketId: string): Promise<boolean> {
  try {
    await prisma.userMeta.upsert({
      where: { id: user.userMetaId },
      update: { socketId },
      create: { socketId, sessionId: '' },
    });

    return true;
  } catch (error) {
    return false;
  }
}

async function logout(socketId: string): Promise<boolean> {
  try {
    const metaWithSocketId = await prisma.userMeta.findFirst({
      where: { socketId },
    });

    await prisma.userMeta.update({
      where: { id: metaWithSocketId?.id },
      data: { socketId: '', sessionId: '' },
    });

    return true;
  } catch (error) {
    return false;
  }
}

async function updateSession(user: User, sessionId: string) {
  try {
    await prisma.userMeta.update({
      where: { id: user.userMetaId },
      data: { sessionId },
    });

    return true;
  } catch (error) {
    return false;
  }
}

async function findWithSession(sessionId: string): Promise<ChatUser | null> {
  try {
    const userMeta = await prisma.userMeta.findFirst({
      where: { sessionId, NOT: { socketId: '' } },
      include: { User: true },
    });

    if (userMeta && userMeta.User) {
      return await prisma.user.findUnique({
        where: { id: userMeta.User.id },
        include: { meta: true },
      });
    }

    return null;
  } catch (error) {
    return null;
  }
}

async function remove(username: string): Promise<boolean> {
  try {
    await prisma.user.delete({ where: { username } });

    return true;
  } catch (error) {
    return false;
  }
}

async function getAll() {
  return await prisma.user.findMany();
}

const UserRepository = {
  create,
  findWithNameAndPassword,
  findWithSession,
  getAll,
  isUsernameUsed,
  remove,
  logout,
  updateSession,
  updateSocket,
};

export default UserRepository;
