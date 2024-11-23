import { afterAll, describe, expect, it } from "vitest";
import { ExpenseCategory } from "../../../../../domain/entities/expense/expense-category";
import Server from "../../server";
import request from "supertest";

describe("Expense Routes", () => {
  const server = new Server();
  const app = server.app;

  const TEST_USER = {
    email: "test.auth@test.com",
    password: "123456",
  };

  const TEST_EXPENSE_DATA = {
    description: "Expense 01",
    amount: 100,
    date: new Date("2020-01-01"),
    category: ExpenseCategory.GROCERIES,
    userId: "1",
  };

  afterAll(() => {
    server.stop();
  });

  it("should create a expense", async () => {
    const authResponse = await request(app).post("/auth/login").send(TEST_USER); // Authenticate the user

    const response = await request(app)
      .post("/expenses/create")
      .send(TEST_EXPENSE_DATA)
      .set("Authorization", `Bearer ${authResponse.body.accessToken}`); // Create the expense

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Expense created successfully",
        expense: {
          id: expect.any(String),
          description: TEST_EXPENSE_DATA.description,
          amount: TEST_EXPENSE_DATA.amount,
          date: TEST_EXPENSE_DATA.date.toISOString(),
          category: TEST_EXPENSE_DATA.category,
          userId: TEST_EXPENSE_DATA.userId,
        },
      })
    );
  });

  it("should not create a expense with an invalid fields", async () => {
    const authResponse = await request(app).post("/auth/login").send(TEST_USER); // Authenticate the user

    const response = await request(app)
      .post("/expenses/create")
      .send()
      .set("Authorization", `Bearer ${authResponse.body.accessToken}`); // Create the expense

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Invalid fields",
        errors: [
          "Description is required",
          "Amount is required",
          "Date is required",
          "Invalid category. Must be one of: Groceries, Leisure, Electronics, Utilities, Clothing, Health, Other",
        ],
      })
    );
  });

  it("should not create a expense without authentication", async () => {
    const response = await request(app)
      .post("/expenses/create")
      .send(TEST_EXPENSE_DATA); // Create the expense

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
});
