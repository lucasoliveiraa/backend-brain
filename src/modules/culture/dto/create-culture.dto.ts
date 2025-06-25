import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCultureDto {
  @ApiProperty({
    description: 'Nome da cultura',
    type: 'string',
    example: 'Soja',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
