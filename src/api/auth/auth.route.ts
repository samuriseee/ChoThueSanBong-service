import { Router } from 'express';
import { AuthController } from './auth.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', asyncHandler(AuthController.register));
router.post('/login', asyncHandler(AuthController.login));
router.get('/me', authenticateToken, asyncHandler(AuthController.me));

export default router;
