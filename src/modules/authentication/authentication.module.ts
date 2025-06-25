import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication.controller';
import { AuthGuard } from './authentication.guard';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
      global: true,
    }),
    UserModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthenticationModule {}
