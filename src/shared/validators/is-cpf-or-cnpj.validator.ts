import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { cnpj, cpf } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'IsCpfOrCnpj', async: false })
export class IsCpfOrCnpj implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments) {
    const onlyNumbers = value.replace(/\D/g, '');
    return cpf.isValid(onlyNumbers) || cnpj.isValid(onlyNumbers);
  }

  defaultMessage(_args: ValidationArguments) {
    return 'CPF ou CNPJ inválido';
  }
}
