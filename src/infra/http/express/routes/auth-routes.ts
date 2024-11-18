import { Router } from "express";
import { expressAdapter } from "../adapters/express-adapter";
import { AuthController } from "../../../../interfaces/controllers/auth/auth-controller";
import { AuthenticateUserUseCase } from "../../../../application/use-cases/auth/authenticate-user";
import { UserRepositoryPrisma } from "../../../database/user-repository/user-repository.prisma";
import { prisma } from "../../../../package/prisma/prisma";
import { JwtService } from "../../../services/jwt-service";
import { authValidator } from "../../../../validation/auth/auth-validator";

const tokenService = new JwtService();

const userRepository = new UserRepositoryPrisma(prisma);

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
