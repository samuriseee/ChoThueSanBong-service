import { Router } from 'express';
import { ReviewController } from './review.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticateToken, asyncHandler(ReviewController.upsert));
router.get('/court/:courtId', asyncHandler(ReviewController.listByCourt));

export default router;
