import { Expense } from "../entities/expense/expense";

export interface ExpenseRepository {
  save(expense: Expense): Promise<Expense>;
  findUserById(userId: string): Promise<Expense[]>;
}
