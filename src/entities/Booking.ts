import { Column, Entity, ManyToOne, Index } from 'typeorm';
import { AppBaseEntity } from './BaseEntity';
import { User } from './User';
import { Court } from './Court';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Entity({ name: 'bookings' })
export class Booking extends AppBaseEntity {
  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Court, (court) => court.bookings, { onDelete: 'CASCADE' })
  court!: Court;

  @Index()
  @Column({ type: 'date' })
  bookingDate!: string;

  @Column({ type: 'time' })
  startTime!: string;

  @Column({ type: 'time' })
  endTime!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  totalPrice!: string;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status!: BookingStatus;
}
