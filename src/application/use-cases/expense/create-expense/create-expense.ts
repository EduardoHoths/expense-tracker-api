import { Expense } from "../../../../domain/entities/expense/expense";
import { ExpenseCategory } from "../../../../domain/entities/expense/expense-category";
import { ExpenseRepository } from "../../../../domain/interfaces/expense-repository";
import { UserRepository } from "../../../../domain/interfaces/user-repository";
import { UseCase } from "../../../usecase";

interface CreateExpenseInputDto {
  description: string;
  amount: number;
  date: Date;
  category: ExpenseCategory;
  userId: string;
}

type CreateExpenseOutputDto = Expense;

export class CreateExpenseUseCase
  implements UseCase<CreateExpenseInputDto, CreateExpenseOutputDto>
{
  constructor(
    private expenseRepository: ExpenseRepository,
    private userRepository: UserRepository
  ) {}

  public static create(
    expenseRepository: ExpenseRepository,
    userRepository: UserRepository
  ) {
    return new CreateExpenseUseCase(expenseRepository, userRepository);
  }

  async execute({
    description,
    amount,
    date,
    category,
    userId,
  }: CreateExpenseInputDto): Promise<Expense> {
    const user = await this.userRepository.findByUserId(userId);

    if (!user) {
      throw new Error("User not found");
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
