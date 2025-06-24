import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProviders } from './database.providers';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT as unknown as number,
      username: process.env.DATABASE_USER,
      password: String(process.env.DATABASE_PASSWORD) || '',
      database: process.env.DATABASE_DB,
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      // logging: 'all',
      synchronize: process.env.SYNC_DB ? true : false,
      ssl: false,
    }),
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
