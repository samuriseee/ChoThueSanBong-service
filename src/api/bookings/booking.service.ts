import { AppDataSource } from '@/config/database';
import { ChiTietDatSan, DatSan, LoaiHinhDat, NguoiDung, SanBongChiTiet } from '@/entities';
import { AppError } from '@/middlewares/error.middleware';

const datSanRepo = () => AppDataSource.getRepository(DatSan);
const chiTietDatSanRepo = () => AppDataSource.getRepository(ChiTietDatSan);
const sanBongChiTietRepo = () => AppDataSource.getRepository(SanBongChiTiet);
const userRepo = () => AppDataSource.getRepository(NguoiDung);
const loaiHinhDatRepo = () => AppDataSource.getRepository(LoaiHinhDat);

type CreateBookingInput = {
  courtId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
};

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export class BookingService {
  async createBooking(userId: string, input: CreateBookingInput) {
    const user = await userRepo().findOne({ where: { maNguoiDung: userId } });
    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }

    const sanChiTiet = await sanBongChiTietRepo().findOne({
      where: { maSanChiTiet: input.courtId },
      relations: { maSanBong: true },
    });

    if (!sanChiTiet || sanChiTiet.maSanBong.daBiDisable) {
      throw new AppError('Không tìm thấy sân bóng hoặc sân đang tắt', 404);
    }

    if (timeToMinutes(input.startTime) >= timeToMinutes(input.endTime)) {
      throw new AppError('Giờ bắt đầu phải nhỏ hơn giờ kết thúc', 400);
    }

    const existed = await chiTietDatSanRepo()
      .createQueryBuilder('ct')
      .leftJoinAndSelect('ct.maDatSan', 'ds')
      .where('ct.maSanChiTiet = :courtId', { courtId: input.courtId })
      .andWhere('ds.ngayDat::date = :bookingDate', { bookingDate: input.bookingDate })
      .andWhere('ct.trangThaiDatSan != :cancelled', { cancelled: 'CANCELLED' })
      .andWhere('NOT (ct.gioKetThuc <= :startTime OR ct.gioBatDau >= :endTime)', {
        startTime: input.startTime,
        endTime: input.endTime,
      })
      .getOne();

    if (existed) {
      throw new AppError('Khung giờ này đã được đặt', 400);
    }

    const loaiDat = await loaiHinhDatRepo().findOne({ where: { code: 'HOUR' } }) ?? (await loaiHinhDatRepo().findOne({ where: {} }));
    if (!loaiDat) {
      throw new AppError('Thiếu dữ liệu loại hình đặt sân', 500);
    }

    const hours = (timeToMinutes(input.endTime) - timeToMinutes(input.startTime)) / 60;
    const startHour = Number(input.startTime.split(':')[0] ?? 0);
    const hourlyPrice = startHour < 18 ? Number(sanChiTiet.giaThueBuoiSang) : Number(sanChiTiet.giaThueBuoiToi);
    const totalPrice = Number((hourlyPrice * hours).toFixed(2));

    const datSan = datSanRepo().create({
      nguoiThue: user,
      ngayDat: new Date(input.bookingDate),
      ngayThanhToan: new Date(),
      soTien: totalPrice,
    });
    await datSanRepo().save(datSan);

    const chiTietDatSan = chiTietDatSanRepo().create({
      maDatSan: datSan,
      maSanChiTiet: sanChiTiet,
      nguoiThue: user,
      maLoaiDat: loaiDat,
      gioBatDau: input.startTime,
      gioKetThuc: input.endTime,
      trangThaiDatSan: 'CONFIRMED',
      soTien: totalPrice,
      coVanDe: false,
      daGuiThongBao: false,
    });

    await chiTietDatSanRepo().save(chiTietDatSan);

    return chiTietDatSan;
  }

  async getMyBookings(userId: string) {
    return chiTietDatSanRepo().find({
      where: { nguoiThue: { maNguoiDung: userId } },
      relations: { maDatSan: true, maSanChiTiet: true },
      order: { createdAt: 'DESC' },
    });
  }

  async cancelBooking(userId: string, bookingId: string) {
    const booking = await chiTietDatSanRepo().findOne({
      where: { maChiTietDatSan: bookingId },
      relations: { nguoiThue: true },
    });

    if (!booking) {
      throw new AppError('Không tìm thấy đơn đặt sân', 404);
    }

    if (booking.nguoiThue.maNguoiDung !== userId) {
      throw new AppError('Bạn không có quyền hủy đơn này', 403);
    }

    booking.trangThaiDatSan = 'CANCELLED';
    await chiTietDatSanRepo().save(booking);
    return booking;
  }
}
