import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from './BaseEntity';
import { Booking } from './Booking';
import { Review } from './Review';
import { User } from './User';


@Entity({ name: 'courts' })
export class Court extends AppBaseEntity {
  @Column({ type: 'varchar', length: 140 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'text' })
  address!: string;

  @Index()
  @Column({ type: 'varchar', length: 120, nullable: true })
  province?: string | null;

  @Index()
  @Column({ type: 'varchar', length: 120, nullable: true })
  district?: string | null;

  @Index()
  @Column({ type: 'varchar', length: 120, nullable: true })
  ward?: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  pricePerHour!: string;

  @Column({ type: 'time', nullable: true })
  openTime?: string | null;

  @Column({ type: 'time', nullable: true })
  closeTime?: string | null;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  imageUrls!: string[];

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToOne(() => User, (user) => user.courts, { onDelete: 'CASCADE' })
  owner!: User;

  @OneToMany(() => Booking, (booking) => booking.court)
  bookings!: Booking[];

  @OneToMany(() => Review, (review) => review.court)
  reviews!: Review[];
}
