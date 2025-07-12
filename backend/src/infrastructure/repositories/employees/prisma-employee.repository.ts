import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
        Employee,
        TypeOfContract,
} from '../../../core/entities/employees/employee.entity';
import { EmployeeRepository } from '../../../core/repositories/employees/employee.repository';

@Injectable()
export class PrismaEmployeeRepository implements EmployeeRepository {
        constructor(private readonly prisma: PrismaService) {}

        private toDomain(prismaEmployee: any): Employee {
                return new Employee(
                        prismaEmployee.id,
                        prismaEmployee.cedula,
                        prismaEmployee.nombres,
                        prismaEmployee.apellidos,
                        prismaEmployee.fecha_nacimiento,
                        prismaEmployee.correo,
                        prismaEmployee.telefono,
                        prismaEmployee.fecha_inicio_contrato,
                        prismaEmployee.fecha_final_contrato,
                        prismaEmployee.tipo_contrato as TypeOfContract,
                        prismaEmployee.createdAt,
                        prismaEmployee.updatedAt,
                );
        }

        async create(employee: Employee): Promise<Employee> {
                const created = await this.prisma.employee.create({
                        data: {
                                cedula: employee.cedula,
                                nombres: employee.nombres,
                                apellidos: employee.apellidos,
                                fecha_nacimiento: employee.fecha_nacimiento,
                                correo: employee.correo,
                                telefono: employee.telefono,
                                fecha_inicio_contrato:
                                        employee.fecha_inicio_contrato,
                                fecha_final_contrato:
                                        employee.fecha_final_contrato,
                                tipo_contrato: employee.tipo_contrato,
                        },
                });
        }
}
