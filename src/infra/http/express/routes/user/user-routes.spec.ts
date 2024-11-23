import { expect, it, describe, afterAll } from "vitest";
import request from "supertest";
import Server from "../../server";

describe("User Routes", () => {
  const server = new Server();
  const app = server.app;

  const TEST_USER = {
    name: "test",
    email: "test@test.com",
    password: "123456",
  };

  afterAll(() => {
    server.stop();
  });

  it("should create a user", async () => {
    const response = await request(app).post("/users/create").send(TEST_USER);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "User created successfully",
        user: {
          id: expect.any(String),
          name: TEST_USER.name,
          email: TEST_USER.email,
        },
      })
    );
  });

  it("should not create a user with an existing email", async () => {
    await request(app).post("/users/create").send(TEST_USER); // Create the user

    const response = await request(app).post("/users/create").send(TEST_USER); // Try to create the user again

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("User already exists");
  });

  it("should not create a user with an invalid fields", async () => {
    const invalidEmailUser = {
      name: "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest",
      email: "test",
      password: "12345",
    };

    const response = await request(app)
      .post("/users/create")
      .send(invalidEmailUser);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Invalid fields",
      errors: [
        "Invalid email format",
        "Password must be at least 6 characters",
        "Name must be less than 100 characters",
      ],
    });
  });
});
