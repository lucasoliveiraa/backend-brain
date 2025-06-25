import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { FarmEntity } from 'src/modules/farm/entities/farm.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'producer' })
export class ProducerEntity {
  @ApiProperty({
    description: 'Identificador único do produtor',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty({
    description: 'CPF ou CNPJ do produtor',
    type: 'string',
    example: '12345678901',
  })
  @Column({ name: 'cpf_cnpj', unique: true })
  cpfCnpj: string;

  @ApiProperty({
    description: 'Nome do produtor',
    type: 'string',
    example: 'João da Silva',
  })
  @Column()
  name: string;

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

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @Exclude()
  @Column('boolean', { name: 'is_deleted', nullable: true })
  isDeleted: boolean | null;

  @OneToMany(() => FarmEntity, (farm) => farm.producer)
  farms: FarmEntity[];
}
