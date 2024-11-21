import { describe } from "node:test";
import { afterAll, beforeAll, beforeEach, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import request from "supertest";
import Server from "../../server";

describe("User Routes", () => {
  let prismaClient: PrismaClient;
  const server = new Server();
  const app = server.app;

  const TEST_USER = {
    name: "test",
    email: "test@test.com",
    password: "123456",
  };

  beforeAll(() => {
    execSync("npx prisma db push");
    prismaClient = new PrismaClient();
  });

  beforeEach(async () => {
    try {
      await prismaClient.user.delete({ where: { email: TEST_USER.email } });
    } catch (error) {}

    server.start();
  });

  afterAll(async () => {
    await prismaClient.user.deleteMany()
  });

  it("should create a user", async () => {
    const response = await request(app).post("/users/create").send(TEST_USER);

    expect(response.status).toBe(201);
  });
});
