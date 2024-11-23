import { ZodSchema, ZodError } from "zod";
import { Validator } from "./validator";
import { ValidationError } from "../errors/validation-error";

export class ZodValidator<T> implements Validator<T> {
  constructor(private schema: ZodSchema<T>) {}

  validate(data: any): T {
    const result = this.schema.safeParse(data);

    if (!result.success) {
      throw new ValidationError(
        result.error.errors.map((error) => error.message)
      );
    }

    return result.data;
  }
}
