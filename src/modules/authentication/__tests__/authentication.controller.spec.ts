import { Test, TestingModule } from '@nestjs/testing';
import { SignInDto } from '../../user/dto/signin.dto';
import { SignUpDto } from '../../user/dto/signup.dto';
import { AuthenticationController } from '../authentication.controller';
import { AuthenticationService } from '../authentication.service';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let service: AuthenticationService;

  const mockAuthenticationService = {
    signIn: jest.fn(),
    signUp: jest.fn(),
  };

  const mockAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockAuthenticationService,
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    service = module.get<AuthenticationService>(AuthenticationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in a user successfully', async () => {
      const signInDto: SignInDto = {
        email: 'joao@email.com',
        password: 'senha123456',
      };

      const expectedResult = { accessToken: mockAccessToken };
      mockAuthenticationService.signIn.mockResolvedValue(expectedResult);

      const result = await controller.signIn(signInDto);

      expect(service.signIn).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle sign in errors', async () => {
      const signInDto: SignInDto = {
        email: 'invalid@email.com',
        password: 'wrongpassword',
      };

      const error = new Error('Invalid credentials');
      mockAuthenticationService.signIn.mockRejectedValue(error);

      await expect(controller.signIn(signInDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(service.signIn).toHaveBeenCalledWith(signInDto);
    });
  });

  describe('signUp', () => {
    it('should sign up a user successfully', async () => {
      const signUpDto: SignUpDto = {
        name: 'João da Silva',
        email: 'joao@email.com',
        password: 'senha123456',
      };

      const expectedResult = { accessToken: mockAccessToken };
      mockAuthenticationService.signUp.mockResolvedValue(expectedResult);

      const result = await controller.signUp(signUpDto);

      expect(service.signUp).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle sign up errors', async () => {
      const signUpDto: SignUpDto = {
        name: 'João da Silva',
        email: 'existing@email.com',
        password: 'senha123456',
      };

      const error = new Error('Email already in use');
      mockAuthenticationService.signUp.mockRejectedValue(error);

      await expect(controller.signUp(signUpDto)).rejects.toThrow(
        'Email already in use',
      );
      expect(service.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });
});
