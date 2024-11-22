import HttpStatusCode from "../../../infra/http/types/http-status-code";
import { AppBaseError } from "../app-error-base";

export class UserNotFoundError extends AppBaseError {
  constructor() {
    super({
      message: "User not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      name: "UserNotFoundError",
    });
  }
}
