import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FarmEntity } from '../../farm/entities/farm.entity';
import { ProducerEntity } from '../../producer/entities/producer.entity';
import { CreateHarvestDto } from '../dto/create-harvest.dto';
import { UpdateHarvestDto } from '../dto/update-harvest.dto';
import { HarvestEntity } from '../entities/harvest.entity';
import { HarvestService } from '../harvest.service';
import { HarvestRepository } from '../repositories/harvest.repository';

describe('HarvestService', () => {
  let service: HarvestService;
  let repository: HarvestRepository;

  const mockHarvestRepository = {
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

  const mockHarvest: HarvestEntity = {
    id: '789e0123-e89b-12d3-a456-426614174003',
    name: 'Safra 2023',
    year: 2023,
    farm: mockFarm,
    culturePlanteds: [],
    createdAt: new Date('2023-10-01T00:00:00Z'),
    updatedAt: new Date('2023-10-01T00:00:00Z'),
  };

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestService,
        {
          provide: HarvestRepository,
          useValue: mockHarvestRepository,
        },
      ],
    }).compile();

    service = module.get<HarvestService>(HarvestService);
    repository = module.get<HarvestRepository>(HarvestRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createHarvestDto: CreateHarvestDto = {
      name: 'Safra 2023',
      year: 2023,
      farmId: '456e7890-e89b-12d3-a456-426614174001',
      culturesIds: ['789e0123-e89b-12d3-a456-426614174002'],
    };

    it('should create a harvest successfully', async () => {
      mockHarvestRepository.create.mockResolvedValue(mockHarvest);

      const result = await service.create(createHarvestDto);

      expect(repository.create).toHaveBeenCalledWith(createHarvestDto);
      expect(result).toEqual(mockHarvest);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockHarvestRepository.create.mockRejectedValue(error);

      await expect(service.create(createHarvestDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.create).toHaveBeenCalledWith(createHarvestDto);
    });
  });

  describe('findAll', () => {
    it('should return all harvests', async () => {
      const harvests = [mockHarvest];
      mockHarvestRepository.findAll.mockResolvedValue(harvests);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(harvests);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockHarvestRepository.findAll.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const id = '789e0123-e89b-12d3-a456-426614174003';

    it('should return a harvest by id', async () => {
      mockHarvestRepository.findOne.mockResolvedValue(mockHarvest);

      const result = await service.findOne(id);

      expect(repository.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockHarvest);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockHarvestRepository.findOne.mockRejectedValue(error);

      await expect(service.findOne(id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    const id = '789e0123-e89b-12d3-a456-426614174003';
    const updateHarvestDto: UpdateHarvestDto = {
      name: 'Safra 2024',
      year: 2024,
    };

    it('should update a harvest successfully', async () => {
      const updatedHarvest = { ...mockHarvest, ...updateHarvestDto };
      mockHarvestRepository.update.mockResolvedValue(updatedHarvest);

      const result = await service.update(id, updateHarvestDto);

      expect(repository.update).toHaveBeenCalledWith(id, updateHarvestDto);
      expect(result).toEqual(updatedHarvest);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockHarvestRepository.update.mockRejectedValue(error);

      await expect(service.update(id, updateHarvestDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.update).toHaveBeenCalledWith(id, updateHarvestDto);
    });
  });

  describe('remove', () => {
    const id = '789e0123-e89b-12d3-a456-426614174003';

    it('should remove a harvest successfully when harvest exists', async () => {
      const removeResult = {
        message: `Safra com ID ${id} removida com sucesso`,
      };

      const findOneSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockHarvest);
      mockHarvestRepository.remove.mockResolvedValue(removeResult);

      const result = await service.remove(id);

      expect(findOneSpy).toHaveBeenCalledWith(id);
      expect(repository.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(removeResult);
    });

    it('should throw NotFoundException when harvest does not exist', async () => {
      const findOneSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(null as any);

      await expect(service.remove(id)).rejects.toThrow(
        new NotFoundException(`safra com ID ${id} não encontrada`),
      );

      expect(findOneSpy).toHaveBeenCalledWith(id);
      expect(repository.remove).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      const findOneSpy = jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(error);

      await expect(service.remove(id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(findOneSpy).toHaveBeenCalledWith(id);
    });
  });
});
