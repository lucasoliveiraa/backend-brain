import { ApiProperty } from '@nestjs/swagger';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CultureEntity } from '../../../modules/culture/entities/culture.entity';
import { HarvestEntity } from './harvest.entity';

@Entity({ name: 'culture_planted' })
export class CulturePlantedEntity {
  @ApiProperty({
    description: 'Identificador único do plantio de cultura',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => CultureEntity, (culture) => culture.culturePlanteds)
  @JoinColumn({ name: 'culture_id' })
  culture: CultureEntity;

  @ManyToOne(() => HarvestEntity, (harvest) => harvest.culturePlanteds)
  @JoinColumn({ name: 'harvest_id' })
  harvest: HarvestEntity;
}
