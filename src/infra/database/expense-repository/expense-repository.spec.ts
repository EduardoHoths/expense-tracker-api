import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { Expense } from "../../../domain/entities/expense/expense";
import { ExpenseCategory } from "../../../domain/entities/expense/expense-category";
import { User } from "../../../domain/entities/user/user";
import { ExpenseRepositoryMemory } from "./expense-repository.memory";
import { ExpenseRepository } from "../../../domain/interfaces/expense-repository";
import { UserRepositoryMemory } from "../user-repository/user-repository.memory";

describe("ExpenseRepositoryPrisma", () => {
  let expenseRepository: ExpenseRepository;
  const userRepository = new UserRepositoryMemory();

  const TEST_USER = User.with({
    id: "2",
    name: "test",
    email: "test@test.com",
    password: "password",
  });

  const TEST_EXPENSE = Expense.create({
    userId: TEST_USER.id,
    description: "Test Expense",
    amount: 100,
    date: new Date("2000-01-01"),
    category: ExpenseCategory.CLOTHING,
  });

  beforeEach(() => {
    expenseRepository = new ExpenseRepositoryMemory();
  });

  describe("save", () => {
    it("should save an expense and return the saved expense", async () => {
      const result = await expenseRepository.save(TEST_EXPENSE);

      expect(result).toBeInstanceOf(Expense);
      expect(result.id).toBe(TEST_EXPENSE.id);
      expect(result.userId).toBe(TEST_EXPENSE.userId);
      expect(result.description).toBe(TEST_EXPENSE.description);
      expect(result.amount).toBe(TEST_EXPENSE.amount);
      expect(result.category).toBe(TEST_EXPENSE.category);
    });
  });

  describe("findExpensesByUserId", () => {
    it("should return a list of expenses for a valid user", async () => {
      await userRepository.save(TEST_USER);

      await expenseRepository.save(TEST_EXPENSE);

      const expenses = await expenseRepository.findExpensesByUserId(
        TEST_USER.id
      );

      expect(expenses).toHaveLength(1);
      expect(expenses[0].userId).toBe(TEST_USER.id);
      expect(expenses[0].amount).toBe(100);
    });

    it("should return an empty array if no expenses are found for the user", async () => {
      const expenses = await expenseRepository.findExpensesByUserId(
        TEST_USER.id
      );
      expect(expenses).toHaveLength(0);
    });
  });
});
