import { UserRepository } from "./../../../domain/interfaces/user-repository";
import { TokenGenerator } from "../../../domain/interfaces/token-generator";
import { UseCase } from "../../usecase";

interface AuthenticateUserInputDto {
  email: string;
  password: string;
}

interface AuthenticateUserOutputDto {
  accessToken: string;
}

export class AuthenticateUserUseCase
  implements UseCase<AuthenticateUserInputDto, AuthenticateUserOutputDto>
{
  constructor(
    private userRepository: UserRepository,
    private tokenGenerator: TokenGenerator
  ) {}

  public static create(
    userRepository: UserRepository,
    tokenGenerator: TokenGenerator
  ) {
    return new AuthenticateUserUseCase(userRepository, tokenGenerator);
  }

  async execute({
    email,
    password,
  }: AuthenticateUserInputDto): Promise<AuthenticateUserOutputDto> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = this.tokenGenerator.generate({
      userId: user.id,
      email: user.email,
    });

    return { accessToken: token };
  }
}
