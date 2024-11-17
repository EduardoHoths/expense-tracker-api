import { UserRepository } from "./../../../domain/interfaces/user-repository";
import { TokenGenerator } from "../../../domain/interfaces/token-generator";
import { UseCase } from "../../usecase";

interface AuthenticateUserInputDTO {
  email: string;
  password: string;
}

interface AuthenticateUserOutputDTO {
  accessToken: string;
}

export class AuthenticateUserUseCase
  implements UseCase<AuthenticateUserInputDTO, AuthenticateUserOutputDTO>
{
  constructor(
    private userRepository: UserRepository,
    private tokenGenerator: TokenGenerator
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserInputDTO): Promise<AuthenticateUserOutputDTO> {
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
