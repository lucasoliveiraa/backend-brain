import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultureController } from './culture.controller';
import { CultureService } from './culture.service';
import { CultureEntity } from './entities/culture.entity';
import { CultureRepository } from './repositories/culture.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CultureEntity])],
  controllers: [CultureController],
  providers: [CultureService, CultureRepository],
})
export class CultureModule {}
