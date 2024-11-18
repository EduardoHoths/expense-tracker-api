import { PrismaClient } from "@prisma/client";
import { User } from "../../../domain/entities/user/user";
import { UserRepository } from "../../../domain/interfaces/user-repository";

export class UserRepositoryPrisma implements UserRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

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

  async findAllUsers(): Promise<User[] | []> {
    const users = await this.prismaClient.user.findMany();

    if (!users) {
      return [];
    }

    return users.map((user) => {
      return User.with({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      });
    });
  }

  async findByUserId(userId: string): Promise<User | null> {
    const user = await this.prismaClient.user.findFirst({
      where: {
        id: userId,
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
}
