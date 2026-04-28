import { AppDataSource } from '../../config/database';
import { AppError } from '../../middlewares/error.middleware';
import { Court } from '../../entities/Court';
import { User } from '../../entities/User';
import { Role } from '../../entities/enums/vai-tro';

const courtRepo = () => AppDataSource.getRepository(Court);
const userRepo = () => AppDataSource.getRepository(User);

type CourtInput = {
  name: string;
  description?: string;
  address: string;
  province?: string;
  district?: string;
  ward?: string;
  pricePerHour: number;
  openTime?: string;
  closeTime?: string;
  imageUrls?: string[];
};

export class CourtService {
  async listCourts(filters: { search?: string; province?: string; district?: string; page: number; limit: number }) {
    const qb = courtRepo().createQueryBuilder('court').leftJoinAndSelect('court.owner', 'owner');

    if (filters.search) {
      qb.andWhere('(court.name ILIKE :search OR court.address ILIKE :search)', { search: `%${filters.search}%` });
    }

    if (filters.province) {
      qb.andWhere('court.province = :province', { province: filters.province });
    }

    if (filters.district) {
      qb.andWhere('court.district = :district', { district: filters.district });
    }

    const [items, total] = await qb
      .orderBy('court.createdAt', 'DESC')
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .getManyAndCount();

    return {
      items,
      total,
      page: filters.page,
      limit: filters.limit,
    };
  }

  async getCourtById(id: string) {
    const court = await courtRepo().findOne({
      where: { id },
      relations: { owner: true, bookings: true, reviews: true },
    });

    if (!court) {
      throw new AppError('Không tìm thấy sân bóng', 404);
    }

    return court;
  }

  async createCourt(ownerId: string, input: CourtInput) {
    const owner = await userRepo().findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }

    if (![Role.OWNER, Role.ADMIN].includes(owner.role)) {
      throw new AppError('Chỉ chủ sân hoặc admin mới được tạo sân', 403);
    }

    const court = courtRepo().create({
      ...input,
      pricePerHour: input.pricePerHour.toString(),
      owner,
      imageUrls: input.imageUrls || [],
    });

    await courtRepo().save(court);
    return court;
  }

  async updateCourt(ownerId: string, courtId: string, input: Partial<CourtInput>) {
    const court = await courtRepo().findOne({ where: { id: courtId }, relations: { owner: true } });
    if (!court) {
      throw new AppError('Không tìm thấy sân bóng', 404);
    }

    const owner = await userRepo().findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }

    if (owner.role !== Role.ADMIN && court.owner.id !== ownerId) {
      throw new AppError('Bạn không có quyền cập nhật sân này', 403);
    }

    Object.assign(court, {
      ...input,
      ...(typeof input.pricePerHour === 'number' ? { pricePerHour: input.pricePerHour.toString() } : {}),
      ...(input.imageUrls ? { imageUrls: input.imageUrls } : {}),
    });

    await courtRepo().save(court);
    return court;
  }

  async deleteCourt(ownerId: string, courtId: string) {
    const court = await courtRepo().findOne({ where: { id: courtId }, relations: { owner: true } });
    if (!court) {
      throw new AppError('Không tìm thấy sân bóng', 404);
    }

    const owner = await userRepo().findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }

    if (owner.role !== Role.ADMIN && court.owner.id !== ownerId) {
      throw new AppError('Bạn không có quyền xóa sân này', 403);
    }

    await courtRepo().remove(court);
    return { deleted: true };
  }
}
