import HttpStatusCode from "../../infra/http/types/http-status-code";
import { AppError } from "./app-error-interface";

export class AppBaseError extends Error implements AppError {
  public statusCode: HttpStatusCode;

  constructor({ message, name, statusCode }: AppError) {
    super(message);

    this.statusCode = statusCode;
    this.name = name || "ApplicationError";
    Error.captureStackTrace(this, this.constructor);
  }
}
