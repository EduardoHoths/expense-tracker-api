import { describe, it, expect, vi } from "vitest";
import { Expense } from "./expense";
import { ExpenseCategory } from "./expense-category";

// Mock para a função uuid
vi.mock("uuid", () => ({
  v4: () => "mocked-uuid",
}));

describe("Expense", () => {
  it("should create a new expense succefully", () => {
    const amount = 100;
    const description = "Supermarket purchase";
    const category = ExpenseCategory.GROCERIES;
    const date = new Date("2024-11-15");
    const userId = "user-123";

    const expense = Expense.create({
      amount,
      description,
      category,
      date,
      userId,
    });

    expect(expense.id).toBe("mocked-uuid");
    expect(expense.amount).toBe(amount);
    expect(expense.description).toBe(description);
    expect(expense.category).toBe(ExpenseCategory.GROCERIES);
    expect(expense.date).toEqual(date);
    expect(expense.userId).toBe(userId);
  });

  it("should throw an error if amount is invalid", () => {
    const amount = -100;
    const description = "Supermarket purchase";
    const category = ExpenseCategory.GROCERIES;
    const date = new Date("2024-11-15");
    const userId = "user-123";

    expect(() =>
      Expense.create({
        amount,
        description,
        category,
        date,
        userId,
      })
    ).toThrow("Invalid amount");
  });

  it("should throw an error if date is invalid", () => {
    const amount = 100;
    const description = "Supermarket purchase";
    const category = ExpenseCategory.GROCERIES;
    const date = new Date("2030-11-15");
    const userId = "user-123";

    expect(() =>
      Expense.create({
        amount,
        description,
        category,
        date,
        userId,
      })
    ).toThrow("Invalid date");
  });

  it("should throw an error if category is invalid", () => {
    const amount = 100;
    const description = "Supermarket purchase";
    const category = "invalid-category" as ExpenseCategory;
    const date = new Date("2024-11-15");
    const userId = "user-123";

    expect(() =>
      Expense.create({
        amount,
        description,
        category,
        date,
        userId,
      })
    ).toThrow("Invalid category");
  });
});
