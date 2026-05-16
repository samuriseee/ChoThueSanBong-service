import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { DB_ENTITIES, DB_MIGRATIONS } from './schema';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.databaseUrl,
  ssl: env.databaseUrl.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined,
  synchronize: env.dbSynchronize,
  logging: env.dbLogging,
  entities: DB_ENTITIES,
  migrations: DB_MIGRATIONS,
});
