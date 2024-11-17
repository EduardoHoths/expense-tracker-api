import { Request, Response } from "express";
import { AuthenticateUserUseCase } from "../../../application/use-cases/authenticate-user/authenticate-user";
import { z } from "zod";

export class AuthController {
  constructor(private authenticateUserUseCase: AuthenticateUserUseCase) {}

  public static create(authenticateUserUseCase: AuthenticateUserUseCase) {
    return new AuthController(authenticateUserUseCase);
  }

  private loginSchema = z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = this.loginSchema.parse(req.body);

      const result = await this.authenticateUserUseCase.execute({
        email,
        password,
      });

      res.json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: error.errors.map((err) => err.message) });
        return;
      }

      res.status(401).json({ message: error.message });
    }
  };
}
