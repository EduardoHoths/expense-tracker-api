import { PasswordService } from "./../../../shared/services/password-service";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserRepository } from "../../../domain/interfaces/user-repository";
import { TokenService } from "../../../domain/interfaces/token-generator";
import { AuthenticateUserUseCase } from "./authenticate-user";
import { User } from "../../../domain/entities/user/user";

describe("AuthenticateUserUseCase", () => {
  let userRepository: UserRepository;
  let TokenService: TokenService;
  let autheticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    userRepository = {
      save: vi.fn(),
      findByEmail: vi.fn(),
      findByUserId: vi.fn(),
    };

    TokenService = {
      generate: vi.fn(),
      verify: vi.fn(),
    };

    autheticateUserUseCase = new AuthenticateUserUseCase(
      userRepository,
      TokenService
    );
  });

  it("should autheticate a user correctly", async () => {
    const input = {
      email: "test@test.com",
      password: "123456",
    };

    const hashedPassword = await PasswordService.hashPassword(input.password);

    vi.mocked(userRepository.findByEmail).mockImplementation(async () =>
      User.with({
        id: "123",
        name: "test",
        email: "test@test.com",
        password: hashedPassword,
      })
    );

    vi.mocked(TokenService.generate).mockReturnValue("token");

    const output = await autheticateUserUseCase.execute(input);

    expect(output).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("should throw an error if user not found", async () => {
    const input = {
      email: "test@test.com",
      password: "123456",
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

    await expect(autheticateUserUseCase.execute(input)).rejects.toThrow(
      "Invalid credentials"
    );
  });

  it("should throw an error if password is invalid", async () => {
    const input = {
      email: "test@test.com",
      password: "invalid-password",
    };

    const hashedPassword = await PasswordService.hashPassword("123456");

    vi.mocked(userRepository.findByEmail).mockImplementation(async () =>
      User.with({
        id: "123",
        name: "test",
        email: "test@test.com",
        password: hashedPassword,
      })
    );

    await expect(autheticateUserUseCase.execute(input)).rejects.toThrow(
      "Invalid credentials"
    );
  });
});
