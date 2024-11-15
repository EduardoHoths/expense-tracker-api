import { PrismaClient } from "@prisma/client";
import { User } from "../../domain/entities/user/user";
import { UserRepository } from "./../../domain/interfaces/user-repository";

export class UserRepositoryPrisma implements UserRepository {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new UserRepositoryPrisma(prismaClient);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaClient.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return User.with({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    });
  }

  async save(user: User): Promise<User> {
    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    };

    const userSaved = await this.prismaClient.user.create({
      data,
    });

    return User.with({
      id: userSaved.id,
      name: userSaved.name,
      email: userSaved.email,
      password: userSaved.password,
    });
  }
}
