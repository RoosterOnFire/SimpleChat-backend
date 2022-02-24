import { Room } from "@prisma/client";
import { prisma } from "../../database/ConnectionPrisma";

async function findOrCreate(name: string): Promise<Room> {
  const isExistingRoom = await prisma.room.findFirst({
    where: { name },
  });

  if (isExistingRoom) {
    return isExistingRoom;
  }

  return create(name);
}

async function create(name: string): Promise<Room> {
  return await prisma.room.create({
    data: { name },
  });
}

const RepositoryRoom = {
  create: findOrCreate,
};

export default RepositoryRoom;
