import HttpStatusCode from "../../../infra/http/types/http-status-code";
import { AppBaseError } from "../app-error-base";

export class InvalidCredentialsError extends AppBaseError {
  constructor() {
    super({
      message: "Invalid credentials",
      statusCode: HttpStatusCode.UNAUTHORIZED,
      name: "InvalidCredentialsError",
    });
  }
}
