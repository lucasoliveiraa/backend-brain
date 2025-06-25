import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(userDto: any): Promise<UserEntity> {
    try {
      this.logger.log(`[DB]Criando usuário: ${JSON.stringify(userDto)}`);
      const user = this.manager.create(UserEntity, userDto);
      return this.manager.save(user);
    } catch (error) {
      this.logger.error(`[DB]Erro ao criar usuário`, error.message);
      throw new InternalServerErrorException(
        error.message || '[DB]Falha ao criar usuário',
      );
    }
  }

  async findByEmail(email: string): Promise<any> {
    try {
      this.logger.log(`[DB]Buscando usuário com email: ${email}`);
      return this.manager.findOne('UserEntity', { where: { email } });
    } catch (error) {
      this.logger.error(
        `[DB]Erro ao buscar usuário com email ${email}`,
        error.message,
      );
      throw new InternalServerErrorException(
        error.message || '[DB]Falha ao buscar usuário',
      );
    }
  }
}
