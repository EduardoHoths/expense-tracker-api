import { User } from "../../domain/entities/user/user";

export class UserPresenter {
  public static toJSON(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }
}
