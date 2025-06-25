import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProducerEntity } from '../../producer/entities/producer.entity';
import { CreateFarmDto } from '../dto/create-farm.dto';
import { UpdateFarmDto } from '../dto/update-farm.dto';
import { FarmEntity } from '../entities/farm.entity';
import { FarmService } from '../farm.service';
import { FarmRepository } from '../repositories/farm.repository';

describe('FarmService', () => {
  let service: FarmService;
  let repository: FarmRepository;

  const mockFarmRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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

  const mockFarm: FarmEntity = {
    id: '456e7890-e89b-12d3-a456-426614174001',
    name: 'Fazenda Boa Vista',
    city: 'Sorocaba',
    state: 'SP',
    areaTotal: 130.0,
    areaAgricultural: 100.0,
    areaVegetation: 30.0,
    producer: mockProducer,
    harvests: [],
    createdAt: new Date('2023-10-01T00:00:00Z'),
    updatedAt: new Date('2023-10-01T00:00:00Z'),
  };

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmService,
        {
          provide: FarmRepository,
          useValue: mockFarmRepository,
        },
      ],
    }).compile();

    service = module.get<FarmService>(FarmService);
    repository = module.get<FarmRepository>(FarmRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createFarmDto: CreateFarmDto = {
      name: 'Fazenda Boa Vista',
      city: 'Sorocaba',
      state: 'SP',
      areaTotal: 130.0,
      areaAgricultural: 100.0,
      areaVegetation: 30.0,
      producerId: '123e4567-e89b-12d3-a456-426614174000',
    };

    it('should create a farm successfully', async () => {
      mockFarmRepository.create.mockResolvedValue(mockFarm);

      const result = await service.create(createFarmDto);

      expect(repository.create).toHaveBeenCalledWith(createFarmDto);
      expect(result).toEqual(mockFarm);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockFarmRepository.create.mockRejectedValue(error);

      await expect(service.create(createFarmDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.create).toHaveBeenCalledWith(createFarmDto);
    });
  });

  describe('findAll', () => {
    it('should return all farms', async () => {
      const farms = [mockFarm];
      mockFarmRepository.findAll.mockResolvedValue(farms);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(farms);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockFarmRepository.findAll.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const id = '456e7890-e89b-12d3-a456-426614174001';

    it('should return a farm by id', async () => {
      mockFarmRepository.findOne.mockResolvedValue(mockFarm);

      const result = await service.findOne(id);

      expect(repository.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockFarm);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockFarmRepository.findOne.mockRejectedValue(error);

      await expect(service.findOne(id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    const id = '456e7890-e89b-12d3-a456-426614174001';
    const updateFarmDto: UpdateFarmDto = {
      name: 'Fazenda Boa Vista Updated',
      areaTotal: 140.0,
    };

    it('should update a farm successfully', async () => {
      const updatedFarm = { ...mockFarm, ...updateFarmDto };
      mockFarmRepository.update.mockResolvedValue(updatedFarm);

      const result = await service.update(id, updateFarmDto);

      expect(repository.update).toHaveBeenCalledWith(id, updateFarmDto);
      expect(result).toEqual(updatedFarm);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockFarmRepository.update.mockRejectedValue(error);

      await expect(service.update(id, updateFarmDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.update).toHaveBeenCalledWith(id, updateFarmDto);
    });
  });

  describe('remove', () => {
    const id = '456e7890-e89b-12d3-a456-426614174001';

    it('should remove a farm successfully when farm exists', async () => {
      const removeResult = {
        message: `Fazenda com ID ${id} removida com sucesso`,
      };
      mockFarmRepository.findOne.mockResolvedValue(mockFarm);
      mockFarmRepository.remove.mockResolvedValue(removeResult);

      const result = await service.remove(id);

      expect(repository.findOne).toHaveBeenCalledWith(id);
      expect(repository.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(removeResult);
    });

    it('should throw NotFoundException when farm does not exist', async () => {
      mockFarmRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(
        new NotFoundException(`Fazenda com ID ${id} não encontrada`),
      );

      expect(repository.findOne).toHaveBeenCalledWith(id);
      expect(repository.remove).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockFarmRepository.findOne.mockRejectedValue(error);

      await expect(service.remove(id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.findOne).toHaveBeenCalledWith(id);
    });
  });
});
