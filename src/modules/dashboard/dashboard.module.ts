import { Module } from '@nestjs/common';
import { FarmModule } from '../farm/farm.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [FarmModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
