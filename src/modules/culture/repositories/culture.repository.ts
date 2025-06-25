import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateCultureDto } from '../dto/create-culture.dto';
import { CultureEntity } from '../entities/culture.entity';

export class CultureRepository {
  private readonly logger = new Logger(CultureRepository.name);
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(createCultureDto: CreateCultureDto): Promise<CultureEntity> {
    try {
      this.logger.log(
        '[DB]Criando cultura createCultureDto: ' +
          JSON.stringify(createCultureDto),
      );
      const culture = this.manager.create(CultureEntity, createCultureDto);
      return await this.manager.save(culture);
    } catch (error) {
      this.logger.error('[DB]Erro ao criar cultura', error.message);
      throw new InternalServerErrorException(
        error.message || '[DB]Falha ao criar cultura',
      );
    }
  }

  async findAll(): Promise<CultureEntity[]> {
    try {
      this.logger.log('[DB]Buscando todas as culturas');
      return await this.manager.find(CultureEntity);
    } catch (error) {
      this.logger.error('[DB]Erro ao buscar culturas', error.message);
      throw new InternalServerErrorException(
        error.message || '[DB]Falha ao buscar culturas',
      );
    }
  }

  async findOne(id: string): Promise<CultureEntity> {
    try {
      this.logger.log(`[DB]Buscando cultura com ID: ${id}`);
      const culture = await this.manager.findOne(CultureEntity, {
        where: { id },
      });
      if (!culture) {
        throw new InternalServerErrorException(
          `[DB]Cultura com ID ${id} não encontrada`,
        );
      }
      return culture;
    } catch (error) {
      this.logger.error(
        `[DB]Erro ao buscar cultura com ID ${id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || `[DB]Falha ao buscar cultura com ID ${id}`,
      );
    }
  }

  async update(
    id: string,
    updateCultureDto: Partial<CreateCultureDto>,
  ): Promise<CultureEntity> {
    try {
      this.logger.log(
        `[DB]Atualizando cultura com ID: ${id}`,
        updateCultureDto,
      );
      const culture = await this.findOne(id);
      if (!culture) {
        throw new NotFoundException(
          `[DB]Cultura com ID ${id} não encontrada para atualização`,
        );
      }
      Object.assign(culture, updateCultureDto);
      return await this.manager.save(culture);
    } catch (error) {
      this.logger.error(
        `[DB]Erro ao atualizar cultura com ID ${id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || `[DB]Falha ao atualizar cultura com ID ${id}`,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      this.logger.log(`[DB]Removendo cultura com ID: ${id}`);
      await this.manager.delete(CultureEntity, { id });
      return { message: `[DB]Cultura com ID ${id} removida com sucesso` };
    } catch (error) {
      this.logger.error(
        `[DB]Erro ao remover cultura com ID ${id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || `[DB]Falha ao remover cultura com ID ${id}`,
      );
    }
  }
}
