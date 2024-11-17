import jwt from 'jsonwebtoken';

export interface TokenGenerator {
  generate(payload: object): string;
  verify(token: string): jwt.JwtPayload | string;
}
