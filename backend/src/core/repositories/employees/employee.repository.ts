import { Employee } from '../../entities/employees/employee.entity';

//~ Repositorio abstracto para la entidad Employee...

//* Define el contrato que debe implementar cualquier repositorio concreto...
// * (ej: Prisma, TypeORM, etc.) independiente de la tecnología de persistencia...
export abstract class EmployeeRepository {
        abstract create(employee: Employee): Promise<Employee>;
        abstract findAll(): Promise<Employee[]>;
        abstract findByID(id: number): Promise<Employee | null>;
        abstract findByCedula(cedula: string): Promise<Employee | null>;
        abstract findByNombreOApellido(
                nombres: string,
                apellidos: string,
        ): Promise<Employee[]>;
        abstract updateByID(
                id: number,
                employee: Partial<Employee>,
        ): Promise<Employee>;
        abstract updateByCedula(
                cedula: string,
                employee: Partial<Employee>,
        ): Promise<Employee>;
        abstract delete(id: number): Promise<void>;
        abstract existsWithCedula(cedula: string): Promise<boolean>;
        abstract existsWithEmail(email: string): Promise<boolean>;
        abstract findByNombreOApellidoWithPagination(
                nombres: string,
                apellidos: string,
                page: number,
                limit: number,
        ): Promise<{ employees: Employee[]; total: number }>;
}
