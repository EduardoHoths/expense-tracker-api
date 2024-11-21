import { ZodSchema, ZodError } from "zod";
import { Validator } from "./validator";

export class ZodValidator<T> implements Validator<T> {
  constructor(private schema: ZodSchema<T>) {}

  validate(data: any): T {
    const result = this.schema.safeParse(data);

    if (!result.success) {
      throw new ZodError(result.error.errors);
    }

    return result.data;
  }
}
