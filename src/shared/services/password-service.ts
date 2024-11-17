import { hash, compare } from "bcryptjs";

export class PasswordService {
  static async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }

  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }
}
