import { User } from "../entities/user/user";

export interface UserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUserId(userId: string): Promise<User | null>;
}
