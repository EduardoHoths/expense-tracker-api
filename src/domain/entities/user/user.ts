import { v4 as uuid } from "uuid";
import { compare, hash } from "bcryptjs";

interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export class User {
  private constructor(private props: UserProps) {}

  public static async create({
    email,
    password,
    name,
    isAdmin,
  }: Omit<UserProps, "id">) {
    const hashedPassword = await this.hashPassword(password);

    this.validate(email, password, name);

    return new User({
      id: uuid(),
      email,
      password: hashedPassword,
      name,
      isAdmin,
    });
  }

  public static with({ id, email, name, password, isAdmin }: UserProps){
    this.validate(email, password, name);

    return new User({ id, email, name, password, isAdmin });
  }

  public static withoutPassword({
    id,
    email,
    name,
    password,
    isAdmin,
  }: UserProps) {
    const user = this.with({
      id,
      email,
      name,
      isAdmin,
      password,
    });

    const { password: userPassword, ...userWithoutPassword } = user.props;

    return userWithoutPassword;
  }

  public static async update(user: User, updates: Partial<UserProps>) {
    if (updates.password) {
      updates.password = await this.hashPassword(updates.password);
    }

    return new User({
      ...user.props,
      ...updates,
    });
  }

  public async comparePassword(password: string) {
    return await compare(password, this.props.password);
  }

  public static async hashPassword(password: string) {
    return await hash(password, 10);
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

  get isAdmin() {
    return this.props.isAdmin;
  }
}

