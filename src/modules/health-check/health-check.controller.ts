import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheckService } from './health-check.service';

@Controller('health-check')
@ApiTags('Health Check')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  @ApiOperation({
    summary: 'Checa a saúde da aplicação',
    description: 'Este endpoint verifica a saúde da aplicação.',
  })
  async checkHealth() {
    return this.healthCheckService.getHealthStatus();
  }
}
