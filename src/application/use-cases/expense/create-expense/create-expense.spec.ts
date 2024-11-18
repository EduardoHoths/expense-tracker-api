import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateExpenseUseCase } from "./create-expense";
import { User } from "../../../../domain/entities/user/user";
import { ExpenseCategory } from "../../../../domain/entities/expense/expense-category";
import { TokenService } from "../../../../domain/interfaces/token-generator";
import { UserRepository } from "../../../../domain/interfaces/user-repository";
import { ExpenseRepository } from "../../../../domain/interfaces/expense-repository";
import { Expense } from "../../../../domain/entities/expense/expense";

describe("CreateExpenseUseCase", () => {
  const mockTokenService: TokenService = {
    verify: vi.fn(),
    generate: vi.fn(),
  };

  const mockUserRepository: UserRepository = {
    findByUserId: vi.fn(),
    findAllUsers: vi.fn(),
    findByEmail: vi.fn(),
    save: vi.fn(),
  };

  const mockExpenseRepository: ExpenseRepository = {
    save: vi.fn(),
    findExpensesByUserId: vi.fn(),
  };

  let createExpenseUseCase: CreateExpenseUseCase;

  const TEST_USER = User.with({
    id: "1",
    name: "John Doe",
    email: "john.doe@gmail.com",
    password: "password",
  });

  const TEST_EXPENSE_DATA = {
    description: "Expense 01",
    amount: 100,
    date: new Date("2020-01-01"),
    category: ExpenseCategory.GROCERIES,
    accessToken: "token",
  };

  beforeEach(() => {
    vi.resetAllMocks();

    createExpenseUseCase = CreateExpenseUseCase.create(
      mockExpenseRepository,
      mockUserRepository,
      mockTokenService
    );
  });

  it("should create a new expense successfully", async () => {
    vi.mocked(mockTokenService.verify).mockReturnValue({ userId: "1" });
    vi.mocked(mockUserRepository.findByUserId).mockResolvedValue(TEST_USER);
    vi.mocked(mockExpenseRepository.save).mockImplementation(
      async (expense) => expense
    );

    const expense = await createExpenseUseCase.execute(TEST_EXPENSE_DATA);

    expect(expense).toBeInstanceOf(Expense);
    expect(mockTokenService.verify).toHaveBeenCalledWith(
      TEST_EXPENSE_DATA.accessToken
    );
    expect(mockUserRepository.findByUserId).toHaveBeenCalledWith("1");
    expect(mockExpenseRepository.save).toHaveBeenCalledTimes(1);

    expect(expense).toMatchObject({
      description: TEST_EXPENSE_DATA.description,
      amount: TEST_EXPENSE_DATA.amount,
      date: TEST_EXPENSE_DATA.date,
      category: TEST_EXPENSE_DATA.category,
      userId: TEST_USER.id,
    });
  });

  it("should throw error when user is not found", async () => {
    vi.mocked(mockTokenService.verify).mockReturnValue({ userId: "1" });
    vi.mocked(mockUserRepository.findByUserId).mockResolvedValue(null);

    await expect(() =>
      createExpenseUseCase.execute(TEST_EXPENSE_DATA)
    ).rejects.toThrow("User not found");
  });

  it("should throw error when token is invalid", async () => {
    vi.mocked(mockTokenService.verify).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await expect(() =>
      createExpenseUseCase.execute(TEST_EXPENSE_DATA)
    ).rejects.toThrow("Invalid token");
  });

  it("should validate expense amount", async () => {
    vi.mocked(mockTokenService.verify).mockReturnValue({ userId: "1" });
    vi.mocked(mockUserRepository.findByUserId).mockResolvedValue(TEST_USER);

    const invalidData = {
      ...TEST_EXPENSE_DATA,
      amount: -100,
    };

    await expect(() =>
      createExpenseUseCase.execute(invalidData)
    ).rejects.toThrow("Amount must be positive");
  });

  it("should validate expense date", async () => {
    vi.mocked(mockTokenService.verify).mockReturnValue({ userId: "1" });
    vi.mocked(mockUserRepository.findByUserId).mockResolvedValue(TEST_USER);

    const invalidData = {
      ...TEST_EXPENSE_DATA,
      date: new Date("2030-01-01"),
    };

    await expect(() =>
      createExpenseUseCase.execute(invalidData)
    ).rejects.toThrow("Invalid date");
  });
});
