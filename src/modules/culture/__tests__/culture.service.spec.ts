import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CultureService } from '../culture.service';
import { CreateCultureDto } from '../dto/create-culture.dto';
import { UpdateCultureDto } from '../dto/update-culture.dto';
import { CultureEntity } from '../entities/culture.entity';
import { CultureRepository } from '../repositories/culture.repository';

describe('CultureService', () => {
  let service: CultureService;
  let repository: CultureRepository;

  const mockCultureRepository = {
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
      providers: [
        CultureService,
        {
          provide: CultureRepository,
          useValue: mockCultureRepository,
        },
      ],
    }).compile();

    service = module.get<CultureService>(CultureService);
    repository = module.get<CultureRepository>(CultureRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCultureDto: CreateCultureDto = {
      name: 'Soja',
    };

    it('should create a culture successfully', async () => {
      mockCultureRepository.create.mockResolvedValue(mockCulture);

      const result = await service.create(createCultureDto);

      expect(repository.create).toHaveBeenCalledWith(createCultureDto);
      expect(result).toEqual(mockCulture);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockCultureRepository.create.mockRejectedValue(error);

      await expect(service.create(createCultureDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.create).toHaveBeenCalledWith(createCultureDto);
    });
  });

  describe('findAll', () => {
    it('should return all cultures', async () => {
      const cultures = [mockCulture];
      mockCultureRepository.findAll.mockResolvedValue(cultures);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(cultures);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockCultureRepository.findAll.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const id = '789e0123-e89b-12d3-a456-426614174002';

    it('should return a culture by id', async () => {
      mockCultureRepository.findOne.mockResolvedValue(mockCulture);

      const result = await service.findOne(id);

      expect(repository.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockCulture);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockCultureRepository.findOne.mockRejectedValue(error);

      await expect(service.findOne(id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    const id = '789e0123-e89b-12d3-a456-426614174002';
    const updateCultureDto: UpdateCultureDto = {
      name: 'Milho',
    };

    it('should update a culture successfully', async () => {
      const updatedCulture = { ...mockCulture, ...updateCultureDto };
      mockCultureRepository.update.mockResolvedValue(updatedCulture);

      const result = await service.update(id, updateCultureDto);

      expect(repository.update).toHaveBeenCalledWith(id, updateCultureDto);
      expect(result).toEqual(updatedCulture);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockCultureRepository.update.mockRejectedValue(error);

      await expect(service.update(id, updateCultureDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.update).toHaveBeenCalledWith(id, updateCultureDto);
    });
  });

  describe('remove', () => {
    const id = '789e0123-e89b-12d3-a456-426614174002';

    it('should remove a culture successfully when culture exists', async () => {
      const removeResult = {
        message: `Cultura com ID ${id} removida com sucesso`,
      };
      mockCultureRepository.findOne.mockResolvedValue(mockCulture);
      mockCultureRepository.remove.mockResolvedValue(removeResult);

      const result = await service.remove(id);

      expect(repository.findOne).toHaveBeenCalledWith(id);
      expect(repository.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(removeResult);
    });

    it('should throw NotFoundException when culture does not exist', async () => {
      mockCultureRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(
        new NotFoundException(`Cultura com ID ${id} não encontrada`),
      );

      expect(repository.findOne).toHaveBeenCalledWith(id);
      expect(repository.remove).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const error = new Error('Database error');
      mockCultureRepository.findOne.mockRejectedValue(error);

      await expect(service.remove(id)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
