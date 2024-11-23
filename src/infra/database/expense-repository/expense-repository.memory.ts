import { UserNotFoundError } from "../../../application/errors/expense/user-not-found";
import { Expense } from "../../../domain/entities/expense/expense";
import { ExpenseRepository } from "../../../domain/interfaces/expense-repository";
import { UserRepositoryMemory } from "../user-repository/user-repository.memory";

export class ExpenseRepositoryMemory implements ExpenseRepository {
  private expenses: Expense[] = [];

  constructor() {}

  async save(expense: Expense): Promise<Expense> {
    this.expenses.push(expense);

    return expense;
  }

  async findExpensesByUserId(userId: string): Promise<Expense[]> {
    const expenses = this.expenses.filter(
      (expense) => expense.userId === userId
    );

    return expenses;
  }
}
