import { Test, TestingModule } from '@nestjs/testing';
import { FarmEntity } from '../../farm/entities/farm.entity';
import { ProducerEntity } from '../../producer/entities/producer.entity';
import { CreateHarvestDto } from '../dto/create-harvest.dto';
import { UpdateHarvestDto } from '../dto/update-harvest.dto';
import { HarvestEntity } from '../entities/harvest.entity';
import { HarvestController } from '../harvest.controller';
import { HarvestService } from '../harvest.service';

describe('HarvestController', () => {
  let controller: HarvestController;
  let service: HarvestService;

  const mockHarvestService = {
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
      controllers: [HarvestController],
      providers: [
        {
          provide: HarvestService,
          useValue: mockHarvestService,
        },
      ],
    }).compile();

    controller = module.get<HarvestController>(HarvestController);
    service = module.get<HarvestService>(HarvestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a harvest', async () => {
      const createHarvestDto: CreateHarvestDto = {
        name: 'Safra 2023',
        year: 2023,
        farmId: '456e7890-e89b-12d3-a456-426614174001',
        culturesIds: ['789e0123-e89b-12d3-a456-426614174002'],
      };

      mockHarvestService.create.mockResolvedValue(mockHarvest);

      const result = await controller.create(createHarvestDto);

      expect(service.create).toHaveBeenCalledWith(createHarvestDto);
      expect(result).toEqual(mockHarvest);
    });
  });

  describe('findAll', () => {
    it('should return an array of harvests', async () => {
      const harvests = [mockHarvest];
      mockHarvestService.findAll.mockResolvedValue(harvests);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(harvests);
    });
  });

  describe('findOne', () => {
    it('should return a harvest by id', async () => {
      const id = '789e0123-e89b-12d3-a456-426614174003';
      mockHarvestService.findOne.mockResolvedValue(mockHarvest);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockHarvest);
    });
  });

  describe('update', () => {
    it('should update a harvest', async () => {
      const id = '789e0123-e89b-12d3-a456-426614174003';
      const updateHarvestDto: UpdateHarvestDto = {
        name: 'Safra 2024',
        year: 2024,
      };
      const updatedHarvest = { ...mockHarvest, ...updateHarvestDto };

      mockHarvestService.update.mockResolvedValue(updatedHarvest);

      const result = await controller.update(id, updateHarvestDto);

      expect(service.update).toHaveBeenCalledWith(id, updateHarvestDto);
      expect(result).toEqual(updatedHarvest);
    });
  });

  describe('remove', () => {
    it('should remove a harvest', async () => {
      const id = '789e0123-e89b-12d3-a456-426614174003';
      const removeResult = {
        message: `Safra com ID ${id} removida com sucesso`,
      };

      mockHarvestService.remove.mockResolvedValue(removeResult);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(removeResult);
    });
  });
});
