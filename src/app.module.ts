import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/authentication/authentication.guard';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { CultureModule } from './modules/culture/culture.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { FarmModule } from './modules/farm/farm.module';
import { HarvestModule } from './modules/harvest/harvest.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { ProducerModule } from './modules/producer/producer.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './shared/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    HealthCheckModule,
    ProducerModule,
    FarmModule,
    HarvestModule,
    CultureModule,
    DashboardModule,
    AuthenticationModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
