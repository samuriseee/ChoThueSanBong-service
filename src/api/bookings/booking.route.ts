import { Router } from 'express';
import { BookingController } from './booking.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticateToken, asyncHandler(BookingController.create));
router.get('/me', authenticateToken, asyncHandler(BookingController.myBookings));
router.patch('/:id/cancel', authenticateToken, asyncHandler(BookingController.cancel));

export default router;
