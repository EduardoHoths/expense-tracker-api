import { Router } from "express";
import { UserController } from "../../../../../interfaces/controllers/user/user-controller";
import { CreateUserUseCase } from "../../../../../application/use-cases/user/create-user/create-user";
import { createUserValidator } from "../../../../../validation/user/user-validator.zod";
import { expressAdapter } from "../../adapters/express-adapter";
import { createUserRepository } from "../../../../database/user-repository/user-repository-factory";

// Repositories
const userRepository = createUserRepository();

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
