import { Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { ReviewService } from './review.service';

const reviewService = new ReviewService();

const reviewSchema = z.object({
  courtId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const ReviewController = {
  async upsert(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = reviewSchema.parse(req.body);
    const result = await reviewService.upsertReview(userId, payload);
    return res.status(200).json({ message: 'Đánh giá thành công', data: result });
  },

  async listByCourt(req: AuthenticatedRequest, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const result = await reviewService.listByCourt(req.params.courtId as string, page, limit);
    return res.status(200).json(result);
  },
};
