import { UserRepository } from "./../../../domain/interfaces/user-repository";
import { TokenService } from "../../../domain/interfaces/token-generator";
import { UseCase } from "../../usecase";
import { PasswordService } from "../../../shared/services/password-service";
import { InvalidCredentialsError } from "../../errors/auth/invalid-credentials-error";

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
    private TokenService: TokenService
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserInputDTO): Promise<AuthenticateUserOutputDTO> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await PasswordService.comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const token = this.TokenService.generate({
      userId: user.id,
      email: user.email,
    });

    return { accessToken: token };
  }
}
