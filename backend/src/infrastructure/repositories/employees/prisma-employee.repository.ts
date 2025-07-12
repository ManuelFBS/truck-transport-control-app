/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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

        //* Método auxiliar para convertir tu enum a el enum de Prisma...
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

        //* Método auxiliar para convertir el enum de Prisma a tu enum...
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

        //* Método auxiliar para normalizar texto (eliminar acentos y caracteres especiales)...
        private normalizeText(text: string): string {
                return text
                        .normalize('NFD') // Normaliza caracteres Unicode
                        .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos (acentos)
                        .toLowerCase() // Convierte a minúsculas
                        .trim(); // Elimina espacios en blanco
        }

        //* Método auxiliar para dividir texto en palabras...
        private splitIntoWords(text: string): string[] {
                return text
                        .split(/\s+/) // Divide por espacios (uno o más)
                        .filter((word) => word.length > 0) // Filtra palabras vacías
                        .map((word) => this.normalizeText(word)); // Normaliza cada palabra
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

        async findAll(): Promise<Employee[]> {
                const employees = await this.prisma.employee.findMany({
                        orderBy: {
                                cedula: 'asc',
                        },
                });

                return employees.map((emp) => this.toDomain(emp));
        }

        async findByID(id: number): Promise<Employee | null> {
                const employee = await this.prisma.employee.findUnique({
                        where: { id },
                });

                return employee ? this.toDomain(employee) : null;
        }

        async findByCedula(cedula: string): Promise<Employee | null> {
                const employee = await this.prisma.employee.findUnique({
                        where: { cedula },
                });

                return employee ? this.toDomain(employee) : null;
        }

        async findByNombreOApellido(
                nombres: string,
                apellidos: string,
        ): Promise<Employee[]> {
                //* Se construyen condiciones de búsqueda dinámicamente...
                const whereConditions: any = [];

                //* Si se proporcionan nombres, buscar en el campo nombres...
                if (nombres && nombres.trim()) {
                        const normalizedNombres = this.normalizeText(nombres);
                        const nombreWords = this.splitIntoWords(nombres);

                        //* Búsqueda exacta normalizada...
                        whereConditions.push({
                                nombres: {
                                        contains: normalizedNombres,
                                        mode: 'insensitive',
                                },
                        });

                        //* Búsqueda por palabras individuales...
                        if (nombreWords.length > 1) {
                                const wordConditions = nombreWords.map(
                                        (word) => ({
                                                nombres: {
                                                        contains: word,
                                                        mode: 'insensitive',
                                                },
                                        }),
                                );

                                whereConditions.push({
                                        AND: wordConditions, //> Todas las palabras deben estar presentes...
                                });
                        }
                }

                //* Si se proporcionan apellidos, buscar en el campo apellidos...
                if (apellidos && apellidos.trim()) {
                        const normalizedApellidos =
                                this.normalizeText(apellidos);
                        const apellidoWords = this.splitIntoWords(apellidos);

                        //* Búsqueda exacta normalizada...
                        whereConditions.push({
                                apellidos: {
                                        contains: normalizedApellidos,
                                        mode: 'insensitive',
                                },
                        });

                        //* Búsqueda por palabras individuales...
                        if (apellidoWords.length > 1) {
                                const wordConditions = apellidoWords.map(
                                        (word) => ({
                                                apellidos: {
                                                        contains: word,
                                                        mode: 'insensitive',
                                                },
                                        }),
                                );

                                whereConditions.push({
                                        AND: wordConditions, //> Todas las palabras deben estar presentes...
                                });
                        }
                }

                //* Si no se proporciona ningún parámetro, retornar array vacío...
                if (whereConditions.length === 0) {
                        return [];
                }

                //* Se realiza la consulta con las condiciones construidas...
                const employees = await this.prisma.employee.findMany({
                        where: {
                                OR: whereConditions, //> Usar OR para buscar en cualquiera de los campos...
                        },
                        orderBy: {
                                nombres: 'asc',
                                apellidos: 'asc',
                        },
                });

                return employees.map((emp) => this.toDomain(emp));
        }

        async updateByID(
                id: number,
                employee: Partial<Employee>,
        ): Promise<Employee> {
                //* Crear un objeto con solo los campos definidos...
                const updateData: any = {};

                //* Mapear solo los campos que están presentes...
                Object.entries(employee).forEach(([key, value]) => {
                        if (value !== undefined) {
                                //* Mapeo especial para el tipo de contrato...
                                if (key === 'tipo_contrato') {
                                        updateData[key] =
                                                this.mapTypeOfContractToPrisma(
                                                        value as TypeOfContract,
                                                );
                                } else {
                                        updateData[key] = value;
                                }
                        }
                });

                //* Realizar la actualización...
                const updated = await this.prisma.employee.update({
                        where: { id },
                        data: updateData,
                });

                return this.toDomain(updated);
        }

        async updateByCedula(
                cedula: string,
                employee: Partial<Employee>,
        ): Promise<Employee> {
                //* Crear un objeto con solo los campos definidos...
                const updateData: any = {};

                //* Mapear solo los campos que están presentes...
                Object.entries(employee).forEach(([key, value]) => {
                        if (value !== undefined) {
                                //* Mapeo especial para el tipo de contrato...
                                if (key === 'tipo_contrato') {
                                        updateData[key] =
                                                this.mapTypeOfContractToPrisma(
                                                        value as TypeOfContract,
                                                );
                                } else {
                                        updateData[key] = value;
                                }
                        }
                });

                //* Realizar la actualización...
                const updated = await this.prisma.employee.update({
                        where: { cedula },
                        data: updateData,
                });

                return this.toDomain(updated);
        }

        async delete(id: number): Promise<void> {
                await this.prisma.employee.delete({ where: { id } });
        }

        async existsWithCedula(cedula: string): Promise<boolean> {
                const count = await this.prisma.employee.count({
                        where: { cedula },
                });
                return count > 0;
        }

        async existsWithEmail(correo: string): Promise<boolean> {
                const count = await this.prisma.employee.count({
                        where: { correo },
                });
                return count > 0;
        }
}
