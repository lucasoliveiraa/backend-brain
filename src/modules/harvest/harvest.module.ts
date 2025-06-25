import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HarvestEntity } from './entities/harvest.entity';
import { HarvestController } from './harvest.controller';
import { HarvestService } from './harvest.service';
import { HarvestRepository } from './repositories/harvest.repository';

@Module({
  imports: [TypeOrmModule.forFeature([HarvestEntity])],
  controllers: [HarvestController],
  providers: [HarvestService, HarvestRepository],
})
export class HarvestModule {}
