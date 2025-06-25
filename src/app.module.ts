import { Module } from '@nestjs/common';
import { CultureModule } from './modules/culture/culture.module';
import { FarmModule } from './modules/farm/farm.module';
import { HarvestModule } from './modules/harvest/harvest.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { ProducerModule } from './modules/producer/producer.module';
import { DatabaseModule } from './shared/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    HealthCheckModule,
    ProducerModule,
    FarmModule,
    HarvestModule,
    CultureModule,
  ],
})
export class AppModule {}
