import { z } from "zod";
import { ZodValidator } from "../../shared/validation/zod-validator";
import { ExpenseCategory } from "../../domain/entities/expense/expense-category";
import { Filter } from "../../application/use-cases/expense/list-expense/list-expense";

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

const listExpenseSchema = z.object({
  filter: z
    .nativeEnum(Filter, {
      message:
        "Invalid filter. Must be one of: lastWeek, lastMonth, last3Months, custom",
    })
    .optional(),

  startDate: z
    .string()
    .transform((date) => {
      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }

      return date;
    })
    .optional(),

  endDate: z
    .string()
    .transform((date) => {
      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }

      return date;
    })
    .optional(),
});

export const createExpenseValidator = new ZodValidator(createExpenseSchema);
export const listExpenseValidator = new ZodValidator(listExpenseSchema);
