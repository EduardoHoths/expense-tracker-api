import { HttpResponse } from "../../../shared/http/http-response";
import { HttpRequest } from "../../../shared/http/http-request";
import { Validator } from "../../../shared/validation/validator";
import { AuthenticateUserUseCase } from "../../../application/use-cases/auth/authenticate-user";

interface AuthDTO {
  email: string;
  password: string;
}

export class AuthController {
  constructor(
    private authenticateUserUseCase: AuthenticateUserUseCase,
    private authValidator: Validator<AuthDTO>
  ) {}

  auth = async (req: HttpRequest): Promise<HttpResponse> => {
    try {
      const { email, password } = this.authValidator.validate(req.body);

      const result = await this.authenticateUserUseCase.execute({
        email,
        password,
      });

      return {
        statusCode: 200,
        body: {
          accessToken: result.accessToken,
        },
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        body: { message: error.message },
      };
    }
  };
}
