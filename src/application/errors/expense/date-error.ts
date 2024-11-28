import HttpStatusCode from "../../../infra/http/types/http-status-code";
import { AppBaseError } from "../app-error-base";

export class FilterDateError extends AppBaseError {
  constructor(message: string) {
    super({
      message,
      statusCode: HttpStatusCode.BAD_REQUEST,
      name: "FilterDateError",
    });
  }
}
