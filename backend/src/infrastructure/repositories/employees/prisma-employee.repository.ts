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

        // Método auxiliar para convertir tu enum a el enum de Prisma
        private mapTypeOfContractToPrisma(
                tipo: TypeOfContract,
        ): 'FIJO' | 'INDETERMINADO' {
                switch (tipo) {
                        case TypeOfContract.FIJO:
                                return 'FIJO';
                        case TypeOfContract.INDETERMINADO:
                                return 'INDETERMINADO';
                        default:
                                throw new Error(
                                        `Tipo de contrato no válido: ${String(tipo)}`,
                                );
                }
        }

        // Método auxiliar para convertir el enum de Prisma a tu enum
        private mapPrismaTypeOfContractToDomain(
                tipo: 'FIJO' | 'INDETERMINADO',
        ): TypeOfContract {
                switch (tipo) {
                        case 'FIJO':
                                return TypeOfContract.FIJO;
                        case 'INDETERMINADO':
                                return TypeOfContract.INDETERMINADO;
                        default:
                                throw new Error(
                                        `Tipo de contrato de Prisma no válido: ${String(tipo)}`,
                                );
                }
        }

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
                        this.mapPrismaTypeOfContractToDomain(
                                prismaEmployee.tipo_contrato,
                        ),
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
                                tipo_contrato: this.mapTypeOfContractToPrisma(
                                        employee.tipo_contrato,
                                ),
                        },
                });

                return this.toDomain(created);
        }

        // ... resto de métodos que necesitas implementar
}
