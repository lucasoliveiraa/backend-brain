import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, Validate } from 'class-validator';
import { IsCpfOrCnpj } from '../../../shared/validators/is-cpf-or-cnpj.validator';

export class CreateProducerDto {
  @ApiProperty({
    description: 'CPF ou CNPJ do produtor',
    example: '12345678901 ou 12345678000195',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{11}|\d{14})$/, {
    message: 'CPF ou CNPJ deve conter 11 ou 14 dígitos',
  })
  @Validate(IsCpfOrCnpj)
  cpfCnpj: string;

  @ApiProperty({
    description: 'Nome do produtor',
    example: 'João da Silva',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
