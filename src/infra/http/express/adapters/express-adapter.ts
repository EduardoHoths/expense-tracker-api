import { Request, Response } from "express";
import { HttpRequest } from "../../../../shared/http/http-request";
import { HttpResponse } from "../../../../shared/http/http-response";

export const expressAdapter = (
  controller: (req: HttpRequest) => Promise<HttpResponse>
) => {
  return async (req: Request, res: Response) => {
    try {
      const httpRequest: HttpRequest = {
        body: req.body,
        headers: { ...req.headers },
        params: { ...req.params },
        query: { ...req.query },
        cookies: req.cookies ? { ...req.cookies } : undefined,
        method: req.method,
        url: req.url,
        user: req.user,
      };

      const result = await controller(httpRequest);

      res.status(result.statusCode).json(result.body);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  };
};
