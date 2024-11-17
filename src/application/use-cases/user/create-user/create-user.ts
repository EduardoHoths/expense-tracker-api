import { User } from "../../../../domain/entities/user/user";
import { UserRepository } from "../../../../domain/interfaces/user-repository";
import { UseCase } from "../../../usecase";

interface CreateUserInputDTO {
  name: string;
  email: string;
  password: string;
}

type CreateUserOutputDTO = User;

export class CreateUserUseCase
  implements UseCase<CreateUserInputDTO, CreateUserOutputDTO>
{
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    name,
    password,
  }: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await User.create({ email, password, name });

    return await this.userRepository.save(user);
  }
}
