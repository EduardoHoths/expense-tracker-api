import { afterAll, describe, expect, it } from "vitest";
import { ExpenseCategory } from "../../../../../domain/entities/expense/expense-category";
import Server from "../../server";
import request from "supertest";
import { DateUtils } from "../../../../../utils/date-utils";

describe("Expense Routes", async () => {
  const server = new Server();
  const app = server.app;

  const TEST_USER = {
    email: "test.auth@test.com",
    password: "123456",
  };

  const authResponse = await request(app).post("/auth/login").send(TEST_USER); // Authenticate the user

  afterAll(() => {
    server.stop();
  });

  describe("Create Expense Route", () => {
    const TEST_EXPENSE_DATA = {
      description: "Expense 01",
      amount: 100,
      date: new Date("2020-01-01"),
      category: ExpenseCategory.GROCERIES,
      userId: "1",
    };

    it("should create a expense", async () => {
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
          message: "Token not provided",
        })
      );
    });
  });

  describe("List Expense Route", () => {
    it("should list expenses", async () => {
      const response = await request(app)
        .get("/expenses/list")
        .set("Authorization", `Bearer ${authResponse.body.accessToken}`);

      expect(response.status).toBe(200);
    });

    it("should list expenses with filter last week", async () => {
      const response = await request(app)
        .get("/expenses/list?filter=lastWeek")
        .set("Authorization", `Bearer ${authResponse.body.accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            description: "Last Week",
            amount: expect.any(Number),
            date: DateUtils.daysBeforetoday(7).toISOString(),
            category: expect.any(String),
            userId: expect.any(String),
          }),
        ])
      );
    });

    it("should list expenses with filter last month", async () => {
      const response = await request(app)
        .get("/expenses/list?filter=lastMonth")
        .set("Authorization", `Bearer ${authResponse.body.accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            description: "Last Month",
            amount: expect.any(Number),
            date: DateUtils.daysBeforetoday(30).toISOString(),
            category: expect.any(String),
            userId: expect.any(String),
          }),
        ])
      );
    });

    it("should list expenses with filter last three months", async () => {
      const response = await request(app)
        .get("/expenses/list?filter=last3Months")
        .set("Authorization", `Bearer ${authResponse.body.accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            description: "Last Week",
            amount: expect.any(Number),
            date: DateUtils.daysBeforetoday(7).toISOString(),
            category: expect.any(String),
            userId: expect.any(String),
          }),
          expect.objectContaining({
            id: expect.any(String),
            description: "Last Month",
            amount: expect.any(Number),
            date: DateUtils.daysBeforetoday(30).toISOString(),
            category: expect.any(String),
            userId: expect.any(String),
          }),
          expect.objectContaining({
            id: expect.any(String),
            description: "Last 3 Months",
            amount: expect.any(Number),
            date: DateUtils.daysBeforetoday(90).toISOString(),
            category: expect.any(String),
            userId: expect.any(String),
          }),
        ])
      );
    });

    it("should list expenses with filter custom", async () => {
      const startDate = DateUtils.daysBeforetoday(10);
      const endDate = DateUtils.daysBeforetoday(1);

      const response = await request(app)
        .get(
          `/expenses/list?filter=custom&startDate=${startDate}&endDate=${endDate}`
        )
        .set("Authorization", `Bearer ${authResponse.body.accessToken}`);

      expect(response.status).toBe(200);
    });

    it("should not list expenses with filter invalid", async () => {
      const response = await request(app)
        .get("/expenses/list?filter=invalid")
        .set("Authorization", `Bearer ${authResponse.body.accessToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Invalid fields",
          errors: [
            "Invalid filter. Must be one of: lastWeek, lastMonth, last3Months, custom",
          ],
        })
      );
    });

    it("should not list expenses with invalid date", async () => {
      const startDate = DateUtils.daysBeforetoday(1);
      const endDate = DateUtils.daysBeforetoday(10);

      const response = await request(app)
        .get(
          `/expenses/list?filter=custom&startDate=${startDate}&endDate=${endDate}`
        )
        .set("Authorization", `Bearer ${authResponse.body.accessToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Start date must be before end date",
        })
      );
    });

    it("should not list expenses with custom filter without dates", async () => {
      const resposne = await request(app)
        .get("/expenses/list?filter=custom")
        .set("Authorization", `Bearer ${authResponse.body.accessToken}`);

      expect(resposne.status).toBe(400);
      expect(resposne.body).toEqual(
        expect.objectContaining({
          message: "Start date and end date are required for custom filter",
        })
      );
    });

    it("should not list expenses without token provided", async () => {
      const response = await request(app).get("/expenses/list");

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Token not provided",
        })
      );
    });

    it("should not list expenses with token invalid", async () => {
      const response = await request(app)
        .get("/expenses/list")
        .set("Authorization", `Bearer invalid_token`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Invalid token",
        })
      );
    });
  });
});
