import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { HarvestRepository } from './repositories/harvest.repository';

@Injectable()
export class HarvestService {
  private readonly logger = new Logger(HarvestService.name);

  constructor(private readonly harvestRepository: HarvestRepository) {}

  create(createHarvestDto: CreateHarvestDto) {
    try {
      this.logger.log('Criando uma nova safra', createHarvestDto);
      return this.harvestRepository.create(createHarvestDto);
    } catch (error) {
      this.logger.error('Erro ao criar safra', error.message);
      throw new InternalServerErrorException(
        error?.message || 'Falha ao criar safra',
      );
    }
  }

  findAll() {
    try {
      this.logger.log('Buscando todas as safras');
      return this.harvestRepository.findAll();
    } catch (error) {
      this.logger.error('Erro ao buscar safras', error.message);
      throw new InternalServerErrorException(
        error?.message || 'Falha ao buscar safras',
      );
    }
  }

  findOne(id: string) {
    try {
      this.logger.log(`Buscando safra com ID: ${id}`);
      return this.harvestRepository.findOne(id);
    } catch (error) {
      this.logger.error(`Erro ao buscar safra com ID ${id}`, error.message);
      throw new InternalServerErrorException(
        error?.message || `Falha ao buscar safra com ID ${id}`,
      );
    }
  }

  update(id: string, updateHarvestDto: UpdateHarvestDto) {
    try {
      this.logger.log(`Atualizando safra com ID: ${id}`, updateHarvestDto);
      return this.harvestRepository.update(id, updateHarvestDto);
    } catch (error) {
      this.logger.error(`Erro ao atualizar safra com ID ${id}`, error.message);
      throw new InternalServerErrorException(
        error?.message || `Falha ao atualizar safra com ID ${id}`,
      );
    }
  }

  remove(id: string) {
    try {
      this.logger.log(`Removendo safra com ID: ${id}`);
      const harvest = this.findOne(id);
      if (!harvest) {
        throw new NotFoundException(`safra com ID ${id} não encontrada`);
      }
      return this.harvestRepository.remove(id);
    } catch (error) {
      this.logger.error(`Erro ao remover safra com ID ${id}`, error.message);
      throw new InternalServerErrorException(
        error?.message || `Falha ao remover safra com ID ${id}`,
      );
    }
  }
}
