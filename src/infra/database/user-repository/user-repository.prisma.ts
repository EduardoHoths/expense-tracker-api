import { PrismaClient } from "@prisma/client";
import { User } from "../../../domain/entities/user/user";
import { UserRepository } from "../../../domain/interfaces/user-repository";

export class UserRepositoryPrisma implements UserRepository {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new UserRepositoryPrisma(prismaClient);
  }

  async save(user: User): Promise<User> {
    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin,
    };

    const userSaved = await this.prismaClient.user.create({
      data,
    });

    return User.with({
      id: userSaved.id,
      name: userSaved.name,
      email: userSaved.email,
      password: userSaved.password,
      isAdmin: userSaved.isAdmin,
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
      isAdmin: user.isAdmin,
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
        isAdmin: user.isAdmin,
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
      isAdmin: user.isAdmin,
    });
  }
}
