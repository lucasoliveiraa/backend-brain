import { Test, TestingModule } from '@nestjs/testing';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { ProducerEntity } from '../entities/producer.entity';
import { ProducerController } from '../producer.controller';
import { ProducerService } from '../producer.service';

describe('ProducerController', () => {
  let controller: ProducerController;
  let service: ProducerService;

  const mockProducerService = {
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

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducerController],
      providers: [
        {
          provide: ProducerService,
          useValue: mockProducerService,
        },
      ],
    }).compile();

    controller = module.get<ProducerController>(ProducerController);
    service = module.get<ProducerService>(ProducerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a producer', async () => {
      const createProducerDto: CreateProducerDto = {
        cpfCnpj: '12345678901',
        name: 'João da Silva',
      };

      mockProducerService.create.mockResolvedValue(mockProducer);

      const result = await controller.create(createProducerDto);

      expect(service.create).toHaveBeenCalledWith(createProducerDto);
      expect(result).toEqual(mockProducer);
    });
  });

  describe('findAll', () => {
    it('should return an array of producers', async () => {
      const producers = [mockProducer];
      mockProducerService.findAll.mockResolvedValue(producers);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(producers);
    });
  });

  describe('findOne', () => {
    it('should return a producer by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockProducerService.findOne.mockResolvedValue(mockProducer);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockProducer);
    });
  });

  describe('update', () => {
    it('should update a producer', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateProducerDto: UpdateProducerDto = {
        name: 'João da Silva Updated',
      };
      const updatedProducer = { ...mockProducer, ...updateProducerDto };

      mockProducerService.update.mockResolvedValue(updatedProducer);

      const result = await controller.update(id, updateProducerDto);

      expect(service.update).toHaveBeenCalledWith(id, updateProducerDto);
      expect(result).toEqual(updatedProducer);
    });
  });

  describe('remove', () => {
    it('should remove a producer', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const removeResult = {
        message: `Produtor com id ${id} removido com sucesso`,
      };

      mockProducerService.remove.mockResolvedValue(removeResult);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(removeResult);
    });
  });
});
