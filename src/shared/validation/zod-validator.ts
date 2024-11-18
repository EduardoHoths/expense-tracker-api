import { ZodSchema } from "zod";
import { Validator } from "./validator";

export class ZodValidator<T> implements Validator<T> {
  constructor(private schema: ZodSchema<T>) {}

  validate(data: any): T {
    const result = this.schema.safeParse(data);

    if (!result.success) {
      throw new Error(result.error.errors.map((err) => err.message).join(", "));
    }

    return result.data;
  }
}
