import { logDatabase, logError } from "../../helpers/loggers";
import { prisma } from "../../database/ConnectionPrisma";
import { Roles } from "../../types/TypeEnums";

export async function UsersSeed() {
  try {
    logDatabase("migrate users");

    const hasUsers = (await prisma.user.count()) === 0;
    if (hasUsers) {
      await prisma.user.create({
        data: {
          username: "admin",
          password: "admin",
          role: Roles.admin,
          meta: { create: { sessionId: "", socketId: "" } },
        },
      });

      await prisma.user.create({
        data: {
          username: "user",
          password: "user",
          role: Roles.admin,
          meta: { create: { sessionId: "", socketId: "" } },
        },
      });
    }
  } catch (error) {
    logError(error as Error);
  }
}
