import { prisma } from '../../database/ConnectionPrisma';

async function create(name: string) {
  return await prisma.room.create({
    data: {
      name,
    },
  });
}

const RepositoryRoom = {
  create,
};

export default RepositoryRoom;
