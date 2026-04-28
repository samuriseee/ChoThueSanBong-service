import { Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { BookingService } from './booking.service';

const bookingService = new BookingService();

const createBookingSchema = z.object({
  courtId: z.string().uuid(),
  bookingDate: z.string().min(8),
  startTime: z.string().min(4),
  endTime: z.string().min(4),
});

export const BookingController = {
  async create(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = createBookingSchema.parse(req.body);
    const result = await bookingService.createBooking(userId, payload);
    return res.status(201).json({ message: 'Đặt sân thành công', data: result });
  },

  async myBookings(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await bookingService.getMyBookings(userId);
    return res.status(200).json({ data: result });
  },

  async cancel(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await bookingService.cancelBooking(userId, req.params.id as string);
    return res.status(200).json({ message: 'Hủy đặt sân thành công', data: result });
  },
};
