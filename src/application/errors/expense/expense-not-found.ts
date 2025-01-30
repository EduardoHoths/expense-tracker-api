import HttpStatusCode from "../../../infra/http/types/http-status-code";
import { AppBaseError } from "../app-error-base";

export class ExpenseNotFoundError extends AppBaseError {
  constructor() {
    super({
      message: "Expense not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      name: "ExpenseNotFoundError",
    });
  }
}
