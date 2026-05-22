import { AppDataSource } from '@/config/database';
import { NapTien, NguoiDung, VaiTro } from '@/entities';
import { AppError } from '@/middlewares/error.middleware';
import { signAccessToken } from '@/utils/jwt';
import { comparePassword, hashPassword } from '@/utils/password';

const userRepo = () => AppDataSource.getRepository(NguoiDung);
const napTienRepo = () => AppDataSource.getRepository(NapTien);

type ClientRole = 'ADMIN' | 'OWNER' | 'USER';

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role?: VaiTro | ClientRole | string;
};

type LoginInput = {
  email: string;
  password: string;
};

const toClientRole = (role: VaiTro): ClientRole => {
  if (role === VaiTro.ADMIN) {
    return 'ADMIN';
  }

  if (role === VaiTro.CHU_SAN) {
    return 'OWNER';
  }

  return 'USER';
};

const toVaiTro = (role?: VaiTro | ClientRole | string): VaiTro => {
  if (!role) {
    return VaiTro.NGUOI_THUE;
  }

  if (role === 'ADMIN' || role === VaiTro.ADMIN) {
    return VaiTro.ADMIN;
  }

  if (role === 'OWNER' || role === VaiTro.CHU_SAN) {
    return VaiTro.CHU_SAN;
  }

  return VaiTro.NGUOI_THUE;
};

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await userRepo().findOne({ where: { email: input.email } });
    if (existing) {
      throw new AppError('Email đã tồn tại', 400);
    }

    const user = userRepo().create({
      hoTen: input.fullName,
      email: input.email,
      soDienThoai: input.phone ?? '',
      vaiTro: toVaiTro(input.role),
      matKhau: await hashPassword(input.password),
    })

    await userRepo().save(user);

    const accessToken = signAccessToken({
      userId: user.maNguoiDung,
      email: user.email,
      role: user.vaiTro,
    });

    return this.sanitizeUser(user, accessToken);
  }

  async login(input: LoginInput) {
    const user = await userRepo().findOne({ where: { email: input.email } });
    if (!user) {
      throw new AppError('Email hoặc mật khẩu không đúng', 400);
    }

    const isValid = await comparePassword(input.password, user.matKhau);
    if (!isValid) {
      throw new AppError('Email hoặc mật khẩu không đúng', 400);
    }

    const accessToken = signAccessToken({
      userId: user.maNguoiDung,
      email: user.email,
      role: user.vaiTro,
    });

    return this.sanitizeUser(user, accessToken);
  }

  async me(userId: string) {
    const user = await userRepo().findOne({ where: { maNguoiDung: userId } });
    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }
    return this.stripPassword(user);
  }

  private stripPassword(user: NguoiDung) {
    return {
      id: user.maNguoiDung,
      fullName: user.hoTen,
      email: user.email,
      phone: user.soDienThoai,
      role: toClientRole(user.vaiTro),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      avatar: user.avatar,
    };
  }

  private sanitizeUser(user: NguoiDung, accessToken: string) {
    return {
      user: this.stripPassword(user),
      accessToken,
      tokenType: 'Bearer',
    };
  }
}
