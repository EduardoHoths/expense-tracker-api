import { User } from "../../../domain/entities/user/user";
import { UserRepository } from "../../../domain/interfaces/user-repository";
import { UseCase } from "../../usecase";

interface CreateUserInputDto {
  name: string;
  email: string;
  password: string;
}

type CreateUserOutputDto = User;

export class CreateUserUseCase
  implements UseCase<CreateUserInputDto, CreateUserOutputDto>
{
  constructor(private userRepository: UserRepository) {}

  public static create(userRepository: UserRepository) {
    return new CreateUserUseCase(userRepository);
  }

  async execute({
    email,
    name,
    password,
  }: CreateUserInputDto): Promise<CreateUserOutputDto> {
    if (!name || !email || !password) {
      throw new Error("Missing required fields");
    }

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await User.create(email, password, name);

    const userSaved = await this.userRepository.save(user);

    return userSaved;
  }
}
