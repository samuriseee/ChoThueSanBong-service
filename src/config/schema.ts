import { entities } from '../entities';
import path from 'node:path';

export const DB_ENTITIES = entities;

const isDistRuntime = __dirname.includes(`${path.sep}dist${path.sep}`);
const migrationsExt = isDistRuntime ? 'js' : 'ts';

export const DB_MIGRATIONS = [path.join(__dirname, '..', 'migrations', `*.${migrationsExt}`)];
