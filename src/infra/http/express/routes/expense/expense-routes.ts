import { Router } from "express";
import { ExpenseController } from "../../../../../interfaces/controllers/expense/expense-controller";
import { CreateExpenseUseCase } from "../../../../../application/use-cases/expense/create-expense/create-expense";
import { JwtService } from "../../../../services/jwt-service";

// Validator
import { createExpenseValidator } from "../../../../../validation/expense/expense-validator.zod";
import { expressAdapter } from "../../adapters/express-adapter";
import { createUserRepository } from "../../../../database/user-repository/user-repository-factory";
import { createExpenseRepository } from "../../../../database/expense-repository/expense-repository-factory";

// Token Generator
const tokenService = new JwtService();

// Repositories
const userRepository = createUserRepository();
const expenseRepository = createExpenseRepository();

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
