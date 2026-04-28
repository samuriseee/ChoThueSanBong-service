import { Column, Entity, Index, OneToMany } from 'typeorm';
import { AppBaseEntity } from './BaseEntity';
import { Booking } from './Booking';
import { Court } from './Court';
import { Review } from './Review';
import { Role } from './enums/Role';

@Entity({ name: 'users' })
export class User extends AppBaseEntity {
  @Column({ type: 'varchar', length: 120 })
  fullName!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 160 })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone?: string | null;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role!: Role;

  @Column({ type: 'text', nullable: true })
  avatarUrl?: string | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => Court, (court) => court.owner)
  courts!: Court[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings!: Booking[];

  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[];
}
