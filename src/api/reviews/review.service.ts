import { AppDataSource } from '../../config/database';
import { AppError } from '../../middlewares/error.middleware';
import { Review } from '../../entities/Review';
import { Court } from '../../entities/Court';
import { User } from '../../entities/User';

const reviewRepo = () => AppDataSource.getRepository(Review);
const courtRepo = () => AppDataSource.getRepository(Court);
const userRepo = () => AppDataSource.getRepository(User);

type ReviewInput = {
  courtId: string;
  rating: number;
  comment?: string;
};

export class ReviewService {
  async upsertReview(userId: string, input: ReviewInput) {
    const user = await userRepo().findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }

    const court = await courtRepo().findOne({ where: { id: input.courtId } });
    if (!court) {
      throw new AppError('Không tìm thấy sân bóng', 404);
    }

    if (input.rating < 1 || input.rating > 5) {
      throw new AppError('Rating phải từ 1 đến 5', 400);
    }

    let review = await reviewRepo().findOne({ where: { user: { id: userId }, court: { id: input.courtId } }, relations: { user: true, court: true } });
    if (!review) {
      review = reviewRepo().create({ user, court });
    }

    review.rating = input.rating;
    review.comment = input.comment || null;
    await reviewRepo().save(review);

    return review;
  }

  async listByCourt(courtId: string, page: number, limit: number) {
    const [items, total] = await reviewRepo().findAndCount({
      where: { court: { id: courtId } },
      relations: { user: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }
}
