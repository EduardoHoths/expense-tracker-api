import HttpStatusCode from "../../infra/http/types/http-status-code";

export class TokenError extends Error {
  public statusCode: number;

  constructor() {
    super("Invalid token");
    this.statusCode = HttpStatusCode.UNAUTHORIZED;
    this.name = "InvalidTokenError";
    Error.captureStackTrace(this, this.constructor);
  }
}
