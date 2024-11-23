import { Router } from "express";
import { JwtService } from "../../../../services/jwt-service";
import { AuthenticateUserUseCase } from "../../../../../application/use-cases/auth/authenticate-user";
import { AuthController } from "../../../../../interfaces/controllers/auth/auth-controller";
import { authValidator } from "../../../../../validation/auth/auth-validator";
import { expressAdapter } from "../../adapters/express-adapter";
import { createUserRepository } from "../../../../database/user-repository/user-repository-factory";

const tokenService = new JwtService();

const userRepository = createUserRepository();

const authenticateUserUseCase = new AuthenticateUserUseCase(
  userRepository,
  tokenService
);

const authController = new AuthController(
  authenticateUserUseCase,
  authValidator
);

const authRoutes = Router();
authRoutes.post("/login", expressAdapter(authController.auth));

export { authRoutes };
