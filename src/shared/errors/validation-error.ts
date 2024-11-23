import HttpStatusCode from "../../infra/http/types/http-status-code";

export class ValidationError extends Error {
  public statusCode: number;
  public errors: string[];

  constructor(errors: string[]) {
    super("Invalid fields");

    this.statusCode = HttpStatusCode.BAD_REQUEST;
    this.name = "ValidationError";
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
