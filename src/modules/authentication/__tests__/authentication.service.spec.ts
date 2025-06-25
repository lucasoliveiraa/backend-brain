import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from '../../user/dto/signin.dto';
import { SignUpDto } from '../../user/dto/signup.dto';
import { UserEntity } from '../../user/entities/user.entity';
import { UserRepository } from '../../user/repositories/user.repository';
import { AuthenticationService } from '../authentication.service';

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockUser: UserEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'João da Silva',
    email: 'joao@email.com',
    password: '$2b$12$hashedpassword',
    createdAt: new Date('2023-10-01T00:00:00Z'),
    updatedAt: new Date('2023-10-01T00:00:00Z'),
  };

  const mockAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    const signInDto: SignInDto = {
      email: 'joao@email.com',
      password: 'senha123456',
    };

    it('should sign in successfully with valid credentials', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(mockAccessToken);

      const result = await service.signIn(signInDto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(signInDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInDto.password,
        mockUser.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({ accessToken: mockAccessToken });
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials.'),
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(signInDto.email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials.'),
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(signInDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInDto.password,
        mockUser.password,
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
      name: 'João da Silva',
      email: 'joao@email.com',
      password: 'senha123456',
    };

    it('should sign up successfully with valid data', async () => {
      const hashedPassword = '$2b$12$hashedpassword';
      const newUser = { ...mockUser, password: hashedPassword };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(newUser);
      mockJwtService.signAsync.mockResolvedValue(mockAccessToken);

      const result = await service.signUp(signUpDto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(signUpDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 12);
      expect(userRepository.create).toHaveBeenCalledWith({
        name: signUpDto.name,
        email: signUpDto.email,
        password: hashedPassword,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: newUser.id,
        email: newUser.email,
      });
      expect(result).toEqual({ accessToken: mockAccessToken });
    });

    it('should throw ConflictException when email already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new ConflictException('This email is already in use.'),
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(signUpDto.email);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should handle repository errors during user creation', async () => {
      const hashedPassword = '$2b$12$hashedpassword';
      const error = new Error('Database connection failed');

      mockUserRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockRejectedValue(error);

      await expect(service.signUp(signUpDto)).rejects.toThrow(error);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(signUpDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 12);
      expect(userRepository.create).toHaveBeenCalledWith({
        name: signUpDto.name,
        email: signUpDto.email,
        password: hashedPassword,
      });
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('generateAccessToken', () => {
    it('should generate access token with correct payload', async () => {
      mockJwtService.signAsync.mockResolvedValue(mockAccessToken);

      // Access the private method through bracket notation for testing
      const result = await (service as any).generateAccessToken(mockUser);

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toBe(mockAccessToken);
    });
  });
});
