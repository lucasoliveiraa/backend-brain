import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CultureEntity } from 'src/modules/culture/entities/culture.entity';
import { EntityManager } from 'typeorm';
import { CreateHarvestDto } from '../dto/create-harvest.dto';
import { UpdateHarvestDto } from '../dto/update-harvest.dto';
import { CulturePlantedEntity } from '../entities/culture-planted.entity';
import { HarvestEntity } from '../entities/harvest.entity';

export class HarvestRepository {
  private readonly logger = new Logger(HarvestRepository.name);
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(createHarvestDto: CreateHarvestDto): Promise<HarvestEntity> {
    try {
      this.logger.log(
        '[DB]Criando safra com DTO: ' + JSON.stringify(createHarvestDto),
      );

      const { name, year, farmId, culturesIds } = createHarvestDto;

      const culturesPlanteds = culturesIds.map((id) => {
        const cp = new CulturePlantedEntity();
        cp.culture = { id } as CultureEntity;
        return cp;
      });

      const safra = this.manager.create(HarvestEntity, {
        name,
        year,
        farm: { id: farmId },
        culturePlanteds: culturesPlanteds,
      });

      return await this.manager.save(safra);
    } catch (error) {
      this.logger.error('[DB]Erro ao criar safra', error.message);
      throw new InternalServerErrorException(
        error.message || '[DB]Falha ao criar safra',
      );
    }
  }

  async findAll(): Promise<HarvestEntity[]> {
    try {
      this.logger.log('[DB]Buscando todas as safras');
      return await this.manager.find(HarvestEntity);
    } catch (error) {
      this.logger.error('[DB]Erro ao buscar safras', error.message);
      throw new InternalServerErrorException(
        error.message || '[DB]Falha ao buscar safras',
      );
    }
  }

  async findOne(id: string): Promise<HarvestEntity> {
    try {
      this.logger.log(`[DB]Buscando safra com ID: ${id}`);
      const harvest = await this.manager.findOne(HarvestEntity, {
        where: { id },
      });
      if (!harvest) {
        throw new NotFoundException(`[DB]Safra com ID ${id} não encontrada`);
      }
      return harvest;
    } catch (error) {
      this.logger.error(`[DB]Erro ao buscar safra com ID ${id}`, error.message);
      throw new InternalServerErrorException(
        error.message || `[DB]Falha ao buscar safra com ID ${id}`,
      );
    }
  }

  async update(
    id: string,
    updateHarvestDto: Partial<UpdateHarvestDto>,
  ): Promise<HarvestEntity> {
    try {
      this.logger.log(
        `[DB]Atualizando safra com ID: ${id} updateHarvestDto: ${JSON.stringify(updateHarvestDto)}`,
      );
      const harvest = await this.findOne(id);
      if (!harvest) {
        throw new NotFoundException(`[DB]Safra com ID ${id} não encontrada`);
      }
      Object.assign(harvest, updateHarvestDto);
      return await this.manager.save(harvest);
    } catch (error) {
      this.logger.error(
        `[DB]Erro ao atualizar safra com ID ${id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || `[DB]Falha ao atualizar safra com ID ${id}`,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      this.logger.log(`[DB]Removendo safra com ID: ${id}`);
      await this.manager.delete(HarvestEntity, { id });
      this.logger.log(`[DB]Safra com ID ${id} removida com sucesso`);
      return { message: `Safra com ID ${id} removida com sucesso` };
    } catch (error) {
      this.logger.error(
        `[DB]Erro ao remover safra com ID ${id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || `[DB]Falha ao remover safra com ID ${id}`,
      );
    }
  }
}
