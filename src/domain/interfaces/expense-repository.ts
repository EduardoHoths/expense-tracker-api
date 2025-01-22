import { Expense } from "../entities/expense/expense";

export interface ExpenseRepository {
  save(expense: Expense): Promise<Expense>;
  findExpensesByUserId(userId: string): Promise<Expense[]>;
  findExpenseById(expenseId: string): Promise<Expense | null>;
  updateExpense(expenseId: string, fieldsToUpdate: Partial<Expense>): Promise<Expense>;
}
