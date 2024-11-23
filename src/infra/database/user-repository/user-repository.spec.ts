import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { User } from "../../../domain/entities/user/user";

import { UserRepositoryMemory } from "./user-repository.memory";
import { UserRepository } from "../../../domain/interfaces/user-repository";

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepositoryMemory();
  });

  describe("save", () => {
    it("should save a new user", async () => {
      const user = await User.create({
        name: "test",
        email: "test@test.com",
        password: "123456",
      });

      const savedUser = await userRepository.save(user);

      expect(savedUser).toBeDefined();
      expect(savedUser.id).toBeDefined();
      expect(savedUser.name).toBe("test");
      expect(savedUser.email).toBe("test@test.com");
      expect(savedUser.password).toBe(user.password);
    });

    it("should throw error when trying to save user with duplicate email", async () => {
      const user1 = await User.create({
        name: "test",
        email: "test@test.com",
        password: "123456",
      });

      const user2 = await User.create({
        name: "test",
        email: "test@test.com",
        password: "123456",
      });

      await userRepository.save(user1);

      await expect(userRepository.save(user2)).rejects.toThrow();
    });
  });

  describe("findByEmail", () => {
    it("should return null when user is not found", async () => {
      const user = await userRepository.findByEmail("nonexistent@example.com");

      expect(user).toBeNull();
    });

    it("should find a user by email", async () => {
      const user = await User.create({
        name: "test",
        email: "test@test.com",
        password: "123456",
      });

      await userRepository.save(user);

      const foundUser = await userRepository.findByEmail("test@test.com");

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe("test@test.com");
    });
  });

  describe("findByUserId", async () => {
    it("should find a user by userId", async () => {
      const user = await User.create({
        name: "test",
        email: "test@test.com",
        password: "123456",
      });

      await userRepository.save(user);

      const foundUser = await userRepository.findByUserId(user.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(user.id);
      expect(foundUser?.password).toBe(user.password);
      expect(foundUser?.name).toBe(user.name);
      expect(foundUser?.email).toBe(user.email);
    });

    it("should return null when user is not found", async () => {
      const user = await userRepository.findByUserId("nonexistent-user-id");

      expect(user).toBeNull();
    });
  });
});
