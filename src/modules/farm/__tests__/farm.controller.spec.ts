import { Test, TestingModule } from '@nestjs/testing';
import { ProducerEntity } from '../../producer/entities/producer.entity';
import { CreateFarmDto } from '../dto/create-farm.dto';
import { UpdateFarmDto } from '../dto/update-farm.dto';
import { FarmEntity } from '../entities/farm.entity';
import { FarmController } from '../farm.controller';
import { FarmService } from '../farm.service';

describe('FarmController', () => {
  let controller: FarmController;
  let service: FarmService;

  const mockFarmService = {
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
      controllers: [FarmController],
      providers: [
        {
          provide: FarmService,
          useValue: mockFarmService,
        },
      ],
    }).compile();

    controller = module.get<FarmController>(FarmController);
    service = module.get<FarmService>(FarmService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a farm', async () => {
      const createFarmDto: CreateFarmDto = {
        name: 'Fazenda Boa Vista',
        city: 'Sorocaba',
        state: 'SP',
        areaTotal: 130.0,
        areaAgricultural: 100.0,
        areaVegetation: 30.0,
        producerId: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockFarmService.create.mockResolvedValue(mockFarm);

      const result = await controller.create(createFarmDto);

      expect(service.create).toHaveBeenCalledWith(createFarmDto);
      expect(result).toEqual(mockFarm);
    });
  });

  describe('findAll', () => {
    it('should return an array of farms', async () => {
      const farms = [mockFarm];
      mockFarmService.findAll.mockResolvedValue(farms);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(farms);
    });
  });

  describe('findOne', () => {
    it('should return a farm by id', async () => {
      const id = '456e7890-e89b-12d3-a456-426614174001';
      mockFarmService.findOne.mockResolvedValue(mockFarm);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockFarm);
    });
  });

  describe('update', () => {
    it('should update a farm', async () => {
      const id = '456e7890-e89b-12d3-a456-426614174001';
      const updateFarmDto: UpdateFarmDto = {
        name: 'Fazenda Boa Vista Updated',
        areaTotal: 140.0,
      };
      const updatedFarm = { ...mockFarm, ...updateFarmDto };

      mockFarmService.update.mockResolvedValue(updatedFarm);

      const result = await controller.update(id, updateFarmDto);

      expect(service.update).toHaveBeenCalledWith(id, updateFarmDto);
      expect(result).toEqual(updatedFarm);
    });
  });

  describe('remove', () => {
    it('should remove a farm', async () => {
      const id = '456e7890-e89b-12d3-a456-426614174001';
      const removeResult = {
        message: `Fazenda com ID ${id} removida com sucesso`,
      };

      mockFarmService.remove.mockResolvedValue(removeResult);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(removeResult);
    });
  });
});
