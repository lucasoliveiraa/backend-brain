import { DataSource } from 'typeorm';
import 'dotenv/config';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useExisting: DataSource,
  },
];
