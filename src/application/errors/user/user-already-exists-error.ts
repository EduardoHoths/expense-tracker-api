import HttpStatusCode from "../../../infra/http/types/http-status-code";
import { AppBaseError } from "../app-error-base";

export class UserAlreadyExistsError extends AppBaseError {
  constructor() {
    super({
      message: "User already exists",
      statusCode: HttpStatusCode.CONFLICT,
      name: "UserAlreadyExistsError",
    });
  }
}
