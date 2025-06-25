import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { FarmRepository } from './repositories/farm.repository';

@Injectable()
export class FarmService {
  private readonly logger = new Logger(FarmService.name);

  constructor(private readonly farmRepository: FarmRepository) {}

  create(createFarmDto: CreateFarmDto) {
    try {
      this.logger.log('Criando uma nova fazenda', createFarmDto);
      return this.farmRepository.create(createFarmDto);
    } catch (error) {
      this.logger.error('Erro ao criar fazenda', error);
      throw new InternalServerErrorException(
        error?.message || 'Falha ao criar fazenda',
      );
    }
  }

  findAll() {
    try {
      this.logger.log('Buscando todas as fazendas');
      return this.farmRepository.findAll();
    } catch (error) {
      this.logger.error('Erro ao buscar fazendas', error.message);
      throw new InternalServerErrorException(
        error?.message || 'Falha ao buscar fazendas',
      );
    }
  }

  findOne(id: string) {
    try {
      this.logger.log(`Buscando fazenda com ID: ${id}`);
      return this.farmRepository.findOne(id);
    } catch (error) {
      this.logger.error(`Erro ao buscar fazenda com ID ${id}`, error.message);
      throw new InternalServerErrorException(
        error?.message || `Falha ao buscar fazenda com ID ${id}`,
      );
    }
  }

  update(id: string, updateFarmDto: UpdateFarmDto) {
    try {
      this.logger.log(`Atualizando fazenda com ID: ${id}`, updateFarmDto);
      return this.farmRepository.update(id, updateFarmDto);
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar fazenda com ID ${id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error?.message || `Falha ao atualizar fazenda com ID ${id}`,
      );
    }
  }

  remove(id: string) {
    try {
      this.logger.log(`Removendo fazenda com ID: ${id}`);
      const farm = this.farmRepository.findOne(id);
      if (!farm) {
        throw new NotFoundException(`Fazenda com ID ${id} não encontrada`);
      }
      return this.farmRepository.remove(id);
    } catch (error) {
      this.logger.error(`Erro ao remover fazenda com ID ${id}`, error.message);
      throw new InternalServerErrorException(
        error?.message || `Falha ao remover fazenda com ID ${id}`,
      );
    }
  }
}
