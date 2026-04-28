import { AppDataSource } from '../../config/database';
import { AppError } from '../../middlewares/error.middleware';
import { Booking, BookingStatus } from '../../entities/Booking';
import { Court } from '../../entities/Court';
import { User } from '../../entities/User';

const bookingRepo = () => AppDataSource.getRepository(Booking);
const courtRepo = () => AppDataSource.getRepository(Court);
const userRepo = () => AppDataSource.getRepository(User);

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
    const user = await userRepo().findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }

    const court = await courtRepo().findOne({ where: { id: input.courtId } });
    if (!court || !court.isActive) {
      throw new AppError('Không tìm thấy sân bóng hoặc sân đang tắt', 404);
    }

    if (timeToMinutes(input.startTime) >= timeToMinutes(input.endTime)) {
      throw new AppError('Giờ bắt đầu phải nhỏ hơn giờ kết thúc', 400);
    }

    const existed = await bookingRepo()
      .createQueryBuilder('booking')
      .where('booking.courtId = :courtId', { courtId: input.courtId })
      .andWhere('booking.bookingDate = :bookingDate', { bookingDate: input.bookingDate })
      .andWhere('booking.status IN (:...statuses)', { statuses: [BookingStatus.PENDING, BookingStatus.CONFIRMED] })
      .andWhere('NOT (booking.endTime <= :startTime OR booking.startTime >= :endTime)', {
        startTime: input.startTime,
        endTime: input.endTime,
      })
      .getOne();

    if (existed) {
      throw new AppError('Khung giờ này đã được đặt', 400);
    }

    const hours = (timeToMinutes(input.endTime) - timeToMinutes(input.startTime)) / 60;
    const totalPrice = (Number(court.pricePerHour) * hours).toFixed(2);

    const booking = bookingRepo().create({
      user,
      court,
      bookingDate: input.bookingDate,
      startTime: input.startTime,
      endTime: input.endTime,
      totalPrice,
      status: BookingStatus.CONFIRMED,
    });

    await bookingRepo().save(booking);
    return booking;
  }

  async getMyBookings(userId: string) {
    return bookingRepo().find({
      where: { user: { id: userId } },
      relations: { court: true },
      order: { createdAt: 'DESC' },
    });
  }

  async cancelBooking(userId: string, bookingId: string) {
    const booking = await bookingRepo().findOne({
      where: { id: bookingId },
      relations: { user: true },
    });

    if (!booking) {
      throw new AppError('Không tìm thấy đơn đặt sân', 404);
    }

    if (booking.user.id !== userId) {
      throw new AppError('Bạn không có quyền hủy đơn này', 403);
    }

    booking.status = BookingStatus.CANCELLED;
    await bookingRepo().save(booking);
    return booking;
  }
}
