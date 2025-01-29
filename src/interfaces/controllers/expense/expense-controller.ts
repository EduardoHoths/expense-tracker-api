import { CreateExpenseUseCase } from "../../../application/use-cases/expense/create-expense/create-expense";
import { ExpensePresenter } from "../../presenters/expense-presenter";
import { ExpenseCategory } from "../../../domain/entities/expense/expense-category";
import { HttpRequest } from "../../../shared/http/http-request";
import { HttpResponse } from "../../../shared/http/http-response";
import { Validator } from "../../../shared/validation/validator";
import HttpStatusCode from "../../../infra/http/types/http-status-code";
import { ControllerErrorHandler } from "../../errors/controller-error-handler";
import {
  Filter,
  ListExpensesUseCase,
} from "../../../application/use-cases/expense/list-expense/list-expense";
import { UpdateExpenseUseCase } from "../../../application/use-cases/expense/update-expense/update-expense";

interface CreateExpenseDTO {
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
}

interface UpdateExpenseDTO {
  description?: string;
  amount?: number;
  date?: string;
  category?: ExpenseCategory;
}

interface ListExpenseDTO {
  filter?: string;
  startDate?: string;
  endDate?: string;
}

export class ExpenseController {
  constructor(
    private createExpenseUseCase: CreateExpenseUseCase,
    private createExpenseValidator: Validator<CreateExpenseDTO>,
    private listExpenseUseCase: ListExpensesUseCase,
    private listExpenseValidator: Validator<ListExpenseDTO>,
    private updateExpenseUseCase: UpdateExpenseUseCase,
    private updateExpenseValidator: Validator<UpdateExpenseDTO>
  ) {}

  createExpense = async (req: HttpRequest): Promise<HttpResponse> => {
    try {
      const userId = req.user!.id;

      const { description, amount, date, category } =
        this.createExpenseValidator.validate(req.body);

      const expense = await this.createExpenseUseCase.execute({
        description,
        amount,
        date: new Date(date),
        category,
        userId,
      });

      const responseBody = ExpensePresenter.toJSON(expense);

      return {
        statusCode: HttpStatusCode.CREATED,
        body: {
          message: "Expense created successfully",
          expense: responseBody,
        },
      };
    } catch (error: any) {
      return ControllerErrorHandler.handle(error);
    }
  };

  listExpense = async (req: HttpRequest): Promise<HttpResponse> => {
    try {
      const userId = req.user!.id;

      const { filter, startDate, endDate } = this.listExpenseValidator.validate(
        req.query
      ) as {
        filter?: Filter;
        startDate?: string;
        endDate?: string;
      };

      const expenses = await this.listExpenseUseCase.execute({
        userId,
        filter,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      });

      const responseBody = expenses.map((expense) =>
        ExpensePresenter.toJSON(expense)
      );

      return {
        statusCode: HttpStatusCode.OK,
        body: responseBody,
      };
    } catch (error) {
      return ControllerErrorHandler.handle(error);
    }
  };

  updateExpense = async (req: HttpRequest): Promise<HttpResponse> => {
    try {
      const userId = req.user!.id;

      const { id } = req.params as { id: string };

      const { description, amount, date, category } =
        this.updateExpenseValidator.validate(req.body);

      const isNewDate = date && new Date(date);

      const expense = await this.updateExpenseUseCase.execute({
        description,
        amount,
        date: isNewDate ? isNewDate : undefined,
        category,
        userId,
        expenseId: id,
      });

      const responseBody = ExpensePresenter.toJSON(expense);

      return {
        statusCode: HttpStatusCode.OK,
        body: {
          message: "Expense updated successfully",
          expense: responseBody,
        },
      };
    } catch (error) {
      return ControllerErrorHandler.handle(error);
    }
  };
}
