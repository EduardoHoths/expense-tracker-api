import { PrismaClient } from "@prisma/client";
import { ExpenseRepository } from "../../../domain/interfaces/expense-repository";
import { Expense } from "../../../domain/entities/expense/expense";
import { ExpenseCategory } from "../../../domain/entities/expense/expense-category";

export class ExpenseRepositoryPrisma implements ExpenseRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async save(expense: Expense): Promise<Expense> {
    const expenseSaved = await this.prismaClient.expense.create({
      data: {
        id: expense.id,
        user_id: expense.userId,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
      },
    });

    return Expense.with({
      id: expenseSaved.id,
      userId: expenseSaved.user_id,
      description: expenseSaved.description,
      amount: expenseSaved.amount,
      date: expenseSaved.date,
      category: expenseSaved.category as ExpenseCategory,
    });
  }

  async findExpensesByUserId(userId: string): Promise<Expense[] | []> {
    const user = await this.prismaClient.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const expenses = await this.prismaClient.expense.findMany({
      where: {
        user_id: userId,
      },
    });

    if (!expenses) {
      return [];
    }

    return expenses.map((expense) => {
      return Expense.with({
        id: expense.id,
        userId: expense.user_id,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category: expense.category as ExpenseCategory,
      });
    });
  }
}
