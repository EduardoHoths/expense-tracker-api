import jwt from "jsonwebtoken";
import { TokenGenerator } from "../../domain/interfaces/token-generator";

export class JwtTokenGenerator implements TokenGenerator {
  public static create() {
    return new JwtTokenGenerator();
  }
  generate(payload: object) {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
  }

  verify(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  }
}
