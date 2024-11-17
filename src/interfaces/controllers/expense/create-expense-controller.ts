import { Request, Response } from "express";
import { ExpenseRepositoryPrisma } from "../../../infra/database/expense-repository/expense-repository.prisma";
import { CreateExpenseUseCase } from "../../../application/use-cases/expense/create-expense/create-expense";
import { prisma } from "../../../package/prisma/prisma";
import { ExpensePresenter } from "../../presenters/expense-presenter";
import { UserRepositoryPrisma } from "../../../infra/database/user-repository/user-repository.prisma";
import { JwtTokenGenerator } from "../../../infra/services/jwt-tokent-generator";
import { JsonWebTokenError } from "jsonwebtoken";

const ExpenseRepository = ExpenseRepositoryPrisma.create(prisma);
const UserRepository = UserRepositoryPrisma.create(prisma);
const TokenGenerator = JwtTokenGenerator.create();
const createExpense = CreateExpenseUseCase.create(
  ExpenseRepository,
  UserRepository,
  TokenGenerator
);

export const createExpenseController = async (req: Request, res: Response) => {
  const { description, amount, date, category } = req.body;

  if (!description || !amount || !date || !category) {
    res.status(400).json({ error: "Missing required fields" });

    return;
  }

  const accessToken = req.headers.authorization;

  if (!accessToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const Expense = await createExpense.execute({
      description,
      amount,
      date: new Date(date),
      category,
      accessToken: accessToken.split(" ")[1],
    });

    const responseBody = ExpensePresenter.toJSON(Expense);

    res
      .status(201)
      .json({ message: "Expense created successfully", Expense: responseBody });
  } catch (error: any) {
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    res.status(400).json({ error: error.message });
  }
};
