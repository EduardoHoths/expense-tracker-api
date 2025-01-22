import { beforeEach, describe, expect, it } from "vitest";
import { User } from "../../../domain/entities/user/user";

import { UserRepositoryMemory } from "./user-repository.memory";
import { UserRepository } from "../../../domain/interfaces/user-repository";
import { CreateUserUseCase } from "../../../application/use-cases/user/create-user/create-user";

describe("UserRepository", () => {
  let userRepository: UserRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = new UserRepositoryMemory();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  describe("save", () => {
    it("should save a new user", async () => {
      const user = await User.create({
        name: "test",
        email: "test@test.com",
        password: "123456",
      });

      const savedUser = await createUserUseCase.execute(user);

      expect(savedUser).toBeDefined();
      expect(savedUser.id).toBeDefined();
      expect(savedUser.name).toBe("test");
      expect(savedUser.email).toBe("test@test.com");
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

      await createUserUseCase.execute(user1);

      await expect(createUserUseCase.execute(user2)).rejects.toThrow();
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

      await createUserUseCase.execute(user);

      const foundUser = await userRepository.findByEmail("test@test.com");

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe("test@test.com");
    });
  });

  describe("findByUserId", async () => {
    it("should find a user by userId", async () => {
      const user = await createUserUseCase.execute({
        name: "test",
        email: "test@test.com",
        password: "123456",
      });

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
