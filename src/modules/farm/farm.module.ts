import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmEntity } from './entities/farm.entity';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';
import { FarmRepository } from './repositories/farm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FarmEntity])],
  controllers: [FarmController],
  providers: [FarmService, FarmRepository],
  exports: [FarmRepository],
})
export class FarmModule {}
