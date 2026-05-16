import { AppDataSource } from '@/config/database';
import { NguoiDung } from '@/entities';
import { AppError } from '@/middlewares/error.middleware';

const userRepo = () => AppDataSource.getRepository(NguoiDung);

type UpdateProfileInput = {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
};

export class UserService {
  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await userRepo().findOne({ where: { maNguoiDung: userId } });
    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }

    if (typeof input.fullName === 'string') {
      user.hoTen = input.fullName;
    }

    if (typeof input.phone === 'string') {
      user.soDienThoai = input.phone;
    }

    if (typeof input.avatarUrl === 'string') {
      user.avatar = input.avatarUrl;
    }

    await userRepo().save(user);

    return {
      id: user.maNguoiDung,
      fullName: user.hoTen,
      email: user.email,
      phone: user.soDienThoai,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
