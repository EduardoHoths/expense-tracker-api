import { Router } from "express";
import { UserController } from "../../../../interfaces/controllers/user/user-controller";
import { CreateUserUseCase } from "../../../../application/use-cases/user/create-user/create-user";
import { UserRepositoryPrisma } from "../../../database/user-repository/user-repository.prisma";
import { prisma } from "../../../../package/prisma/prisma";
import { createUserValidator } from "../../../../validation/user/user-validator.zod";
import { expressAdapter } from "../adapters/express-adapter";

// Repositories
const userRepository = new UserRepositoryPrisma(prisma);

// Use Cases
const createUserUseCase = new CreateUserUseCase(userRepository);

// Controllers
const userController = new UserController(
  createUserUseCase,
  createUserValidator
);

// Routes
const userRoutes = Router();

userRoutes.post("/create", expressAdapter(userController.createUser));

export { userRoutes };
