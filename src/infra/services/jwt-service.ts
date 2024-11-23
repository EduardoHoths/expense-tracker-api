import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { TokenService } from "../../domain/interfaces/token-generator";
import { TokenError } from "../../shared/errors/token-error";

export class JwtService implements TokenService {
  generate(payload: object) {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
  }

  verify(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      throw new TokenError();
    }
  }
}
