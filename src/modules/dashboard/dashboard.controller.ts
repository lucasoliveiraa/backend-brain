import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('total-farmers')
  @ApiOkResponse({
    description: 'Dashboard total de fazendas cadastradas.',
    schema: {
      example: {
        total: 100,
      },
    },
  })
  @ApiOperation({
    summary: 'Buscar total de fazendas cadastradas',
    description: 'Retorna o total de fazendas cadastradas no sistema.',
  })
  findAllFarmers() {
    return this.dashboardService.findAllFarmers();
  }

  @Get('total-hectares')
  @ApiOkResponse({
    description: 'Dashboard total de hectares cadastrados.',
    schema: {
      example: {
        total: 5000,
      },
    },
  })
  @ApiOperation({
    summary: 'Buscar total de hectares cadastrados',
    description: 'Retorna o total de hectares cadastrados no sistema.',
  })
  findAllHectares() {
    return this.dashboardService.findAllHectares();
  }

  @Get('farmers-by-state')
  @ApiOkResponse({
    description: 'Dashboard total de fazendas por estado.',
    schema: {
      example: [
        {
          state: 'SP',
          total: 50,
        },
        {
          state: 'MG',
          total: 30,
        },
      ],
    },
  })
  @ApiOperation({
    summary: 'Buscar total de fazendas por estado',
    description: 'Retorna o total de fazendas agrupadas por estado.',
  })
  findFarmersByState() {
    return this.dashboardService.findFarmersByState();
  }

  @Get('total-cultures-distributed')
  @ApiOkResponse({
    description: 'Dashboard total de culturas distribuídas.',
    schema: {
      example: [
        {
          cultura: 'Soja',
          total: 10,
        },
        {
          cultura: 'Milho',
          total: 5,
        },
      ],
    },
  })
  @ApiOperation({
    summary: 'Buscar total de culturas distribuídas',
    description: 'Retorna o total de culturas distribuídas no sistema.',
  })
  findTotalCulturesDistributed() {
    return this.dashboardService.findTotalCulturesDistributed();
  }

  @Get('total-land-use')
  @ApiOkResponse({
    description: 'Dashboard total de uso da terra.',
    schema: {
      example: {
        agricultural: 3000,
        vegetation: 2000,
      },
    },
  })
  @ApiOperation({
    summary: 'Buscar total de uso da terra',
    description:
      'Retorna o total de uso da terra, incluindo áreas agrícolas e de vegetação.',
  })
  findTotalLandUse() {
    return this.dashboardService.findTotalLandUse();
  }
}
