import { UserRepository } from "../../../domain/interfaces/user-repository";
import { User } from "../../../domain/entities/user/user";

export class UserRepositoryMemory implements UserRepository {
  private users: User[] = [];

  constructor() {
    this.users.push(
      User.with({
        id: "1",
        name: "test auth",
        email: "test.auth@test.com",
        password:
          "$2y$10$NL1tz4Nx2e0yIgXpe/vRIuHkRJcAaTdslIMFI3tEXvvB0QQHCdFxK",
      })
    );
  }

  async save(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findAllUsers(): Promise<User[] | []> {
    return this.users;
  }

  async findByUserId(userId: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === userId);

    if (!user) {
      return null;
    }

    return user;
  }
}
