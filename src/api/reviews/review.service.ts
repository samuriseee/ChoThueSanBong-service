import { AppDataSource } from '@/config/database';
import { DanhGia, NguoiDung, SanBong } from '@/entities';
import { AppError } from '@/middlewares/error.middleware';

const reviewRepo = () => AppDataSource.getRepository(DanhGia);
const courtRepo = () => AppDataSource.getRepository(SanBong);
const userRepo = () => AppDataSource.getRepository(NguoiDung);

type ReviewInput = {
  courtId: string;
  rating: number;
  comment?: string;
};

export class ReviewService {
  async upsertReview(userId: string, input: ReviewInput) {
    const user = await userRepo().findOne({ where: { maNguoiDung: userId } });
    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }

    const court = await courtRepo().findOne({ where: { maSanBong: input.courtId } });
    if (!court) {
      throw new AppError('Không tìm thấy sân bóng', 404);
    }

    if (input.rating < 1 || input.rating > 5) {
      throw new AppError('Rating phải từ 1 đến 5', 400);
    }

    let review = await reviewRepo().findOne({
      where: { nguoiThue: { maNguoiDung: userId }, maSanBong: { maSanBong: input.courtId } },
      relations: { nguoiThue: true, maSanBong: true },
    });
    if (!review) {
      review = reviewRepo().create({ nguoiThue: user, maSanBong: court });
    }

    review.diemSo = input.rating;
    review.binhLuan = input.comment ?? '';
    review.thoiGianDanhGia = new Date();
    await reviewRepo().save(review);

    return review;
  }

  async listByCourt(courtId: string, page: number, limit: number) {
    const [items, total] = await reviewRepo().findAndCount({
      where: { maSanBong: { maSanBong: courtId } },
      relations: { nguoiThue: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }
}
