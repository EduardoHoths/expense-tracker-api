export interface HttpResponse {
  statusCode: number;
  body: any;
  headers?: Record<string, any>;
}
