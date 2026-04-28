import { AppDataSource } from '../../config/database';
import { User } from '../../entities/User';
import { AppError } from '../../middlewares/error.middleware';

const userRepo = () => AppDataSource.getRepository(User);

type UpdateProfileInput = {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
};

export class UserService {
  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await userRepo().findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }

    if (typeof input.fullName === 'string') {
      user.fullName = input.fullName;
    }

    if (typeof input.phone === 'string') {
      user.phone = input.phone;
    }

    if (typeof input.avatarUrl === 'string') {
      user.avatarUrl = input.avatarUrl;
    }

    await userRepo().save(user);

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
