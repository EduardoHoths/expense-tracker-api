import { Router } from "express";
import { ExpenseController } from "../../../../interfaces/controllers/expense/expense-controller";
import { CreateExpenseUseCase } from "../../../../application/use-cases/expense/create-expense/create-expense";
import { prisma } from "../../../../package/prisma/prisma";
import { UserRepositoryPrisma } from "../../../database/user-repository/user-repository.prisma";
import { ExpenseRepositoryPrisma } from "../../../database/expense-repository/expense-repository.prisma";
import { JwtService } from "../../../services/jwt-service";

// Validator
import { createExpenseValidator } from "../../../../validation/expense/expense-validator.zod";
import { expressAdapter } from "../adapters/express-adapter";

// Token Generator
const tokenService = new JwtService();

// Repositories
const userRepository = new UserRepositoryPrisma(prisma);
const expenseRepository = new ExpenseRepositoryPrisma(prisma);

// Use Cases
const createExpenseUseCase = new CreateExpenseUseCase(
  expenseRepository,
  userRepository
);

// Controllers
const expenseController = new ExpenseController(
  createExpenseUseCase,
  createExpenseValidator,
  tokenService
);

// Routes
const expenseRoutes = Router();
expenseRoutes.post("/create", expressAdapter(expenseController.createExpense));

export { expenseRoutes };
