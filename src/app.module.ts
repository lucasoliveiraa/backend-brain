import { Module } from '@nestjs/common';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { DatabaseModule } from './shared/database/database.module';

@Module({
  imports: [DatabaseModule, HealthCheckModule],
})
export class AppModule {}
