import { PrismaClient } from "@prisma/client";

process.env.NODE_ENV === "test"
  ? (process.env.DATABASE_URL = "file:./test.db")
  : (process.env.DATABASE_URL = "file:./dev.db");

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
