import { HttpResponse } from "../../../shared/http/http-response";
import { HttpRequest } from "../../../shared/http/http-request";
import { Validator } from "../../../shared/validation/validator";
import { AuthenticateUserUseCase } from "../../../application/use-cases/auth/authenticate-user";
import HttpStatusCode from "../../../infra/http/types/http-status-code";

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
        statusCode: HttpStatusCode.OK,
        body: {
          accessToken: result.accessToken,
        },
      };
    } catch (error: any) {
      return {
        statusCode: HttpStatusCode.BAD_REQUEST,
        body: { message: error.message },
      };
    }
  };
}
