import { Router } from "express";
import { AuthController } from "../../../../interfaces/controllers/auth/auth-controller";
import { AuthenticateUserUseCase } from "../../../../application/use-cases/authenticate-user/authenticate-user";
import { UserRepositoryPrisma } from "../../../database/user-repository/user-repository.prisma";
import { prisma } from "../../../../package/prisma/prisma";
import { JwtTokenGenerator } from "../../../services/jwt-tokent-generator";

const userRepository = UserRepositoryPrisma.create(prisma);
const tokenGenerator = JwtTokenGenerator.create();

const authenticateUserUseCase = AuthenticateUserUseCase.create(
  userRepository,
  tokenGenerator
);

const authController = AuthController.create(authenticateUserUseCase);

const router = Router();

router.post("/login", authController.login);

export default router;
