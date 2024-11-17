import { Expense } from "../../domain/entities/expense/expense";

export class ExpensePresenter {
  public static present(expense: Expense) {
    return {
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      userId: expense.userId,
    };
  }
}
