import { prisma } from "../../../package/prisma/prisma";
import { ExpenseRepositoryMemory } from "./expense-repository.memory";
import { ExpenseRepositoryPrisma } from "./expense-repository.prisma";

export const createExpenseRepository = () => {
  if (process.env.NODE_ENV === "test") {
    return new ExpenseRepositoryMemory();
  }

  return new ExpenseRepositoryPrisma(prisma);
};
