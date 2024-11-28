import { Expense } from "../../../domain/entities/expense/expense";
import { ExpenseCategory } from "../../../domain/entities/expense/expense-category";
import { ExpenseRepository } from "../../../domain/interfaces/expense-repository";
import { DateUtils } from "../../../utils/date-utils";

export class ExpenseRepositoryMemory implements ExpenseRepository {
  private expenses: Expense[] = [];

  constructor() {
    this.expenses.push(
      Expense.with({
        id: "1",
        description: "Last Week",
        amount: 100,
        date: DateUtils.daysBeforetoday(7),
        category: ExpenseCategory.GROCERIES,
        userId: "1",
      }),
      Expense.with({
        id: "1",
        description: "Last Month",
        amount: 100,
        date: DateUtils.daysBeforetoday(30),
        category: ExpenseCategory.GROCERIES,
        userId: "1",
      }),
      Expense.with({
        id: "1",
        description: "Last 3 Months",
        amount: 100,
        date: DateUtils.daysBeforetoday(90),
        category: ExpenseCategory.GROCERIES,
        userId: "1",
      }),
    );
  }

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
