export interface HttpRequest {
  body?: any;
  headers?: Record<string, any>;
  params?: Record<string, any>;
  query?: Record<string, any>;
  cookies?: Record<string, any>;
  files?: Record<string, any>;
  method?: string;
  url?: string;
}
