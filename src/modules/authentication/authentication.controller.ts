import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../../shared/decorators/IsPublic';
import { SignInDto } from '../user/dto/signin.dto';
import { SignUpDto } from '../user/dto/signup.dto';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @IsPublic()
  @Post('signin')
  @ApiOperation({
    summary: 'Fazer login como usuário',
    description: 'Endpoint para autenticação de usuários.',
  })
  async signIn(@Body() signInDto: SignInDto) {
    return this.authenticationService.signIn(signInDto);
  }

  @ApiOperation({
    summary: 'Registrar novo usuário',
    description: 'Endpoint para registro de novos usuários.',
  })
  @IsPublic()
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authenticationService.signUp(signUpDto);
  }
}
