import { describe, it, expect } from "vitest";
import { User } from "./user";

describe("User Entity", () => {
  const email = "test@gmail.com";
  const password = "123456";
  const name = "test";

  it("should create a user with a hashed password", async () => {
    const user = await User.create({ email, password, name });

    expect(user).toBeInstanceOf(User);
    expect(user.email).toBe(email);
    expect(user.name).toBe(name);
    expect(user.password).not.toBe(password); // password should be hashed
  });

  it("should update a user successfully", async () => {
    const updates = {
      email: "jane.doe@gmail.com",
      password: "new-password",
      name: "Jane Doe",
    };

    const user = User.with({
      id: "1",
      email: "joe.doe@gmail.com",

      name: "Joe Doe",
      password: await User.hashPassword("123456"),
    });

    const updatedUser = await User.update(user, updates);

    expect(updatedUser).toBeInstanceOf(User);
    expect(updatedUser.email).toBe(updates.email);
    expect(updatedUser.password).toBe(updates.password);
    expect(updatedUser.name).toBe(updates.name);
  });

  it("should create a user as an admin", async () => {
    const user = await User.create({
      email,
      password,
      name,
    });

    expect(user).toBeInstanceOf(User);
    expect(user.email).toBe(email);
    expect(user.name).toBe(name);
  });

  it("should compare a password with a hashed password", async () => {
    const user = await User.create({
      email,
      password,
      name,
    });

    const isMatch = await user.comparePassword(password);
    const isNotMatch = await user.comparePassword("wrong-password");

    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
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

  it("should throw an error if email is invalid", async () => {
    const invalidEmail = "invalid-email";

    await expect(
      User.create({ email: invalidEmail, password, name })
    ).rejects.toThrow("Invalid email");
  });

  it("should throw an error if password is invalid", async () => {
    const invalidPassword = "12345";

    await expect(
      User.create({ email, password: invalidPassword, name })
    ).rejects.toThrow("Password must be at least 6 characters");
  });

  it("should throw an error if name is invalid", async () => {
    const invalidName = "a".repeat(101);

    await expect(
      User.create({ email, password, name: invalidName })
    ).rejects.toThrow("Name must be less than 100 characters");
  });
});
