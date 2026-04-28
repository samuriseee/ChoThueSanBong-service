import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export type TokenPayload = {
  userId: string;
  email: string;
  role: string;
};

export const signAccessToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.jwtSecret as Secret, { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] });

export const signRefreshToken = (payload: Pick<TokenPayload, 'userId'>) =>
  jwt.sign(payload, env.jwtSecret as Secret, { expiresIn: env.jwtRefreshExpiresIn as SignOptions['expiresIn'] });

export const verifyToken = (token: string) => jwt.verify(token, env.jwtSecret as Secret) as TokenPayload & jwt.JwtPayload;
