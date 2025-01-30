import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserRepository } from "../../../../domain/interfaces/user-repository";
import { ExpenseRepository } from "../../../../domain/interfaces/expense-repository";
import { User } from "../../../../domain/entities/user/user";
import { ExpenseCategory } from "../../../../domain/entities/expense/expense-category";
import { Expense } from "../../../../domain/entities/expense/expense";
import { UpdateExpenseUseCase } from "./update-expense";

describe("UpdateExpenseUseCase", () => {
  const mockUserRepository: UserRepository = {
    findByUserId: vi.fn(),
    findByEmail: vi.fn(),
    save: vi.fn(),
  };

  const mockExpenseRepository: ExpenseRepository = {
    save: vi.fn(),
    findExpensesByUserId: vi.fn(),
    findExpenseById: vi.fn(),
    updateExpense: vi.fn(),
    deleteExpenseById: vi.fn(),
  };

  let updateExpenseUseCase: UpdateExpenseUseCase;

  const TEST_USER = User.with({
    id: "1",
    name: "test",
    email: "test@test.com",
    password: "password",
  });

  const TEST_EXPENSE_DATA = {
    description: "Expense 01",
    amount: 100,
    date: new Date("2020-01-01"),
    category: ExpenseCategory.GROCERIES,
    userId: "1",
    id: "1",
  };

  beforeEach(() => {
    vi.resetAllMocks();

    updateExpenseUseCase = new UpdateExpenseUseCase(
      mockExpenseRepository,
      mockUserRepository
    );
  });

  it("should update an expense successfully", async () => {
    vi.mocked(mockUserRepository.findByUserId).mockResolvedValue(TEST_USER);
    vi.mocked(mockExpenseRepository.findExpenseById).mockResolvedValue(
      Expense.with(TEST_EXPENSE_DATA)
    );
    vi.mocked(mockExpenseRepository.updateExpense).mockResolvedValue(
      Expense.with({
        ...TEST_EXPENSE_DATA,
        description: "Updated Expense",
      })
    );

    const expense = await updateExpenseUseCase.execute({
      expenseId: "1",
      userId: "1",
      description: "Updated Expense",
    });

    expect(expense).toEqual(
      Expense.with({
        ...TEST_EXPENSE_DATA,
        description: "Updated Expense",
      })
    );
  });

  it("should throw an error if user is not found", async () => {
    vi.mocked(mockUserRepository.findByUserId).mockResolvedValue(null);

    await expect(
      updateExpenseUseCase.execute({
        expenseId: "1",
        userId: "1",
        description: "Updated Expense",
      })
    ).rejects.toThrow("User not found");
  });

  it("should throw an error if expense is not found", async () => {
    vi.mocked(mockUserRepository.findByUserId).mockResolvedValue(TEST_USER);
    vi.mocked(mockExpenseRepository.findExpenseById).mockResolvedValue(null);

    await expect(
      updateExpenseUseCase.execute({
        expenseId: "1",
        userId: "1",
        description: "Updated Expense",
      })
    ).rejects.toThrow("Expense not found");
  });

  it("should throw an error if expense does not belong to user", async () => {
    vi.mocked(mockUserRepository.findByUserId).mockResolvedValue(TEST_USER);
    vi.mocked(mockExpenseRepository.findExpenseById).mockResolvedValue(
      Expense.with({
        ...TEST_EXPENSE_DATA,
        userId: "2",
      })
    );

    await expect(
      updateExpenseUseCase.execute({
        expenseId: "1",
        userId: "1",
        description: "Updated Expense",
      })
    ).rejects.toThrow("Expense does not belong to user");
  });

  it("should update expense amount", async () => {
    vi.mocked(mockUserRepository.findByUserId).mockResolvedValue(TEST_USER);
    vi.mocked(mockExpenseRepository.findExpenseById).mockResolvedValue(
      Expense.with(TEST_EXPENSE_DATA)
    );
    vi.mocked(mockExpenseRepository.updateExpense).mockResolvedValue(
      Expense.with({
        ...TEST_EXPENSE_DATA,
        amount: 200,
      })
    );

    const expense = await updateExpenseUseCase.execute({
      expenseId: "1",
      userId: "1",
      amount: 200,
    });

    expect(expense.amount).toBe(200);
  });

  it("should update expense category", async () => {
    vi.mocked(mockUserRepository.findByUserId).mockResolvedValue(TEST_USER);
    vi.mocked(mockExpenseRepository.findExpenseById).mockResolvedValue(
      Expense.with(TEST_EXPENSE_DATA)
    );
    vi.mocked(mockExpenseRepository.updateExpense).mockResolvedValue(
      Expense.with({
        ...TEST_EXPENSE_DATA,
        category: ExpenseCategory.ELECTRONICS,
      })
    );

    const expense = await updateExpenseUseCase.execute({
      expenseId: "1",
      userId: "1",
      category: ExpenseCategory.ELECTRONICS,
    });

    expect(expense.category).toBe(ExpenseCategory.ELECTRONICS);
  });

  it("should update expense date", async () => {
    const newDate = new Date("2021-01-01");
    vi.mocked(mockUserRepository.findByUserId).mockResolvedValue(TEST_USER);
    vi.mocked(mockExpenseRepository.findExpenseById).mockResolvedValue(
      Expense.with(TEST_EXPENSE_DATA)
    );
    vi.mocked(mockExpenseRepository.updateExpense).mockResolvedValue(
      Expense.with({
        ...TEST_EXPENSE_DATA,
        date: newDate,
      })
    );

    const expense = await updateExpenseUseCase.execute({
      expenseId: "1",
      userId: "1",
      date: newDate,
    });

    expect(expense.date).toEqual(newDate);
  });
});