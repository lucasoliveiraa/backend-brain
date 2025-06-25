import { ApiProperty } from '@nestjs/swagger';
import { CulturePlantedEntity } from 'src/modules/harvest/entities/culture-planted.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'culture' })
export class CultureEntity {
  @ApiProperty({
    description: 'Identificador único da cultura',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty({
    description: 'Nome da cultura',
    type: 'string',
    example: 'Soja',
  })
  @Column({ name: 'name', unique: true })
  name: string;

  @OneToMany(
    () => CulturePlantedEntity,
    (culturePlanted) => culturePlanted.culture,
  )
  culturePlanteds: CulturePlantedEntity[];
}
