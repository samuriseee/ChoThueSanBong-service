import { Column, Entity, ManyToOne, Index, Unique } from 'typeorm';
import { AppBaseEntity } from './BaseEntity';
import { User } from './User';
import { Court } from './Court';

@Entity({ name: 'reviews' })
@Unique(['user', 'court'])
export class Review extends AppBaseEntity {
  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Court, (court) => court.reviews, { onDelete: 'CASCADE' })
  court!: Court;

  @Index()
  @Column({ type: 'int' })
  rating!: number;

  @Column({ type: 'text', nullable: true })
  comment?: string | null;
}
