import { Router } from "express";
import { UserController } from "../../../../../interfaces/controllers/user/user-controller";
import { CreateUserUseCase } from "../../../../../application/use-cases/user/create-user/create-user";
import { createUserValidator } from "../../../../../validation/user/user-validator.zod";
import { expressAdapter } from "../../adapters/express-adapter";
import { createUserRepository } from "../../../../database/user-repository/user-repository-factory";

// Repositories
const userRepository = createUserRepository()

// Use Cases
const createUserUseCase = new CreateUserUseCase(userRepository);

// Controllers
const userController = new UserController(
  createUserUseCase,
  createUserValidator
);

// Routes
const userRoutes = Router();

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */ 
userRoutes.post("/create", expressAdapter(userController.createUser));

export { userRoutes };
