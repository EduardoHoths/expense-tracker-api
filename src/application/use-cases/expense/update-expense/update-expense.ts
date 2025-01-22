import { Expense } from "../../../../domain/entities/expense/expense";
import { ExpenseCategory } from "../../../../domain/entities/expense/expense-category";
import { ExpenseRepository } from "../../../../domain/interfaces/expense-repository";
import { UserRepository } from "../../../../domain/interfaces/user-repository";
import { UserNotFoundError } from "../../../errors/expense/user-not-found";
import { UseCase } from "../../../usecase";

interface UpdateExpenseInputDTO {
  description: string;
  amount: number;
  date: Date;
  category: ExpenseCategory;
  userId: string;
  expenseId: string;
}

type UpdateExpenseOutputDTO = Expense;

export class UpdateExpenseUseCase
  implements UseCase<UpdateExpenseInputDTO, UpdateExpenseOutputDTO>
{
  constructor(
    private expenseRepository: ExpenseRepository,
    private userRepository: UserRepository
  ) {}

  async execute({
    description,
    amount,
    date,
    category,
    userId,
    expenseId,
  }: UpdateExpenseInputDTO): Promise<Expense> {
    const user = await this.userRepository.findByUserId(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const expense = await this.expenseRepository.findExpenseById(expenseId);

    if (!expense) {
      throw new Error("Expense not found");
    }

    return await this.expenseRepository.updateExpense(expenseId, {
      description,
      amount,
      date,
      category,
    });
  }
}
