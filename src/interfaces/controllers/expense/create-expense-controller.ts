import { Request, Response } from "express";
import { ExpenseRepositoryPrisma } from "../../../infra/database/expense-repository.prisma";
import { CreateExpenseUseCase } from "../../../application/use-cases/expense/create-expense/create-expense";
import { prisma } from "../../../package/prisma/prisma";
import { ExpensePresenter } from "../../presenters/expense-presenter";
import { UserRepositoryPrisma } from "../../../infra/database/user-repository/user-repository.prisma";

const ExpenseRepository = ExpenseRepositoryPrisma.create(prisma);
const UserRepository = UserRepositoryPrisma.create(prisma);
const createExpense = CreateExpenseUseCase.create(ExpenseRepository, UserRepository);

export const createExpenseController = async (req: Request, res: Response) => {
  const { description, amount, date, category, userId } = req.body;

  if (!description || !amount || !date || !category || !userId) {
    res.status(400).json({ error: "Missing required fields" });

    return;
  }

  try {
    const Expense = await createExpense.execute({
      description,
      amount,
      date: new Date(date),
      category,
      userId,
    });

    const responseBody = ExpensePresenter.present(Expense);

    res
      .status(201)
      .json({ message: "Expense created successfully", Expense: responseBody });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
