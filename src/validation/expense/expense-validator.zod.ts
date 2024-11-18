import { z } from "zod";
import { ZodValidator } from "../../shared/validation/zod-validator";
import { ExpenseCategory } from "../../domain/entities/expense/expense-category";

const createExpenseSchema = z.object({
  description: z.string({ message: "Description is required" }),

  amount: z
    .number({ message: "Amount is required" })
    .positive({ message: "Amount must be a positive number" }),

  date: z.string({ message: "Date is required" }),

  category: z.nativeEnum(ExpenseCategory, {
    message: "Invalid category. Must be one of the predefined categories.",
  }),
});
export const createExpenseValidator = new ZodValidator(createExpenseSchema);
