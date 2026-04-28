import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { Booking, Court, Review, User } from '../entities';


export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.databaseUrl,
  ssl: env.databaseUrl.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined,
  synchronize: env.dbSynchronize,
  logging: env.dbLogging,
  entities: [User, Court, Booking, Review],
});
