import { CreateExpenseUseCase } from "../../../application/use-cases/expense/create-expense/create-expense";
import { ExpensePresenter } from "../../presenters/expense-presenter";
import { ExpenseCategory } from "../../../domain/entities/expense/expense-category";
import { HttpRequest } from "../../../shared/http/http-request";
import { HttpResponse } from "../../../shared/http/http-response";
import { Validator } from "../../../shared/validation/validator";
import { TokenService } from "../../../domain/interfaces/token-generator";
import HttpStatusCode from "../../../infra/http/types/http-status-code";

interface CreateExpenseDTO {
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
}

export class ExpenseController {
  constructor(
    private createExpenseUseCase: CreateExpenseUseCase,
    private createExpenseValidator: Validator<CreateExpenseDTO>,
    private tokenService: TokenService
  ) {}

  createExpense = async (req: HttpRequest): Promise<HttpResponse> => {
    try {
      const accessToken = req.headers?.authorization?.split(" ")[1];

      if (!accessToken) {
        return {
          statusCode: HttpStatusCode.UNAUTHORIZED,
          body: { message: "Unauthorized" },
        };
      }

      const { userId } = this.tokenService.verify(accessToken) as {
        userId: string;
      };

      const { description, amount, date, category } =
        this.createExpenseValidator.validate(req.body);

      const Expense = await this.createExpenseUseCase.execute({
        description,
        amount,
        date: new Date(date),
        category,
        userId,
      });

      const responseBody = ExpensePresenter.toJSON(Expense);

      return {
        statusCode: HttpStatusCode.CREATED,
        body: {
          message: "Expense created successfully",
          expense: responseBody,
        },
      };
    } catch (error: any) {
      return {
        statusCode: HttpStatusCode.BAD_REQUEST,
        body: { message: error.message },
      };
    }
  };
}
