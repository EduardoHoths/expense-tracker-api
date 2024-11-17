import { Expense } from "../../../../domain/entities/expense/expense";
import { ExpenseCategory } from "../../../../domain/entities/expense/expense-category";
import { ExpenseRepository } from "../../../../domain/interfaces/expense-repository";
import { TokenGenerator } from "../../../../domain/interfaces/token-generator";
import { UserRepository } from "../../../../domain/interfaces/user-repository";
import { UseCase } from "../../../usecase";

interface CreateExpenseInputDTO {
  description: string;
  amount: number;
  date: Date;
  category: ExpenseCategory;
  accessToken: string;
}

type CreateExpenseOutputDTO = Expense;

export class CreateExpenseUseCase
  implements UseCase<CreateExpenseInputDTO, CreateExpenseOutputDTO>
{
  private constructor(
    private expenseRepository: ExpenseRepository,
    private userRepository: UserRepository,
    private tokenGenerator: TokenGenerator
  ) {}

  public static create(
    expenseRepository: ExpenseRepository,
    userRepository: UserRepository,
    tokenGenerator: TokenGenerator
  ) {
    return new CreateExpenseUseCase(
      expenseRepository,
      userRepository,
      tokenGenerator
    );
  }

  async execute({
    description,
    amount,
    date,
    category,
    accessToken,
  }: CreateExpenseInputDTO): Promise<Expense> {
    const { userId } = this.tokenGenerator.verify(accessToken) as {
      userId: string;
    };

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
