import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducerEntity } from './entities/producer.entity';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { ProducerRepository } from './repositories/producer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProducerEntity])],
  controllers: [ProducerController],
  providers: [ProducerService, ProducerRepository],
})
export class ProducerModule {}
