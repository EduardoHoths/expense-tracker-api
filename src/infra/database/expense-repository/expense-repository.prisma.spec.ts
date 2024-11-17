import { execSync } from "child_process";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { Expense } from "../../../domain/entities/expense/expense";
import { ExpenseCategory } from "../../../domain/entities/expense/expense-category";
import { ExpenseRepositoryPrisma } from "./expense-repository.prisma";
import { User } from "../../../domain/entities/user/user";

describe("ExpenseRepositoryPrisma", () => {
  let prismaClient: PrismaClient;
  let expenseRepository: ExpenseRepositoryPrisma;

  const TEST_USER = User.with({
    id: "1",
    name: "John Doe",
    email: "john.doe@gmail.com",
    password: "password",
  });

  const TEST_EXPENSE = Expense.create({
    userId: TEST_USER.id,
    description: "Test Expense",
    amount: 100,
    date: new Date("2000-01-01"),
    category: ExpenseCategory.CLOTHING,
  });

  beforeAll(() => {
    process.env.DATABASE_URL = "file:./test-expense.db";
    execSync("npx prisma migrate");
    prismaClient = new PrismaClient();
  });

  beforeEach(async () => {
    await prismaClient.user.deleteMany();
    await prismaClient.expense.deleteMany();

    await prismaClient.user.create({
      data: {
        id: TEST_USER.id,
        name: TEST_USER.name,
        email: TEST_USER.email,
        password: TEST_USER.password,
      },
    });

    expenseRepository = ExpenseRepositoryPrisma.create(prismaClient);
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
      await prismaClient.expense.create({
        data: {
          id: TEST_EXPENSE.id,
          user_id: TEST_EXPENSE.userId,
          description: TEST_EXPENSE.description,
          amount: TEST_EXPENSE.amount,
          date: TEST_EXPENSE.date,
          category: TEST_EXPENSE.category,
        },
      });

      const expenses = await expenseRepository.findExpensesByUserId(
        TEST_USER.id
      );

      console.log(expenses) 

      expect(expenses).toHaveLength(1);
      expect(expenses[0].userId).toBe(TEST_USER.id);
      expect(expenses[0].amount).toBe(100);
    });

    it("should throw an error if user is not found", async () => {
      await expect(
        expenseRepository.findExpensesByUserId("invalid-user")
      ).rejects.toThrowError("User not found");
    });

    it("should return an empty array if no expenses are found for the user", async () => {
      const expenses = await expenseRepository.findExpensesByUserId(
        TEST_USER.id
      );
      expect(expenses).toHaveLength(0);
    });
  });
});
