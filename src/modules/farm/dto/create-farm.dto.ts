import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { AreaLengthValidator } from '../../../shared/validators/area-length.validator';

export class CreateFarmDto {
  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda Boa Vista',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Cidade da fazenda',
    example: 'Sorocaba',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Estado da fazenda',
    example: 'SP',
    required: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @Matches(/^[A-Z]{2}$/, {
    message: 'Estado deve ser uma sigla de 2 letras maiúsculas',
  })
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'Área total da fazenda em hectares',
    example: 130.0,
    required: true,
  })
  @Validate(AreaLengthValidator)
  @IsNumber()
  @IsPositive({ message: 'A área total deve ser um número positivo.' })
  @IsNotEmpty({ message: 'A área total é obrigatória.' })
  areaTotal: number;

  @ApiProperty({
    description: 'Área agrícola da fazenda em hectares',
    example: 100.0,
    required: true,
  })
  @IsNumber()
  @IsPositive({ message: 'A área agrícola deve ser um número positivo.' })
  @IsNotEmpty({ message: 'A área agrícola é obrigatória.' })
  areaAgricultural: number;

  @ApiProperty({
    description: 'Área de vegetação da fazenda em hectares',
    example: 30.0,
    required: true,
  })
  @IsNumber()
  @IsPositive({ message: 'A área de vegetação deve ser um número positivo.' })
  @IsNotEmpty({ message: 'A área de vegetação é obrigatória.' })
  areaVegetation: number;

  @ApiProperty({
    description: 'ID do produtor associado à fazenda',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID()
  producerId: string;
}
