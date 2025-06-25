import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducerController } from './controller/producer.controller';
import { ProducerEntity } from './entities/producer.entity';
import { ProducerRepository } from './repositories/producer.repository';
import { ProducerService } from './service/producer.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProducerEntity])],
  controllers: [ProducerController],
  providers: [ProducerService, ProducerRepository],
})
export class ProducerModule {}
