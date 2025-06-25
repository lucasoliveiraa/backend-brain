import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'AreaLength', async: false })
export class AreaLengthValidator implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const dto = args.object as any;
    const total = parseFloat(dto.areaTotal);
    const agri = parseFloat(dto.areaAgricultural);
    const veg = parseFloat(dto.areaVegetation);
    return agri + veg <= total;
  }

  defaultMessage(args: ValidationArguments) {
    return `A soma das áreas agricultável e de vegetação não pode ultrapassar a área total da fazenda`;
  }
}
