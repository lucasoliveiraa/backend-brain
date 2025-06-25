import { ApiProperty } from '@nestjs/swagger';
import { FarmEntity } from 'src/modules/farm/entities/farm.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CulturePlantedEntity } from './culture-planted.entity';

@Entity({ name: 'harvest' })
export class HarvestEntity {
  @ApiProperty({
    description: 'Identificador único da safra',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty({
    description: 'Nome da safra',
    type: 'string',
    example: 'Safra 2023',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Ano da safra',
    type: 'number',
    example: 2023,
  })
  @Column({ type: 'int' })
  year: number;

  @ManyToOne(() => FarmEntity, (farm) => farm.harvests)
  @JoinColumn({ name: 'farm_id' })
  farm: FarmEntity;

  @OneToMany(
    () => CulturePlantedEntity,
    (culturePlanted) => culturePlanted.harvest,
    { cascade: true },
  )
  culturePlanteds: CulturePlantedEntity[];

  @ApiProperty({
    description: 'Data de criação',
    type: 'string',
    format: 'date-time',
    example: '2023-10-01T00:00:00Z',
    required: true,
  })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'now()',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    type: 'string',
    format: 'date-time',
    example: '2023-10-01T00:00:00Z',
    required: true,
  })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date | null;
}
