import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserRepository } from "../../../../domain/interfaces/user-repository";
import { ExpenseRepository } from "../../../../domain/interfaces/expense-repository";
import { User } from "../../../../domain/entities/user/user";
import { DeleteExpenseUseCase } from "./delete-expense";
import { ExpenseCategory } from "../../../../domain/entities/expense/expense-category";
import { Expense } from "../../../../domain/entities/expense/expense";

describe("DeleteExpenseUseCase", () => {
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

  let deleteExpenseUseCase: DeleteExpenseUseCase;

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

    deleteExpenseUseCase = new DeleteExpenseUseCase(
      mockExpenseRepository,
      mockUserRepository
    );
  });

  it("should delete an expense successfully", async () => {
    vi.mocked(mockUserRepository.findByUserId).mockResolvedValue(TEST_USER);
    vi.mocked(mockExpenseRepository.findExpenseById).mockResolvedValue(
      Expense.with(TEST_EXPENSE_DATA)
    );
    vi.mocked(mockExpenseRepository.deleteExpenseById).mockResolvedValue();

    await deleteExpenseUseCase.execute({
      id: "1",
      userId: "1",
    });

    expect(mockUserRepository.findByUserId).toHaveBeenCalledWith("1");
    expect(mockExpenseRepository.findExpenseById).toHaveBeenCalledWith("1");
    expect(mockExpenseRepository.deleteExpenseById).toHaveBeenCalledWith("1");
  });

  it("should throw an error if user is not found", async () => {
    vi.mocked(mockUserRepository.findByUserId).mockResolvedValue(null);

    await expect(
      deleteExpenseUseCase.execute({
        id: "1",
        userId: "1",
      })
    ).rejects.toThrow("User not found");
  });

  it("should throw an error if expense is not found", async () => {
    vi.mocked(mockUserRepository.findByUserId).mockResolvedValue(TEST_USER);
    vi.mocked(mockExpenseRepository.findExpenseById).mockResolvedValue(null);

    await expect(
      deleteExpenseUseCase.execute({
        id: "1",
        userId: "1",
      })
    ).rejects.toThrow("Expense not found");
  });

  it("should throw an error if expense does not belong to user", async () => {
    const OTHER_USER = User.with({
      id: "2",
      name: "test",
      email: "test@test.com",
      password: "password",
    });

    vi.mocked(mockUserRepository.findByUserId).mockResolvedValue(OTHER_USER);
    vi.mocked(mockExpenseRepository.findExpenseById).mockResolvedValue(
      Expense.with(TEST_EXPENSE_DATA)
    );

    await expect(
      deleteExpenseUseCase.execute({
        id: "1",
        userId: "2",
      })
    ).rejects.toThrow("Expense does not belong to user");
  });
});
