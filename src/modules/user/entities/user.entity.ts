import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @ApiProperty({
    description: 'Identificador único do usuário',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty({
    description: 'Nome do usuário',
    type: 'string',
    example: 'João da Silva',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    type: 'string',
    example: 'João da Silva',
  })
  @Column({ name: 'email', unique: true })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    type: 'string',
    example: 'João da Silva',
  })
  @Column()
  password: string;

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
