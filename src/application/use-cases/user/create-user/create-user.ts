import { User } from "../../../../domain/entities/user/user";
import { UserRepository } from "../../../../domain/interfaces/user-repository";
import { UseCase } from "../../../usecase";

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
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const users = await this.userRepository.findAllUsers();

    const isAdmin = users.length === 0;

    const user = await User.create({ email, password, name, isAdmin });

    return await this.userRepository.save(user);
  }
}
