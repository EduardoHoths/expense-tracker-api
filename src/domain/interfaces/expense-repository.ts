import { Expense } from "../entities/expense/expense";

export interface ExpenseRepository {
  save(expense: Expense): Promise<Expense>;
  findExpensesByUserId(userId: string): Promise<Expense[]>;
}
