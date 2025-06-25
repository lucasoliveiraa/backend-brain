import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CulturePlantedEntity } from 'src/modules/harvest/entities/culture-planted.entity';
import { EntityManager } from 'typeorm';
import { CreateFarmDto } from '../dto/create-farm.dto';
import { FarmEntity } from '../entities/farm.entity';

@Injectable()
export class FarmRepository {
  private readonly logger = new Logger(FarmRepository.name);
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(createFarmDto: CreateFarmDto): Promise<FarmEntity> {
    try {
      this.logger.log(
        'Criando fazenda createFarmDto: ' + JSON.stringify(createFarmDto),
      );
      const farm = this.manager.create(FarmEntity, {
        ...createFarmDto,
        producer: { id: createFarmDto.producerId },
      });
      return this.manager.save(farm);
    } catch (error) {
      this.logger.error('[DB]Erro ao criar fazenda', error.message);
      throw new InternalServerErrorException(
        error.message || '[DB]Falha ao criar fazenda',
      );
    }
  }

  async findAll(): Promise<FarmEntity[]> {
    try {
      this.logger.log('[DB]Buscando todas as fazendas');
      return this.manager.find(FarmEntity);
    } catch (error) {
      this.logger.error('[DB]Erro ao buscar fazendas', error.message);
      throw new InternalServerErrorException(
        error.message || '[DB]Falha ao buscar fazendas',
      );
    }
  }

  async findOne(id: string): Promise<FarmEntity> {
    try {
      this.logger.log(`[DB]Buscando fazenda com ID: ${id}`);
      const farm = await this.manager.findOne(FarmEntity, { where: { id } });
      if (!farm) {
        throw new NotFoundException(`[DB]Fazenda com ID ${id} não encontrada`);
      }
      return farm;
    } catch (error) {
      this.logger.error(
        `[DB]Erro ao buscar fazenda com ID ${id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || `[DB]Falha ao buscar fazenda com ID ${id}`,
      );
    }
  }

  async update(
    id: string,
    updateFarmDto: Partial<CreateFarmDto>,
  ): Promise<FarmEntity> {
    try {
      this.logger.log(`[DB]Atualizando fazenda com ID: ${id}`);
      const farm = await this.findOne(id);
      Object.assign(farm, updateFarmDto);
      return this.manager.save(farm);
    } catch (error) {
      this.logger.error(
        `[DB]Erro ao atualizar fazenda com ID ${id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || `[DB]Falha ao atualizar fazenda com ID ${id}`,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      this.logger.log(`[DB]Removendo fazenda com ID: ${id}`);
      await this.manager.delete(FarmEntity, { id });
      this.logger.log(`[DB]Fazenda com ID ${id} removida com sucesso`);
      return { message: `Fazenda com ID ${id} removida com sucesso` };
    } catch (error) {
      this.logger.error(
        `[DB]Erro ao remover fazenda com ID ${id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || `[DB]Falha ao remover fazenda com ID ${id}`,
      );
    }
  }

  async findAllFarmers(): Promise<{ total: number }> {
    try {
      this.logger.log('[DB]Buscando total de fazendas cadastradas');
      const totalFarms = await this.manager.count(FarmEntity);
      return { total: totalFarms };
    } catch (error) {
      this.logger.error(
        '[DB]Erro ao buscar total de fazendas cadastradas',
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || '[DB]Falha ao buscar total de fazendas cadastradas',
      );
    }
  }

  async findAllHectares(): Promise<{ total: number }> {
    try {
      this.logger.log('[DB]Buscando total de hectares cadastrados');
      const totalHectares = await this.manager
        .createQueryBuilder(FarmEntity, 'farm')
        .select('SUM(farm.areaTotal)', 'total')
        .getRawOne();
      return { total: Number(totalHectares.total) || 0 };
    } catch (error) {
      this.logger.error(
        '[DB]Erro ao buscar total de hectares cadastrados',
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || '[DB]Falha ao buscar total de hectares cadastrados',
      );
    }
  }

  async findFarmersByState(): Promise<{ state: string; total: number }[]> {
    try {
      this.logger.log('[DB]Buscando total de fazendas por estado');
      const farmersByState = await this.manager
        .createQueryBuilder(FarmEntity, 'farm')
        .select('farm.state', 'state')
        .addSelect('COUNT(farm.id)', 'total')
        .groupBy('farm.state')
        .getRawMany();

      return farmersByState.map((item) => ({
        state: item.state,
        total: Number(item.total),
      }));
    } catch (error) {
      this.logger.error(
        '[DB]Erro ao buscar total de fazendas por estado',
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || '[DB]Falha ao buscar total de fazendas por estado',
      );
    }
  }

  async findTotalCulturesDistributed(): Promise<
    { culture: string; total: number }[]
  > {
    try {
      this.logger.log('[DB]Buscando total de culturas distribuídas');
      const totalCultures = await this.manager
        .createQueryBuilder(CulturePlantedEntity, 'cp')
        .leftJoin('cp.culture', 'culture')
        .select('culture.name', 'culture')
        .addSelect('COUNT(*)', 'total')
        .groupBy('culture.name')
        .getRawMany();

      return totalCultures.map((item) => ({
        culture: item.culture,
        total: Number(item.total),
      }));
    } catch (error) {
      this.logger.error(
        '[DB]Erro ao buscar total de culturas distribuídas',
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || '[DB]Falha ao buscar total de culturas distribuídas',
      );
    }
  }

  async findTotalLandUse(): Promise<Record<string, number>> {
    try {
      this.logger.log('[DB]Buscando total de uso da terra');
      const totalLandUse = await this.manager
        .createQueryBuilder(FarmEntity, 'farm')
        .select('SUM(farm.areaAgricultural)', 'agricultural')
        .addSelect('SUM(farm.areaVegetation)', 'vegetation')
        .getRawOne();

      return {
        agricultural: Number(totalLandUse.agricultural) || 0,
        vegetation: Number(totalLandUse.vegetation) || 0,
      };
    } catch (error) {
      this.logger.error(
        '[DB]Erro ao buscar total de uso da terra',
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || '[DB]Falha ao buscar total de uso da terra',
      );
    }
  }
}
