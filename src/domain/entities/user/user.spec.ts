import { describe, it, expect } from "vitest";
import { User } from "./user";

describe("User Entity", () => {
  const email = "test@test.com";
  const password = "123456";
  const name = "test";

  it("should create a user with a hashed password", async () => {
    const user = await User.create(email, password, name);

    expect(user).toBeInstanceOf(User);
    expect(user.email).toBe(email);
    expect(user.name).toBe(name);
    expect(user.password).not.toBe(password); // password should be hashed
  });

  it("should compare a password with a hashed password", async () => {
    const user = await User.create(email, password, name);

    const isMatch = await user.comparePassword(password);
    const isNotMatch = await user.comparePassword("wrong-password");

    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });

  it("should create a user from with method", () => {
    const user = User.with({
      id: "1",
      email,
      password,
      name,
    });

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe("1");
    expect(user.email).toBe(email);
    expect(user.name).toBe(name);
    expect(user.password).toBe(password);
  });

  it("should return a user without password", () => {
    const user = User.withoutPassword({
      id: "1",
      email,
      password,
      name,
    });

    expect(user).not.toHaveProperty("password");
  });
});
