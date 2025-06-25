import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { ProducerEntity } from '../entities/producer.entity';
import { ProducerService } from '../producer.service';
import { ProducerRepository } from '../repositories/producer.repository';

describe('ProducerService', () => {
  let service: ProducerService;
  let repository: ProducerRepository;

  const mockProducerRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findOneByCpfCnpj: jest.fn(),
  };

  const mockProducer: ProducerEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    cpfCnpj: '12345678901',
    name: 'João da Silva',
    createdAt: new Date('2023-10-01T00:00:00Z'),
    updatedAt: new Date('2023-10-01T00:00:00Z'),
    deletedAt: null,
    isDeleted: null,
    farms: [],
  };

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: ProducerRepository,
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
    repository = module.get<ProducerRepository>(ProducerRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createProducerDto: CreateProducerDto = {
      cpfCnpj: '12345678901',
      name: 'João da Silva',
    };

    it('should create a producer successfully', async () => {
      mockProducerRepository.findOneByCpfCnpj.mockResolvedValue(null);
      mockProducerRepository.create.mockResolvedValue(mockProducer);

      const result = await service.create(createProducerDto);

      expect(repository.findOneByCpfCnpj).toHaveBeenCalledWith(
        createProducerDto.cpfCnpj,
      );
      expect(repository.create).toHaveBeenCalledWith(createProducerDto);
      expect(result).toEqual(mockProducer);
    });

    it('should throw BadRequestException if producer with CPF/CNPJ already exists', async () => {
      mockProducerRepository.findOneByCpfCnpj.mockResolvedValue(mockProducer);

      await expect(service.create(createProducerDto)).rejects.toThrow(
        new BadRequestException(
          `Produtor com CPF/CNPJ ${createProducerDto.cpfCnpj} já existe.`,
        ),
      );

      expect(repository.findOneByCpfCnpj).toHaveBeenCalledWith(
        createProducerDto.cpfCnpj,
      );
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockProducerRepository.findOneByCpfCnpj.mockRejectedValue(error);

      await expect(service.create(createProducerDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.findOneByCpfCnpj).toHaveBeenCalledWith(
        createProducerDto.cpfCnpj,
      );
    });
  });

  describe('findAll', () => {
    it('should return all producers', async () => {
      const producers = [mockProducer];
      mockProducerRepository.findAll.mockResolvedValue(producers);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(producers);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockProducerRepository.findAll.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';

    it('should return a producer by id', async () => {
      mockProducerRepository.findOne.mockResolvedValue(mockProducer);

      const result = await service.findOne(id);

      expect(repository.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockProducer);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockProducerRepository.findOne.mockRejectedValue(error);

      await expect(service.findOne(id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';
    const updateProducerDto: UpdateProducerDto = {
      name: 'João da Silva Updated',
    };

    it('should update a producer successfully', async () => {
      const updatedProducer = { ...mockProducer, ...updateProducerDto };
      mockProducerRepository.update.mockResolvedValue(updatedProducer);

      const result = await service.update(id, updateProducerDto);

      expect(repository.update).toHaveBeenCalledWith(id, updateProducerDto);
      expect(result).toEqual(updatedProducer);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockProducerRepository.update.mockRejectedValue(error);

      await expect(service.update(id, updateProducerDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.update).toHaveBeenCalledWith(id, updateProducerDto);
    });
  });

  describe('remove', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';

    it('should remove a producer successfully when producer exists', async () => {
      const removeResult = {
        message: `Produtor com id ${id} removido com sucesso`,
      };
      mockProducerRepository.findOne.mockResolvedValue(mockProducer);
      mockProducerRepository.remove.mockResolvedValue(removeResult);

      const result = await service.remove(id);

      expect(repository.findOne).toHaveBeenCalledWith(id);
      expect(repository.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(removeResult);
    });

    it('should throw NotFoundException when producer does not exist', async () => {
      mockProducerRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(
        new NotFoundException(`Produtor com ID ${id} não encontrado.`),
      );

      expect(repository.findOne).toHaveBeenCalledWith(id);
      expect(repository.remove).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockProducerRepository.findOne.mockRejectedValue(error);

      await expect(service.remove(id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.findOne).toHaveBeenCalledWith(id);
    });
  });
});
