import { prisma } from "../../../package/prisma/prisma";
import { UserRepositoryMemory } from "./user-repository.memory";
import { UserRepositoryPrisma } from "./user-repository.prisma";

export const createUserRepository = () => {
  if (process.env.NODE_ENV === "test") {
    return new UserRepositoryMemory();
  }

  return new UserRepositoryPrisma(prisma);
};
