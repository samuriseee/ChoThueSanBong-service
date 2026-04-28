import { AppDataSource } from '../../config/database';
import { User } from '../../entities/User';
import { Role } from '../../entities/enums/Role';
import { AppError } from '../../middlewares/error.middleware';
import { comparePassword, hashPassword } from '../../utils/password';
import { signAccessToken } from '../../utils/jwt';

const userRepo = () => AppDataSource.getRepository(User);

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
};

type LoginInput = {
  email: string;
  password: string;
};

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await userRepo().findOne({ where: { email: input.email } });
    if (existing) {
      throw new AppError('Email đã tồn tại', 400);
    }

    const user = userRepo().create({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      role: input.role || Role.USER,
      passwordHash: await hashPassword(input.password),
    });

    await userRepo().save(user);

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return this.sanitizeUser(user, accessToken);
  }

  async login(input: LoginInput) {
    const user = await userRepo().findOne({ where: { email: input.email } });
    if (!user) {
      throw new AppError('Email hoặc mật khẩu không đúng', 400);
    }

    const isValid = await comparePassword(input.password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Email hoặc mật khẩu không đúng', 400);
    }

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return this.sanitizeUser(user, accessToken);
  }

  async me(userId: string) {
    const user = await userRepo().findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }
    return this.stripPassword(user);
  }

  private stripPassword(user: User) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  private sanitizeUser(user: User, accessToken: string) {
    return {
      user: this.stripPassword(user),
      accessToken,
      tokenType: 'Bearer',
    };
  }
}
