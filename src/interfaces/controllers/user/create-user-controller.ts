import { Request, Response } from "express";
import { UserRepositoryPrisma } from "../../../infra/database/user-repository/user-repository.prisma";
import { prisma } from "../../../package/prisma/prisma";
import { CreateUserUseCase } from "../../../application/use-cases/user/create-user/create-user";
import { UserPresenter } from "../../presenters/user-presenter";

const userRepository = UserRepositoryPrisma.create(prisma);
const createUser = CreateUserUseCase.create(userRepository);

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = await createUser.execute(req.body);

    const responseBody = UserPresenter.toJSON(user);

    res
      .status(201)
      .json({ message: "User created successfully", user: responseBody });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
