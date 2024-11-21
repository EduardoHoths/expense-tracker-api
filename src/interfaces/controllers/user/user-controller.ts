import { CreateUserUseCase } from "../../../application/use-cases/user/create-user/create-user";
import { UserPresenter } from "../../presenters/user-presenter";
import { Validator } from "../../../shared/validation/validator";
import { HttpRequest } from "../../../shared/http/http-request";
import { HttpResponse } from "../../../shared/http/http-response";
import HttpStatusCode from "../../../infra/http/types/http-status-code";
import { AppBaseError } from "../../../application/errors/app-error-base";
import z from "zod";

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

  public createUser = async (req: HttpRequest): Promise<HttpResponse> => {
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
        statusCode: HttpStatusCode.CREATED,
        body: {
          message: "User created successfully",
          user: responseBody,
        },
      };
    } catch (error: any) {
      if (error instanceof AppBaseError) {
        return {
          statusCode: error.statusCode,
          body: {
            message: error.message,
          },
        };
      }
      console.log(error.constructor.name)
      
      if (error instanceof z.ZodError){
        return {
          statusCode: HttpStatusCode.BAD_REQUEST,
          body: {
            message: error.errors.map((err) => err.message).join(", ")
          },
        };
      }

      console.log(error);
      return {
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        body: {
          message: "Internal Server Error",
        },
      };
    }
  };
}
