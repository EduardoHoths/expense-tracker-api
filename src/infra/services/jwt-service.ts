import jwt from "jsonwebtoken";
import { TokenService } from "../../domain/interfaces/token-generator";

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
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid token");
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Expired token");
      } else if (error instanceof jwt.NotBeforeError) {
        throw new Error("Token not yet valid");
      } else {
        throw new Error("Unknown error");
      }
    }
  }
}
