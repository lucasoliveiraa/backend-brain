import { ApiProperty } from '@nestjs/swagger';
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
import { HarvestEntity } from '../../../modules/harvest/entities/harvest.entity';
import { ProducerEntity } from '../../../modules/producer/entities/producer.entity';

@Entity({ name: 'farm' })
export class FarmEntity {
  @ApiProperty({
    description: 'Identificador único da fazenda',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty({
    description: 'Nome da fazenda',
    type: 'string',
    example: 'Fazenda Boa Vista',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Cidade da fazenda',
    type: 'string',
    example: 'Sorocaba',
  })
  @Column()
  city: string;

  @ApiProperty({
    description: 'Estado da fazenda',
    type: 'string',
    example: 'SP',
  })
  @Column()
  state: string;

  @ApiProperty({
    description: 'Area total da fazenda em hectares',
    type: 'number',
    example: 130.0,
  })
  @Column({
    name: 'area_total',
    type: 'decimal',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  areaTotal: number;

  @ApiProperty({
    description: 'Area agricola da fazenda em hectares',
    type: 'number',
    example: 100.0,
  })
  @Column({
    name: 'area_agricultural',
    type: 'decimal',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  areaAgricultural: number;

  @ApiProperty({
    description: 'Area de pastagem da fazenda em hectares',
    type: 'number',
    example: 30.0,
  })
  @Column({
    name: 'area_vegetation',
    type: 'decimal',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  areaVegetation: number;

  @ManyToOne(() => ProducerEntity, (producer) => producer.farms)
  @JoinColumn({ name: 'producer_id' })
  producer: ProducerEntity;

  @OneToMany(() => HarvestEntity, (harvest) => harvest.farm)
  harvests: HarvestEntity[];

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
