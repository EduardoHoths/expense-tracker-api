import { CreateExpenseUseCase } from "../../../application/use-cases/expense/create-expense/create-expense";
import { ExpensePresenter } from "../../presenters/expense-presenter";
import { ExpenseCategory } from "../../../domain/entities/expense/expense-category";
import { HttpRequest } from "../../../shared/http/http-request";
import { HttpResponse } from "../../../shared/http/http-response";
import { Validator } from "../../../shared/validation/validator";

interface CreateExpenseDTO {
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
}

export class ExpenseController {
  constructor(
    private createExpenseUseCase: CreateExpenseUseCase,
    private createExpenseValidator: Validator<CreateExpenseDTO>
  ) {}

  createExpense = async (req: HttpRequest): Promise<HttpResponse> => {
    try {
      const accessToken = req.headers?.authorization?.split(" ")[1];

      if (!accessToken) {
        return {
          statusCode: 401,
          body: { message: "Unauthorized" },
        };
      }

      const { description, amount, date, category } = this.createExpenseValidator.validate(
        req.body
      );

      const Expense = await this.createExpenseUseCase.execute({
        description,
        amount,
        date: new Date(date),
        category,
        accessToken: accessToken,
      });

      const responseBody = ExpensePresenter.toJSON(Expense);

      return {
        statusCode: 201,
        body: {
          message: "Expense created successfully",
          expense: responseBody,
        },
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        body: { message: error.message },
      };
    }
  };
}
