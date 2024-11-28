import { Router } from "express";
import { ExpenseController } from "../../../../../interfaces/controllers/expense/expense-controller";
import { CreateExpenseUseCase } from "../../../../../application/use-cases/expense/create-expense/create-expense";
import {
  createExpenseValidator,
  listExpenseValidator,
} from "../../../../../validation/expense/expense-validator.zod";
import { expressAdapter } from "../../adapters/express-adapter";
import { createUserRepository } from "../../../../database/user-repository/user-repository-factory";
import { createExpenseRepository } from "../../../../database/expense-repository/expense-repository-factory";
import { AuthMiddleware } from "../../middlewares/auth-middleware";
import { ListExpensesUseCase } from "../../../../../application/use-cases/expense/list-expense/list-expense";

// Repositories
const userRepository = createUserRepository();
const expenseRepository = createExpenseRepository();

// Use Cases
const createExpenseUseCase = new CreateExpenseUseCase(
  expenseRepository,
  userRepository
);

const listExpenseUseCase = new ListExpensesUseCase(expenseRepository);

// Controllers
const expenseController = new ExpenseController(
  createExpenseUseCase,
  createExpenseValidator,
  listExpenseUseCase,
  listExpenseValidator
);

const authMiddleware = new AuthMiddleware();

// Routes
const expenseRoutes = Router();

expenseRoutes.post(
  "/create",
  authMiddleware.execute.bind(authMiddleware),
  expressAdapter(expenseController.createExpense)
);

expenseRoutes.get(
  "/list",
  authMiddleware.execute.bind(authMiddleware),
  expressAdapter(expenseController.listExpense)
);

export { expenseRoutes };
