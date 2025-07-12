import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { Employee } from '../../../core/entities/employees/employee.entity';

export class SearchEmployeeDTO {
        @IsOptional()
        @IsString()
        nombres?: string;

        @IsOptional()
        @IsString()
        apellidos?: string;

        @IsOptional()
        @Type(() => Number)
        @IsInt()
        @Min(1)
        page?: number = 1; //> Valor por defecto...

        @IsOptional()
        @Type(() => Number)
        @IsInt()
        @Min(1)
        @Max(100)
        limit?: number = 10; //> Valor por defecto...
}

export class PaginatedEmployeeResponse {
        employees: Employee[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
}
