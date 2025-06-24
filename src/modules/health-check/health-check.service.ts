import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { IHealthCheckResponse } from './interface/health-check-response.interface';

@Injectable()
export class HealthCheckService {
  constructor(private readonly dataSource: DataSource) {}

  async getHealthStatus(): Promise<IHealthCheckResponse> {
    const start = Date.now();
    let dbStatus = 'OK';
    let dbResponseTime = 0;

    try {
      await this.dataSource.query('SELECT 1');
      dbResponseTime = Date.now() - start;
    } catch (error) {
      dbStatus = 'DOWN';
      dbResponseTime = -1;
    }

    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const version = packageJson.version;

    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      version,
      uptime_seconds: process.uptime(),
      environment: process.env.NODE_ENV || 'not_set',
      dependencies: {
        database: {
          status: dbStatus,
          response_time_ms: dbResponseTime,
        },
      },
    };
  }
}
