import { Expense } from "../../../../domain/entities/expense/expense";
import { ExpenseCategory } from "../../../../domain/entities/expense/expense-category";
import { ExpenseRepository } from "../../../../domain/interfaces/expense-repository";
import { UserRepository } from "../../../../domain/interfaces/user-repository";
import { UserNotFoundError } from "../../../errors/expense/user-not-found";
import { UseCase } from "../../../usecase";

interface CreateExpenseInputDTO {
  description: string;
  amount: number;
  date: Date;
  category: ExpenseCategory;
  userId: string;
}

type CreateExpenseOutputDTO = Expense;

export class CreateExpenseUseCase
  implements UseCase<CreateExpenseInputDTO, CreateExpenseOutputDTO>
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
  }: CreateExpenseInputDTO): Promise<Expense> {
    const user = await this.userRepository.findByUserId(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const expense = Expense.create({
      description,
      amount,
      date,
      category,
      userId,
    });

    return await this.expenseRepository.save(expense);
  }
}
