import { CreateUserUseCase } from "../../../application/use-cases/user/create-user/create-user";
import { UserPresenter } from "../../presenters/user-presenter";
import { Validator } from "../../../shared/validation/validator";
import { HttpRequest } from "../../../shared/http/http-request";
import { HttpResponse } from "../../../shared/http/http-response";

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private createUserValidator: Validator<CreateUserDTO>
  ) {}

  createUser = async (req: HttpRequest): Promise<HttpResponse> => {
    try {
      const { email, name, password } = this.createUserValidator.validate(
        req.body
      );

      const user = await this.createUserUseCase.execute({
        email,
        name,
        password,
      });

      const responseBody = UserPresenter.toJSON(user);

      return {
        statusCode: 201,
        body: {
          message: "User created successfully",
          user: responseBody,
        },
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        body: {
          message: error.message,
        },
      };
    }
  };
}
