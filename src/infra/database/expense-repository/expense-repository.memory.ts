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
      })
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

  async findExpenseById(expenseId: string): Promise<Expense | null> {
    return this.expenses.find((expense) => expense.id === expenseId) || null;
  }

  async updateExpense(
    expenseId: string,
    fieldsToUpdate: Partial<Expense>
  ): Promise<Expense> {
    const index = this.expenses.findIndex(
      (expense) => expense.id === expenseId
    );

    const expenseToUpdate = this.expenses[index];

    const updatedExpense = {
      id: expenseToUpdate.id,
      userId: expenseToUpdate.userId,
      date: fieldsToUpdate.date ?? expenseToUpdate.date,
      amount: fieldsToUpdate.amount ?? expenseToUpdate.amount,
      description: fieldsToUpdate.description ?? expenseToUpdate.description,
      category: fieldsToUpdate.category ?? expenseToUpdate.category,
    };

    const validatedExpense = Expense.with(updatedExpense);

    this.expenses[index] = validatedExpense;

    return validatedExpense;
  }
}
