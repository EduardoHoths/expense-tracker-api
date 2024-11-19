import { z } from "zod";
import { ZodValidator } from "../../shared/validation/zod-validator";
import { ExpenseCategory } from "../../domain/entities/expense/expense-category";

const createExpenseSchema = z.object({
  description: z
    .string({ message: "Description is required" })
    .transform((description) => description.trim()),

  amount: z
    .number({ message: "Amount is required" })
    .positive({ message: "Amount must be a positive number" }),

  date: z.string({ message: "Date is required" }).transform((date) => {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format");
    }

    return date;
  }),

  category: z.nativeEnum(ExpenseCategory, {
    message:
      "Invalid category. Must be one of: Groceries, Leisure, Electronics, Utilities, Clothing, Health, Other",
  }),
});

export const createExpenseValidator = new ZodValidator(createExpenseSchema);
