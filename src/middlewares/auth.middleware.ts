import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { VaiTro } from '../entities/enums/vai-tro';

export type AuthUser = {
  userId: string;
  email: string;
  role: VaiTro;
};

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = header.slice(7);
    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role as VaiTro,
    };
    return next();
  } catch {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

export const requireRoles = (...roles: VaiTro[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return next();
  };
};
