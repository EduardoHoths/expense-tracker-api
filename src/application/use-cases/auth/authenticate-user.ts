import { UserRepository } from "./../../../domain/interfaces/user-repository";
import { TokenGenerator } from "../../../domain/interfaces/token-generator";
import { UseCase } from "../../usecase";
import { PasswordService } from "../../../shared/services/password-service";

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

    const isPasswordValid = await PasswordService.comparePassword(password, user.password);

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
