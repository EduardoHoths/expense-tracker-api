import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import Server from "../../server";

describe("User Routes", async () => {
  const server = new Server();
  const app = server.app;

  const TEST_USER = {
    email: "test.auth@test.com",
    password: "123456",
  };

  afterAll(() => {
    server.stop();
  });

  it("should authenticate a user", async () => {
    const response = await request(app).post("/auth/login").send(TEST_USER); // Authenticate the user

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      })
    );
  });

  it("should not authenticate a user with wrong password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: TEST_USER.email, password: "wrong-password" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Invalid credentials",
      })
    );
  });

  it("should not authenticate a user with an invalid fields", async () => {
    const invalidEmailUser = {
      email: "test",
      password: "12345",
    };

    const response = await request(app)
      .post("/auth/login")
      .send(invalidEmailUser);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Invalid fields",
      errors: [
        "Invalid email format",
        "Password must be at least 6 characters",
      ],
    });
  });
});
