import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { ProducerRepository } from '../repositories/producer.repository';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);

  constructor(private readonly producerRepository: ProducerRepository) {}

  async create(createProducerDto: CreateProducerDto) {
    try {
      const existingProducer = await this.producerRepository.findOneByCpfCnpj(
        createProducerDto.cpfCnpj,
      );

      if (existingProducer) {
        this.logger.warn(
          `Produtor com CPF/CNPJ ${createProducerDto.cpfCnpj} já existe.`,
        );
        throw new BadRequestException(
          `Produtor com CPF/CNPJ ${createProducerDto.cpfCnpj} já existe.`,
        );
      }

      return this.producerRepository.create(createProducerDto);
    } catch (error) {
      this.logger.error(
        `Erro ao criar produtor: ${createProducerDto.cpfCnpj}`,
        error,
      );
      throw new InternalServerErrorException(
        error?.message || 'Falha ao criar produtor',
      );
    }
  }

  findAll() {
    try {
      this.logger.log('Buscando todos os produtores');
      return this.producerRepository.findAll();
    } catch (error) {
      this.logger.error('Erro ao buscar todos os produtores', error);
      throw new InternalServerErrorException(
        error?.message || 'Falha ao buscar todos os produtores',
      );
    }
  }

  findOne(id: string) {
    try {
      this.logger.log(`Buscando produtor com ID: ${id}`);
      return this.producerRepository.findOne(id);
    } catch (error) {
      this.logger.error(`Erro ao buscar produtor com ID ${id}`, error);
      throw new InternalServerErrorException(
        error?.message || `Falha ao buscar produtor com ID ${id}`,
      );
    }
  }

  update(id: string, updateProducerDto: UpdateProducerDto) {
    try {
      this.logger.log(`Atualizando produtor com ID: ${id}`, updateProducerDto);
      return this.producerRepository.update(id, updateProducerDto);
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar produtor com ID ${id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error?.message || `Falha ao atualizar produtor com ID ${id}`,
      );
    }
  }

  remove(id: string) {
    try {
      this.logger.log(`Removendo produtor com ID: ${id}`);
      const producer = this.producerRepository.findOne(id);
      if (!producer) {
        this.logger.warn(`Produtor com ID ${id} não encontrado.`);
        throw new NotFoundException(`Produtor com ID ${id} não encontrado.`);
      }
      return this.producerRepository.remove(id);
    } catch (error) {
      this.logger.error(`Erro ao remover produtor com ID ${id}`, error.message);
      throw new InternalServerErrorException(
        error?.message || `Falha ao remover produtor com ID ${id}`,
      );
    }
  }
}
