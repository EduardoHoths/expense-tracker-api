import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserRepository } from "../../../../domain/interfaces/user-repository";
import { User } from "../../../../domain/entities/user/user";
import { CreateUserUseCase } from "./create-user";

describe("CreateUserUseCase", () => {
  let userRepository: UserRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = {
      findByEmail: vi.fn(),
      save: vi.fn(),
      findAllUsers: vi.fn(),
    };

    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it("should create a new user successfully", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };

    vi.mocked(userRepository.findAllUsers).mockResolvedValue([]);
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(userRepository.save).mockImplementation(async (user) => user);

    const result = await createUserUseCase.execute(input);

    expect(result).toBeInstanceOf(User);
    expect(result.email).toBe(input.email);
    expect(result.name).toBe(input.name);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(userRepository.save).toHaveBeenCalledWith(expect.any(User));
  });

  it("should throw an error if user already exists", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };

    vi.mocked(userRepository.findByEmail).mockImplementation(async (email) => {
      if (email === "john@example.com") {
        return User.with({
          id: "123",
          name: "John Doe",
          email: "john@example.com",
          password: "hashedPassword",
          isAdmin: false,
        });
      }
      return null;
    });

    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      "User already exists"
    );
    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it("should create an admin user if there are no existing users", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };

    vi.mocked(userRepository.findAllUsers).mockResolvedValue([]);
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(userRepository.save).mockImplementation(async (user) => user);

    const result = await createUserUseCase.execute(input);
    expect(result).toBeInstanceOf(User);
    expect(result.email).toBe(input.email);
    expect(result.name).toBe(input.name);
    expect(result.isAdmin).toBe(true);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
  });

  it("should create a regular user if there are existing users", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };

    vi.mocked(userRepository.findAllUsers).mockResolvedValue([
      User.with({
        id: "123",
        name: "Jane Doe",
        email: "jane@example.com",
        password: "hashedPassword",
        isAdmin: false,
      }),
    ]);

    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(userRepository.save).mockImplementation(async (user) => user);

    const result = await createUserUseCase.execute(input);
    expect(result).toBeInstanceOf(User);
    expect(result.email).toBe(input.email);
    expect(result.name).toBe(input.name);
    expect(result.isAdmin).toBe(false);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
  });
});