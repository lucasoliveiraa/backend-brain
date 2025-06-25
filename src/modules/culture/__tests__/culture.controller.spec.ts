import { Test, TestingModule } from '@nestjs/testing';
import { CultureController } from '../culture.controller';
import { CultureService } from '../culture.service';
import { CreateCultureDto } from '../dto/create-culture.dto';
import { UpdateCultureDto } from '../dto/update-culture.dto';
import { CultureEntity } from '../entities/culture.entity';

describe('CultureController', () => {
  let controller: CultureController;
  let service: CultureService;

  const mockCultureService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockCulture: CultureEntity = {
    id: '789e0123-e89b-12d3-a456-426614174002',
    name: 'Soja',
    culturePlanteds: [],
  };

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CultureController],
      providers: [
        {
          provide: CultureService,
          useValue: mockCultureService,
        },
      ],
    }).compile();

    controller = module.get<CultureController>(CultureController);
    service = module.get<CultureService>(CultureService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a culture', async () => {
      const createCultureDto: CreateCultureDto = {
        name: 'Soja',
      };

      mockCultureService.create.mockResolvedValue(mockCulture);

      const result = await controller.create(createCultureDto);

      expect(service.create).toHaveBeenCalledWith(createCultureDto);
      expect(result).toEqual(mockCulture);
    });
  });

  describe('findAll', () => {
    it('should return an array of cultures', async () => {
      const cultures = [mockCulture];
      mockCultureService.findAll.mockResolvedValue(cultures);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(cultures);
    });
  });

  describe('findOne', () => {
    it('should return a culture by id', async () => {
      const id = '789e0123-e89b-12d3-a456-426614174002';
      mockCultureService.findOne.mockResolvedValue(mockCulture);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockCulture);
    });
  });

  describe('update', () => {
    it('should update a culture', async () => {
      const id = '789e0123-e89b-12d3-a456-426614174002';
      const updateCultureDto: UpdateCultureDto = {
        name: 'Milho',
      };
      const updatedCulture = { ...mockCulture, ...updateCultureDto };

      mockCultureService.update.mockResolvedValue(updatedCulture);

      const result = await controller.update(id, updateCultureDto);

      expect(service.update).toHaveBeenCalledWith(id, updateCultureDto);
      expect(result).toEqual(updatedCulture);
    });
  });

  describe('remove', () => {
    it('should remove a culture', async () => {
      const id = '789e0123-e89b-12d3-a456-426614174002';
      const removeResult = {
        message: `Cultura com ID ${id} removida com sucesso`,
      };

      mockCultureService.remove.mockResolvedValue(removeResult);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(removeResult);
    });
  });
});
