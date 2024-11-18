import jwt from 'jsonwebtoken';

export interface TokenService {
  generate(payload: object): string;
  verify(token: string): jwt.JwtPayload | string;
}
