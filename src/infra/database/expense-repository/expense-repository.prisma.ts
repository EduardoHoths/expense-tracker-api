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
        userId: expense.userId,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
      },
    });

    return Expense.with({
      ...expenseSaved,
      category: expenseSaved.category as ExpenseCategory,
    });
  }

  async findExpensesByUserId(userId: string): Promise<Expense[] | []> {
    const expenses = await this.prismaClient.expense.findMany({
      where: {
        userId,
      },
    });

    if (!expenses) {
      return [];
    }

    return expenses.map((expense) => {
      return Expense.with({
        ...expense,
        category: expense.category as ExpenseCategory,
      });
    });
  }

  async findExpenseById(expenseId: string): Promise<Expense | null> {
    const expense = await this.prismaClient.expense.findUnique({
      where: {
        id: expenseId,
      },
    });

    if (!expense) {
      return null;
    }

    return Expense.with({
      ...expense,
      category: expense.category as ExpenseCategory,
    });
  }

  async updateExpense(
    expenseId: string,
    fieldsToUpdate: Partial<Expense>
  ): Promise<Expense> {
    const expense = await this.prismaClient.expense.update({
      where: {
        id: expenseId,
      },
      data: {
        ...fieldsToUpdate,
      },
    });

    return Expense.with({
      ...expense,
      category: expense.category as ExpenseCategory,
    });
  }

  async deleteExpenseById(expenseId: string): Promise<void> {
    await this.prismaClient.expense.delete({
      where: {
        id: expenseId,
      },
    });
  }
}
