import {
        IsDateString,
        IsEmail,
        IsNotEmpty,
        IsOptional,
        IsString,
        MinLength,
        MaxLength,
        Matches,
        Validate,
        ValidatorConstraint,
        ValidatorConstraintInterface,
        ValidationArguments,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { TypeOfContract } from '../../../core/entities/employees/employee.entity';
import { Transform } from 'class-transformer';

@ValidatorConstraint({ name: 'isValidTypeOfContract', async: false })
export class IsValidTypeOfContractConstraint
        implements ValidatorConstraintInterface
{
        validate(tipo_contrato: any, args: ValidationArguments) {
                return Object.values(TypeOfContract).includes(tipo_contrato);
        }

        defaultMessage(args: ValidationArguments) {
                return `El tipo de contrato debe ser uno de estos: ${Object.values(TypeOfContract).join(', ')}`;
        }
}

export class CreateEmployeeDTO {
        @ApiProperty({
                example: ['12345678', 'AB123456', 'ABC123', '123abC45F'],
                description: 'La cédula del empleado (único)',
                minLength: 6,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(6)
        @MaxLength(20)
        @Matches(/^[A-Za-z0-9]+$/, {
                message: 'La cédula solo debe contener letras y/o números (sin espacios ni caracteres especiales)',
        })
        cedula: string;

        @ApiProperty({
                example: ['Juan', 'Juan José'],
                description: 'Nombre(s) del empleado',
                minLength: 3,
                maxLength: 100,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(3)
        @MaxLength(100)
        nombres: string;

        @ApiProperty({
                example: ['Pérez', 'Pérez Rodríguez'],
                description: 'Apellido(s) del empleado',
                minLength: 3,
                maxLength: 100,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(3)
        @MaxLength(100)
        apellidos: string;

        @ApiProperty({
                example: '1995-01-20',
        })
        @IsDateString()
        @IsNotEmpty()
        @Transform(({ value }) => new Date(value)) //> Convierte el string ISO a Date...
        fecha_nacimiento: Date;

        @ApiProperty({
                example: 'juan.perez@empresa.com',
                description: 'Email del empleado (único)',
        })
        @IsEmail()
        @IsNotEmpty()
        correo: string;

        @ApiProperty({
                example: '+5491145678901',
                description: 'Teléfono del empleado',
                minLength: 8,
                maxLength: 30,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(8)
        @MaxLength(25)
        telefono: string;

        @ApiProperty({
                example: '2015-01-20',
        })
        @IsDateString()
        @IsNotEmpty()
        @Transform(({ value }) => new Date(value)) //> Convierte el string ISO a Date...
        fecha_inicio_contrato: Date;

        @ApiProperty({
                example: '2015-01-20',
        })
        @IsDateString()
        @IsOptional()
        @Transform(({ value }) => new Date(value)) //> Convierte el string ISO a Date...
        fecha_final_contrato: Date;

        @ApiProperty({
                enum: TypeOfContract,
                example: TypeOfContract.FIJO,
                description: 'Tipo de contrato del empleado ingresado',
        })
        @IsNotEmpty()
        @Validate(IsValidTypeOfContractConstraint)
        tipo_contrato: TypeOfContract;
}

export class UpdateEmployeeDTO extends PartialType(CreateEmployeeDTO) {
        @ApiProperty({ required: false })
        @IsOptional()
        nombres?: string;

        @ApiProperty({ required: false })
        @IsOptional()
        apellidos?: string;

        @ApiProperty({ required: false })
        @IsOptional()
        @IsDateString()
        fecha_nacimiento?: Date | undefined;

        @ApiProperty({ required: false })
        @IsOptional()
        @IsEmail()
        correo?: string;

        @ApiProperty({ required: false })
        @IsOptional()
        telefono?: string;

        @ApiProperty({ required: false })
        @IsOptional()
        @IsDateString()
        fecha_final_contrato?: Date | undefined;

        @ApiProperty({
                required: false,
                enum: TypeOfContract,
                example: TypeOfContract.INDETERMINADO,
        })
        @IsOptional()
        @Validate(IsValidTypeOfContractConstraint)
        tipo_contrato?: TypeOfContract;
}

export class EmployeeResponseDTO {
        @ApiProperty()
        id: number;

        @ApiProperty()
        cedula: string;

        @ApiProperty()
        nombres: string;

        @ApiProperty()
        apellidos: string;

        @ApiProperty()
        fecha_nacimiento: Date;

        @ApiProperty()
        correo: string;

        @ApiProperty()
        telefono: string;

        @ApiProperty()
        fecha_inicio_contrato: Date;

        @ApiProperty()
        fecha_final_contrato: Date;

        @ApiProperty()
        tipo_contrato: TypeOfContract;

        @ApiProperty()
        createdAt: Date;

        @ApiProperty()
        updatedAt: Date;
}
