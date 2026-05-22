import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { AuthService } from './auth.service';

const roleSchema = z.enum(['ADMIN', 'OWNER', 'USER', 'admin', 'chuSan', 'nguoiThue']);

const authService = new AuthService();

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: roleSchema.optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const AuthController = {
  async register(req: Request, res: Response) {
    const payload = registerSchema.parse(req.body); // res.body: { fullName, email, password, phone?, role? }
    const result = await authService.register(payload);
    return res.status(201).json({ message: 'Đăng ký thành công', data: result });
  },

  async login(req: Request, res: Response) {
    const payload = loginSchema.parse(req.body);
    const result = await authService.login(payload);
    return res.status(200).json({ message: 'Đăng nhập thành công', data: result });
  },

  async me(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await authService.me(userId);
    return res.status(200).json({ data: user });
  },
};
