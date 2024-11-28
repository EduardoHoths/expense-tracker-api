import { NextFunction, Request, Response } from "express";
import HttpStatusCode from "../../types/http-status-code";
import { JwtService } from "../../../services/jwt-service";
import { ControllerErrorHandler } from "../../../../interfaces/errors/controller-error-handler";

export class AuthMiddleware {
  public execute(req: Request, res: Response, next: NextFunction) {
    req.query


    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: "Token not provided",
      });
      return;
    }

    const [, token] = authHeader.split(" ");

    try {
      const jwtService = new JwtService();
      const decoded = jwtService.verify(token) as {
        userId: string;
        email: string;
      };

      req.user = {
        id: decoded.userId,
        email: decoded.email,
      };

      next();
    } catch (error) {
      const { body, statusCode } = ControllerErrorHandler.handle(error);

      res.status(statusCode).json(body);
    }
  }
}
