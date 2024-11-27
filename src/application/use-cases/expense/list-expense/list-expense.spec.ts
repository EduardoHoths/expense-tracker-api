import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExpenseRepository } from "../../../../domain/interfaces/expense-repository";
import { Expense } from "../../../../domain/entities/expense/expense";
import { Filter, ListExpensesUseCase } from "./list-expense";
import { ExpenseCategory } from "../../../../domain/entities/expense/expense-category";
import { DateUtils } from "../../../../utils/date-utils";

describe("ListExpensesUseCase", () => {
  const TEST_EXPENSES: Expense[] = [
    Expense.with({
      id: "1",
      description: "Past Week",
      amount: 50,
      date: DateUtils.daysBeforetoday(7),
      category: ExpenseCategory.GROCERIES,
      userId: "1",
    }),
    Expense.with({
      id: "2",
      description: "Past Month",
      amount: 500,
      date: DateUtils.daysBeforetoday(30),
      category: ExpenseCategory.GROCERIES,
      userId: "1",
    }),
    Expense.with({
      id: "3",
      description: "Past 3 Months",
      amount: 100,
      date: DateUtils.daysBeforetoday(90),
      category: ExpenseCategory.GROCERIES,
      userId: "1",
    }),
  ];

  const mockExpenseRepository: ExpenseRepository = {
    save: vi.fn(),
    findExpensesByUserId: vi.fn(),
  };

  let listExpensesUseCase: ListExpensesUseCase;

  beforeEach(() => {
    vi.resetAllMocks();
    listExpensesUseCase = new ListExpensesUseCase(mockExpenseRepository);
    vi.mocked(mockExpenseRepository.findExpensesByUserId).mockImplementation(
      async (userId) =>
        TEST_EXPENSES.filter((expense) => expense.userId === userId)
    );
  });

  it("should return all expenses when no filter is provided", async () => {
    vi.mocked(mockExpenseRepository.findExpensesByUserId).mockResolvedValue(
      TEST_EXPENSES
    );

    const result = await listExpensesUseCase.execute({ userId: "1" });

    expect(result).toEqual(TEST_EXPENSES);
    expect(mockExpenseRepository.findExpensesByUserId).toHaveBeenCalledWith(
      "1"
    );
  });

  it("should filter expenses from the last week", async () => {
    const result = await listExpensesUseCase.execute({
      userId: "1",
      filter: Filter.LAST_WEEK,
    });

    expect(result).toEqual([TEST_EXPENSES[0]]);
  });

  it("should filter expenses from the last month", async () => {
    const result = await listExpensesUseCase.execute({
      userId: "1",
      filter: Filter.LAST_MONTH,
    });

    expect(result).toEqual([TEST_EXPENSES[0], TEST_EXPENSES[1]]);
  });

  it("should filter expenses from the last 3 months", async () => {
    const result = await listExpensesUseCase.execute({
      userId: "1",
      filter: Filter.LAST_3_MONTHS,
    });

    expect(result).toEqual(TEST_EXPENSES);
  });

  it("should filter expenses with a custom date range", async () => {
    const result = await listExpensesUseCase.execute({
      userId: "1",
      filter: Filter.CUSTOM,
      startDate: DateUtils.daysBeforetoday(10),
      endDate: DateUtils.daysBeforetoday(1),
    });

    expect(result).toEqual([TEST_EXPENSES[0]]);
  });

  it("should throw an error if custom filter is used without start or end date", async () => {
    await expect(() =>
      listExpensesUseCase.execute({
        userId: "1",
        filter: Filter.CUSTOM,
      })
    ).rejects.toThrow("Start date and end date are required for custom filter");
  });

  it("should throw an error if custom filter is used with invalid date range", async () => {
    await expect(() =>
      listExpensesUseCase.execute({
        userId: "1",
        filter: Filter.CUSTOM,
        startDate: DateUtils.daysBeforetoday(10),
        endDate: DateUtils.daysBeforetoday(20),
      })
    ).rejects.toThrow("Start date must be before end date");
  });
});
