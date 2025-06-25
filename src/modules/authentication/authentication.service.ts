import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { SignInDto } from '../user/dto/signin.dto';
import { SignUpDto } from '../user/dto/signup.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/repositories/user.repository';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const accessToken = await this.generateAccessToken(user);

    return { accessToken };
  }

  private generateAccessToken(user: UserEntity) {
    return this.jwtService.signAsync({ sub: user.id, email: user.email });
  }

  async signUp(signUpDto: SignUpDto) {
    const { name, email, password } = signUpDto;

    const emailExists = await this.userRepo.findByEmail(email);

    if (emailExists) {
      throw new ConflictException('This email is already in use.');
    }

    const hashedPassword = await hash(password, 12);

    const user = await this.userRepo.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = await this.generateAccessToken(user);

    return { accessToken };
  }
}
