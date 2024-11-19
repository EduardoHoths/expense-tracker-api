import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { UserRepositoryPrisma } from "./user-repository.prisma";
import { User } from "../../../domain/entities/user/user";

describe("UserRepositoryPrisma", () => {
  let prismaClient: PrismaClient;
  let userRepository: UserRepositoryPrisma;

  beforeAll(() => {
    process.env.DATABASE_URL = "file:./test-user.db";
    execSync("npx prisma migrate");
    prismaClient = new PrismaClient();
  });

  beforeEach(async () => {
    await prismaClient.user.deleteMany();
    userRepository = new UserRepositoryPrisma(prismaClient);
  });

  describe("save", () => {
    it("should save a new user", async () => {
      const user = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
      });

      const savedUser = await userRepository.save(user);

      expect(savedUser).toBeDefined();
      expect(savedUser.id).toBeDefined();
      expect(savedUser.name).toBe("John Doe");
      expect(savedUser.email).toBe("john@example.com");
      expect(savedUser.password).toBe(user.password);
    });
  });

  describe("findByEmail", () => {
    it("should return null when user is not found", async () => {
      const user = await userRepository.findByEmail("nonexistent@example.com");

      expect(user).toBeNull();
    });

    it("should find a user by email", async () => {
      const user = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
      });
      await userRepository.save(user);

      const foundUser = await userRepository.findByEmail("john@example.com");

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe("john@example.com");
    });
  });

  describe("findAllUsers", () => {
    it("should return empty array when no users exist", async () => {
      const users = await userRepository.findAllUsers();

      expect(users).toEqual([]);
    });

    it("should return all users", async () => {
      const user1 = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
      });
      const user2 = await User.create({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "123456",
      });

      await userRepository.save(user1);
      await userRepository.save(user2);

      const users = await userRepository.findAllUsers();

      expect(users).toHaveLength(2);
      expect(users.map((u) => u.email)).toContain("john@example.com");
      expect(users.map((u) => u.email)).toContain("jane@example.com");
    });
  });

  describe("error handling", () => {
    it("should throw error when trying to save user with duplicate email", async () => {
      const user1 = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
      });

      const user2 = await User.create({
        name: "Another John",
        email: "john@example.com",
        password: "123456",
      });

      await userRepository.save(user1);

      await expect(userRepository.save(user2)).rejects.toThrow();
    });
  });
});
