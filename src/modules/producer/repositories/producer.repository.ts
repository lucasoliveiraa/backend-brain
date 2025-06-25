import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { ProducerEntity } from '../entities/producer.entity';

@Injectable()
export class ProducerRepository {
  private readonly logger = new Logger(ProducerRepository.name);
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(createProducerDto: CreateProducerDto): Promise<ProducerEntity> {
    try {
      this.logger.log(
        '[DB]Criando produtor createProducerDto: ' +
          JSON.stringify(createProducerDto),
      );
      const producer = this.manager.create(ProducerEntity, createProducerDto);
      return this.manager.save(producer);
    } catch (error) {
      this.logger.error('[DB]Erro ao criar produtor', error.message);
      throw new InternalServerErrorException(
        error.message || '[DB]Falha ao criar produtor',
      );
    }
  }

  async findAll(): Promise<ProducerEntity[]> {
    try {
      this.logger.log('[DB]Buscando todos os produtores');
      return this.manager.find(ProducerEntity);
    } catch (error) {
      this.logger.error('[DB]Erro ao buscar produtores', error.message);
      throw new InternalServerErrorException(
        error.message || '[DB]Falha ao buscar produtores',
      );
    }
  }

  async findOne(id: string): Promise<ProducerEntity> {
    try {
      this.logger.log(`[DB]Buscando produtor com ID: ${id}`);
      const producer = await this.manager.findOne(ProducerEntity, {
        where: { id },
      });
      if (!producer) {
        throw new NotFoundException(`[DB]Produtor com id ${id} não encontrado`);
      }
      return producer;
    } catch (error) {
      this.logger.error(
        `[DB]Erro ao buscar produtor com id ${id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || `[DB]Falha ao buscar produtor com id ${id}`,
      );
    }
  }

  async update(
    id: string,
    updateProducerDto: Partial<CreateProducerDto>,
  ): Promise<ProducerEntity> {
    try {
      this.logger.log(
        `[DB]Atualizando produtor com id: ${id} updateProducerDto: ${JSON.stringify(updateProducerDto)}`,
      );
      const producer = await this.findOne(id);
      Object.assign(producer, updateProducerDto);
      return this.manager.save(producer);
    } catch (error) {
      this.logger.error(
        `[DB]Erro ao atualizar produtor com id ${id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || `[DB]Falha ao atualizar produtor com id ${id}`,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      this.logger.log(`[DB]Removendo produtor com id: ${id}`);
      await this.manager.update(ProducerEntity, id, {
        deletedAt: new Date(),
        isDeleted: true,
      });
      return { message: `Produtor com id ${id} removido com sucesso` };
    } catch (error) {
      this.logger.error(
        `[DB]Erro ao remover produtor com id ${id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || `[DB]Falha ao remover produtor com id ${id}`,
      );
    }
  }

  async findOneByCpfCnpj(cpfCnpj: string): Promise<ProducerEntity | null> {
    try {
      this.logger.log(`[DB]Buscando produtor com CPF/CNPJ: ${cpfCnpj}`);
      return this.manager.findOne(ProducerEntity, {
        where: { cpfCnpj },
        withDeleted: true,
      });
    } catch (error) {
      this.logger.error(
        `[DB]Erro ao buscar produtor com CPF/CNPJ ${cpfCnpj}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || `[DB]Falha ao buscar produtor com CPF/CNPJ ${cpfCnpj}`,
      );
    }
  }
}
