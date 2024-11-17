export interface HttpRequest {
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  query?: Record<string, string>;
}