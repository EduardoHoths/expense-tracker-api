import { PasswordService } from "../../../shared/services/password-service";
import { UuidService } from "../../../shared/services/uuid-service";

interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string;
}

export class User {
  private constructor(private props: UserProps) {}

  public static async create({ email, password, name }: Omit<UserProps, "id">) {
    this.validate(email, password, name);

    const hashedPassword = await PasswordService.hashPassword(password);

    return new User({
      id: UuidService.generate(),
      email,
      password: hashedPassword,
      name,
    });
  }

  public static with({ id, email, name, password }: UserProps) {
    return new User({ id, email, name, password });
  }

  public static async update(user: User, updates: Partial<UserProps>) {
    if (updates.password) {
      updates.password = await PasswordService.hashPassword(updates.password);
    }

    return new User({
      ...user.props,
      ...updates,
    });
  }

  private static isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPassword(password: string) {
    return password.length >= 6;
  }

  private static isValidName(name: string) {
    return name.length <= 100;
  }

  private static validate(email: string, password: string, name: string) {
    if (!this.isValidEmail(email)) {
      throw new Error("Invalid email");
    }

    if (!this.isValidPassword(password)) {
      throw new Error("Password must be at least 6 characters");
    }

    if (!this.isValidName(name)) {
      throw new Error("Name must be less than 100 characters");
    }
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }
}
