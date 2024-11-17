import { PrismaClient } from "@prisma/client";
import { ExpenseRepository } from "../../domain/interfaces/expense-repository";
import { Expense } from "../../domain/entities/expense/expense";
import { ExpenseCategory } from "../../domain/entities/expense/expense-category";

export class ExpenseRepositoryPrisma implements ExpenseRepository {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new ExpenseRepositoryPrisma(prismaClient);
  }

  async save(expense: Expense): Promise<Expense> {
    const expenseSaved = await this.prismaClient.expenses.create({
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

  async findUserById(userId: string): Promise<Expense[] | []> {
    const user = await this.prismaClient.users.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const expenses = await this.prismaClient.expenses.findMany({
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