import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCultureDto } from './dto/create-culture.dto';
import { UpdateCultureDto } from './dto/update-culture.dto';
import { CultureRepository } from './repositories/culture.repository';

@Injectable()
export class CultureService {
  private readonly logger = new Logger(CultureService.name);

  constructor(private readonly cultureRepository: CultureRepository) {}

  create(createCultureDto: CreateCultureDto) {
    try {
      this.logger.log('Criando uma nova cultura', createCultureDto);
      return this.cultureRepository.create(createCultureDto);
    } catch (error) {
      this.logger.error('Erro ao criar cultura', error.message);
      throw new InternalServerErrorException(
        error?.message || 'Falha ao criar cultura',
      );
    }
  }

  findAll() {
    try {
      this.logger.log('Buscando todas as culturas');
      return this.cultureRepository.findAll();
    } catch (error) {
      this.logger.error('Erro ao buscar culturas', error.message);
      throw new InternalServerErrorException(
        error?.message || 'Falha ao buscar culturas',
      );
    }
  }

  findOne(id: string) {
    try {
      this.logger.log(`Buscando cultura com ID: ${id}`);
      return this.cultureRepository.findOne(id);
    } catch (error) {
      this.logger.error(`Erro ao buscar cultura com ID ${id}`, error.message);
      throw new InternalServerErrorException(
        error?.message || `Falha ao buscar cultura com ID ${id}`,
      );
    }
  }

  update(id: string, updateCultureDto: UpdateCultureDto) {
    try {
      this.logger.log(`Atualizando cultura com ID: ${id}`, updateCultureDto);
      return this.cultureRepository.update(id, updateCultureDto);
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar cultura com ID ${id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error?.message || `Falha ao atualizar cultura com ID ${id}`,
      );
    }
  }

  remove(id: string) {
    try {
      this.logger.log(`Removendo cultura com ID: ${id}`);
      const culture = this.cultureRepository.findOne(id);
      if (!culture) {
        throw new NotFoundException(`Cultura com ID ${id} não encontrada`);
      }
      return this.cultureRepository.remove(id);
    } catch (error) {
      this.logger.error(`Erro ao remover cultura com ID ${id}`, error.message);
      throw new InternalServerErrorException(
        error?.message || `Falha ao remover cultura com ID ${id}`,
      );
    }
  }
}
