import { Expense } from "../../../../domain/entities/expense/expense";
import { ExpenseRepository } from "../../../../domain/interfaces/expense-repository";
import { UseCase } from "../../../usecase";

export enum Filter {
  LAST_WEEK = "lastWeek",
  LAST_MONTH = "lastMonth",
  LAST_3_MONTHS = "last3Months",
  CUSTOM = "custom",
}

interface ListExpenseInputDTO {
  userId: string;
  filter?: Filter;
  startDate?: Date;
  endDate?: Date;
}

type ListExpenseOutputDTO = Expense[] | [];

export class ListExpensesUseCase
  implements UseCase<ListExpenseInputDTO, ListExpenseOutputDTO>
{
  constructor(private expenseRepository: ExpenseRepository) {}

  async execute({
    userId,
    filter,
    endDate,
    startDate,
  }: ListExpenseInputDTO): Promise<ListExpenseOutputDTO> {
    const expenses = await this.expenseRepository.findExpensesByUserId(userId);

    const now = new Date();

    if (!filter) {
      return expenses;
    }

    switch (filter) {
      case Filter.LAST_WEEK:
        return expenses.filter((expense) => {
          const oneWeekAgo = new Date(now);
          oneWeekAgo.setDate(now.getDate() - 7);
          return expense.date >= oneWeekAgo;
        });

      case Filter.LAST_MONTH:
        return expenses.filter((expense) => {
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(now.getMonth() - 1);
          return expense.date >= oneMonthAgo;
        });

      case Filter.LAST_3_MONTHS:
        return expenses.filter((expense) => {
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return expense.date >= threeMonthsAgo;
        });

      case Filter.CUSTOM:
        return expenses.filter(
          (expense) => expense.date >= startDate! && expense.date <= endDate!
        );
    }
  }
}
