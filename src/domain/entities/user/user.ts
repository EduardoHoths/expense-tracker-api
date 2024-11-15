import { v4 as uuid } from "uuid";
import { compare, hash } from "bcryptjs";

interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string;
}

export class User {
  constructor(private props: UserProps) {}

  public static async create(email: string, password: string, name: string) {
    const hashedPassword = await this.hashPassword(password);

    return new User({
      id: uuid(),
      email,
      password: hashedPassword,
      name,
    });
  }

  public static with(props: UserProps) {
    return new User(props);
  }

  public static withoutPassword(props: UserProps) {
    const user = this.with(props);

    const { password, ...userWithoutPassword } = user.props;

    return userWithoutPassword;
  }

  private static async hashPassword(password: string) {
    return await hash(password, 8);
  }

  public async comparePassword(password: string) {
    return await compare(password, this.props.password);
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
