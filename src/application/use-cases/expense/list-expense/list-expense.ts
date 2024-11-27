import { Expense } from "../../../../domain/entities/expense/expense";
import { ExpenseRepository } from "../../../../domain/interfaces/expense-repository";
import { DateUtils } from "../../../../utils/date-utils";
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

    if (!filter) {
      return expenses;
    }

    switch (filter) {
      case Filter.LAST_WEEK:
        return expenses.filter((expense) => {
          const oneWeekAgo = DateUtils.daysBeforetoday(7);

          return expense.date >= oneWeekAgo;
        });

      case Filter.LAST_MONTH:
        return expenses.filter((expense) => {
          const oneMonthAgo = DateUtils.daysBeforetoday(30);

          return expense.date >= oneMonthAgo;
        });

      case Filter.LAST_3_MONTHS:
        return expenses.filter((expense) => {
          const threeMonthsAgo = DateUtils.daysBeforetoday(90);

          return expense.date >= threeMonthsAgo;
        });

      case Filter.CUSTOM:
        if (!startDate || !endDate) {
          throw new Error(
            "Start date and end date are required for custom filter"
          );
        }

        if (startDate > endDate) {
          throw new Error("Start date must be before end date");
        }

        return expenses.filter(
          (expense) => expense.date >= startDate && expense.date <= endDate
        );
    }
  }
}
