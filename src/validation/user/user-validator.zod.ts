import { z } from "zod";
import { ZodValidator } from "../../shared/validation/zod-validator";

const createUserSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
});

export const createUserValidator = new ZodValidator(createUserSchema);
