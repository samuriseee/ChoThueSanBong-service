import { Router } from 'express';
import { UserController } from './user.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { authenticateToken } from '../../middlewares/auth.middleware';
import upload from '../../middlewares/upload.middleware';

const router = Router();

router.patch('/me', authenticateToken, upload.single('avatar'), asyncHandler(UserController.updateMe));

export default router;
