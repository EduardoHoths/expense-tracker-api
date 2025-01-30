import { ExpenseRepository } from "../../../../domain/interfaces/expense-repository";
import { UserRepository } from "../../../../domain/interfaces/user-repository";
import { AppBaseError } from "../../../errors/app-error-base";
import { ExpenseNotFoundError } from "../../../errors/expense/expense-not-found";
import { UserNotFoundError } from "../../../errors/user/user-not-found";
import { UseCase } from "../../../usecase";

type DeleteExpenseInputDTO = {
  id: string;
  userId: string;
};

type DeleteExpenseOutputDTO = void;

export class DeleteExpenseUseCase
  implements UseCase<DeleteExpenseInputDTO, DeleteExpenseOutputDTO>
{
  constructor(
    private expenseRepository: ExpenseRepository,
    private userRepository: UserRepository
  ) {}

  async execute({ id, userId }: DeleteExpenseInputDTO): Promise<void> {
    const user = await this.userRepository.findByUserId(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const expense = await this.expenseRepository.findExpenseById(id);

    if (!expense) {
      throw new ExpenseNotFoundError();
    }

    if (expense?.userId != userId) {
      throw new AppBaseError({
        message: "Expense does not belong to user",
        statusCode: 403,
        name: "Forbidden",
      });
    }

    await this.expenseRepository.deleteExpenseById(id);
  }
}
