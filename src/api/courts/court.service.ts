import { AppDataSource } from '@/config/database';
import { MediaSanBong, NguoiDung, SanBong, VaiTro } from '@/entities';
import { AppError } from '@/middlewares/error.middleware';

const courtRepo = () => AppDataSource.getRepository(SanBong);
const userRepo = () => AppDataSource.getRepository(NguoiDung);
const mediaRepo = () => AppDataSource.getRepository(MediaSanBong);

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
  private toCourtDto(court: SanBong) {
    return {
      id: court.maSanBong,
      name: court.tenSan,
      description: court.moTa,
      address: court.diaChi,
      province: court.thanhPho,
      district: court.quanHuyen,
      openTime: court.gioMoCua,
      closeTime: court.gioDongCua,
      isActive: !court.daBiDisable,
      isApproved: court.daDuyet,
      imageUrl: court.hinhAnh,
      ownerId: court.chuSan?.maNguoiDung,
      createdAt: court.createdAt,
      updatedAt: court.updatedAt,
    };
  }

  async listCourts(filters: { search?: string; province?: string; district?: string; page: number; limit: number }) {
    const qb = courtRepo().createQueryBuilder('court').leftJoinAndSelect('court.chuSan', 'owner');

    if (filters.search) {
      qb.andWhere('(court.tenSan ILIKE :search OR court.diaChi ILIKE :search)', { search: `%${filters.search}%` });
    }

    if (filters.province) {
      qb.andWhere('court.thanhPho = :province', { province: filters.province });
    }

    if (filters.district) {
      qb.andWhere('court.quanHuyen = :district', { district: filters.district });
    }

    const [items, total] = await qb
      .orderBy('court.createdAt', 'DESC')
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .getManyAndCount();

    return {
      items: items.map((item) => this.toCourtDto(item)),
      total,
      page: filters.page,
      limit: filters.limit,
    };
  }

  async getMyCourtsByOwnerId(
  ownerId: string,
  options?: { page?: number; limit?: number; search?: string }) 
  {
  // Kiểm tra chủ sân có tồn tại không
  const owner = await userRepo().findOne({ where: { maNguoiDung: ownerId } });
  if (!owner) {
    throw new AppError('Không tìm thấy người dùng', 404);
  }

  const page = options?.page && options.page > 0 ? options.page : 1;
  const limit = options?.limit && options.limit > 0 ? options.limit : 0;

  const qb = courtRepo()
    .createQueryBuilder('court')
    .leftJoinAndSelect('court.chuSan', 'owner')
    .where('owner.maNguoiDung = :ownerId', { ownerId });

  if (options?.search) {
    qb.andWhere('(court.tenSan ILIKE :search OR court.diaChi ILIKE :search)', {
      search: `%${options.search}%`,
    });
  }

  qb.orderBy('court.createdAt', 'DESC');

  if (limit > 0) {
    const [items, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return {
      items: items.map((court) => this.toCourtDto(court)),
      total,
      page,
      limit,
    };
  }

  const items = await qb.getMany();
  return items.map((court) => this.toCourtDto(court));
}

  //Xem chi tiết một sân bóng cụ thể
  async getCourtById(id: string) {
    const court = await courtRepo().findOne({
      where: { maSanBong: id },
      relations: { chuSan: true, media: true },
    });

    if (!court) {
      throw new AppError('Không tìm thấy sân bóng', 404);
    }

    return this.toCourtDto(court);
  }

  async createCourt(ownerId: string, input: CourtInput) {
    const owner = await userRepo().findOne({ where: { maNguoiDung: ownerId } });
    if (!owner) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }

    if (![VaiTro.CHU_SAN, VaiTro.ADMIN].includes(owner.vaiTro)) {
      throw new AppError('Chỉ chủ sân hoặc admin mới được tạo sân', 403);
    }

    const court = courtRepo().create({
      tenSan: input.name,
      moTa: input.description ?? '',
      diaChi: input.address,
      quanHuyen: input.district ?? '',
      thanhPho: input.province ?? '',
      gioMoCua: input.openTime ?? '06:00:00',
      gioDongCua: input.closeTime ?? '23:00:00',
      chuSan: owner,
      hinhAnh: input.imageUrls?.[0],
    });

    await courtRepo().save(court);

    if (input.imageUrls?.length) {
      const medias = input.imageUrls.map((link, index) =>
        mediaRepo().create({
          sanBong: court,
          loaiMedia: 'image',
          ten: `court-image-${index + 1}`,
          link,
          mediaId: link,
        })
      );
      await mediaRepo().save(medias);
    }

    return this.toCourtDto(court);
  }

  async updateCourt(ownerId: string, courtId: string, input: Partial<CourtInput>) {
    const court = await courtRepo().findOne({ where: { maSanBong: courtId }, relations: { chuSan: true } });
    if (!court) {
      throw new AppError('Không tìm thấy sân bóng', 404);
    }

    const owner = await userRepo().findOne({ where: { maNguoiDung: ownerId } });
    if (!owner) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }

    if (owner.vaiTro !== VaiTro.ADMIN && court.chuSan.maNguoiDung !== ownerId) {
      throw new AppError('Bạn không có quyền cập nhật sân này', 403);
    }

    if (typeof input.name === 'string') {
      court.tenSan = input.name;
    }
    if (typeof input.description === 'string') {
      court.moTa = input.description;
    }
    if (typeof input.address === 'string') {
      court.diaChi = input.address;
    }
    if (typeof input.district === 'string') {
      court.quanHuyen = input.district;
    }
    if (typeof input.province === 'string') {
      court.thanhPho = input.province;
    }
    if (typeof input.openTime === 'string') {
      court.gioMoCua = input.openTime;
    }
    if (typeof input.closeTime === 'string') {
      court.gioDongCua = input.closeTime;
    }
    if (input.imageUrls?.length) {
      court.hinhAnh = input.imageUrls[0];
    }

    await courtRepo().save(court);
    return this.toCourtDto(court);
  }

  async deleteCourt(ownerId: string, courtId: string) {
    const court = await courtRepo().findOne({ where: { maSanBong: courtId }, relations: { chuSan: true } });
    if (!court) {
      throw new AppError('Không tìm thấy sân bóng', 404);
    }

    const owner = await userRepo().findOne({ where: { maNguoiDung: ownerId } });
    if (!owner) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }

    if (owner.vaiTro !== VaiTro.ADMIN && court.chuSan.maNguoiDung !== ownerId) {
      throw new AppError('Bạn không có quyền xóa sân này', 403);
    }

    await courtRepo().remove(court);
    return { deleted: true };
  }
}
