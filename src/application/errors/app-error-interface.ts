import HttpStatusCode from "../../infra/http/types/http-status-code";

export interface AppError {
  message: string;
  statusCode: HttpStatusCode;
  name: string;
}
