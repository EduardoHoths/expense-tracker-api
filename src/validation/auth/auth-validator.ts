import { z } from "zod";
import { ZodValidator } from "../../shared/validation/zod-validator";

const authSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .transform((email) => email.toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const authValidator = new ZodValidator(authSchema);
