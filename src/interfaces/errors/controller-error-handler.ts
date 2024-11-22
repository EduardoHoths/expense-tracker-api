import { ZodError } from "zod";
import { HttpResponse } from "../../shared/http/http-response";
import HttpStatusCode from "../../infra/http/types/http-status-code";
import { AppBaseError } from "../../application/errors/app-error-base";

export class ControllerErrorHandler {
  static handle(error: any): HttpResponse {
    if (error instanceof ZodError) {
      return {
        statusCode: HttpStatusCode.BAD_REQUEST,
        body: {
          message: error.errors.map((err) => err.message).join(", "),
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
