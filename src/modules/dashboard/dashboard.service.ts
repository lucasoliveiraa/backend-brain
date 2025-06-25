import { Injectable, Logger } from '@nestjs/common';
import { FarmRepository } from '../farm/repositories/farm.repository';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private readonly farmRepository: FarmRepository) {}

  async findAllFarmers(): Promise<{ total: number }> {
    try {
      this.logger.log('Buscando total de fazendas cadastradas');
      const totalFarms = await this.farmRepository.findAllFarmers();
      return totalFarms;
    } catch (error) {
      this.logger.error('Erro ao buscar total de fazendas cadastradas', error);
      throw new Error(
        error?.message || 'Falha ao buscar total de fazendas cadastradas',
      );
    }
  }

  async findAllHectares(): Promise<{ total: number }> {
    try {
      this.logger.log('Buscando total de hectares cadastrados');
      const totalHectares = await this.farmRepository.findAllHectares();
      return totalHectares;
    } catch (error) {
      this.logger.error('Erro ao buscar total de hectares cadastrados', error);
      throw new Error(
        error?.message || 'Falha ao buscar total de hectares cadastrados',
      );
    }
  }

  async findFarmersByState(): Promise<{ state: string; total: number }[]> {
    try {
      this.logger.log('Buscando total de fazendas por estado');
      const farmersByState = await this.farmRepository.findFarmersByState();
      return farmersByState;
    } catch (error) {
      this.logger.error('Erro ao buscar total de fazendas por estado', error);
      throw new Error(
        error?.message || 'Falha ao buscar total de fazendas por estado',
      );
    }
  }

  async findTotalCulturesDistributed(): Promise<
    { culture: string; total: number }[]
  > {
    try {
      this.logger.log('Buscando total de culturas distribuídas');
      const totalCultures =
        await this.farmRepository.findTotalCulturesDistributed();
      return totalCultures;
    } catch (error) {
      this.logger.error('Erro ao buscar total de culturas distribuídas', error);
      throw new Error(
        error?.message || 'Falha ao buscar total de culturas distribuídas',
      );
    }
  }

  async findTotalLandUse(): Promise<Record<string, number>> {
    try {
      this.logger.log('Buscando total de uso da terra');
      const totalLandUse = await this.farmRepository.findTotalLandUse();
      return totalLandUse;
    } catch (error) {
      this.logger.error('Erro ao buscar total de uso da terra', error);
      throw new Error(
        error?.message || 'Falha ao buscar total de uso da terra',
      );
    }
  }
}
