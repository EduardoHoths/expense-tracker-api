import HttpStatusCode from "../../infra/http/types/http-status-code";

export interface HttpResponse {
  statusCode: HttpStatusCode;
  body: any;
  headers?: Record<string, any>;
}
