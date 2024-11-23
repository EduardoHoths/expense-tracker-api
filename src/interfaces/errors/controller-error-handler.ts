import HttpStatusCode from "../../infra/http/types/http-status-code";
import { HttpResponse } from "../../shared/http/http-response";
import { AppBaseError } from "../../application/errors/app-error-base";
import { TokenError } from "../../shared/errors/token-error";
import { ValidationError } from "../../shared/errors/validation-error";

export class ControllerErrorHandler {
  static handle(error: any): HttpResponse {
    if (error instanceof TokenError) {
      return {
        statusCode: HttpStatusCode.UNAUTHORIZED,
        body: { message: error.message },
      };
    }

    if (error instanceof ValidationError) {
      return {
        statusCode: HttpStatusCode.BAD_REQUEST,
        body: {
          message: error.message,
          errors: error.errors,
        },
      };
    }

    if (error instanceof AppBaseError) {
      return {
        statusCode: error.statusCode,
        body: { message: error.message },
      };
    }

    console.error(error);
    return {
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      body: { message: "Internal server error" },
    };
  }
}
