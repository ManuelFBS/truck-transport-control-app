import {
        Injectable,
        Inject,
        BadRequestException,
        ConflictException,
        InternalServerErrorException,
        NotFoundException,
} from '@nestjs/common';
import { Employee } from '../../../core/entities/employees/employee.entity';
import { EmployeeRepository } from '../../../core/repositories/employees/employee.repository';
import {
        CreateEmployeeDTO,
        UpdateEmployeeDTO,
} from '../../dto/employees/create-employee.dto';
import {
        SearchEmployeeDTO,
        PaginatedEmployeeResponse,
} from '../../dto/employees/search-employee.dto';

@Injectable()
export class EmployeeService {
        constructor(
                @Inject('EmployeeRepository')
                private readonly employeeRepository: EmployeeRepository,
        ) {}

        async createEmployee(
                createEmployeeDTO: CreateEmployeeDTO,
        ): Promise<Employee> {
                //* Validar cédula única...
                if (
                        await this.employeeRepository.existsWithCedula(
                                createEmployeeDTO.cedula,
                        )
                ) {
                        throw new ConflictException(
                                'La cédula ya está registrada...',
                        );
                }

                //* Validar email único...
                if (
                        await this.employeeRepository.existsWithEmail(
                                createEmployeeDTO.correo,
                        )
                ) {
                        throw new ConflictException(
                                'El correo ya está registrado...',
                        );
                }

                const employee = new Employee(
                        0,
                        createEmployeeDTO.cedula,
                        createEmployeeDTO.nombres,
                        createEmployeeDTO.apellidos,
                        createEmployeeDTO.fecha_nacimiento,
                        createEmployeeDTO.correo,
                        createEmployeeDTO.telefono,
                        createEmployeeDTO.fecha_inicio_contrato,
                        createEmployeeDTO.fecha_final_contrato,
                        createEmployeeDTO.tipo_contrato,
                        new Date(),
                        new Date(),
                );

                const createdEmployee =
                        await this.employeeRepository.create(employee);

                return createdEmployee;
        }

        async findAllEmployees(): Promise<Employee[]> {
                return this.employeeRepository.findAll();
        }

        async findEmployeeByID(id: number): Promise<Employee> {
                const employee = await this.employeeRepository.findByID(id);
                if (!employee) {
                        throw new NotFoundException(
                                `Empleado con ID ${id} no encontrado`,
                        );
                }
                return employee;
        }

        async findByCedula(cedula: string): Promise<Employee> {
                const employee =
                        await this.employeeRepository.findByCedula(cedula);

                if (!employee) {
                        if (!employee) {
                                throw new NotFoundException(
                                        `Empleado con cédula ${cedula} no encontrado...`,
                                );
                        }
                }

                return employee;
        }

        async findByNombreOApellido(
                searchDTO: SearchEmployeeDTO,
        ): Promise<PaginatedEmployeeResponse> {
                try {
                        //* Validación de parámetros
                        const nombresTrimmed = searchDTO.nombres?.trim() || '';
                        const apellidosTrimmed =
                                searchDTO.apellidos?.trim() || '';

                        //* Verificar que al menos uno de los parámetros tenga contenido
                        if (!nombresTrimmed && !apellidosTrimmed) {
                                throw new BadRequestException(
                                        'Debe proporcionar al menos un nombre o apellido para la búsqueda',
                                );
                        }

                        //* Validar longitud mínima de los parámetros
                        if (
                                nombresTrimmed.length < 2 &&
                                apellidosTrimmed.length < 2
                        ) {
                                throw new BadRequestException(
                                        'Los términos de búsqueda deben tener al menos 2 caracteres',
                                );
                        }

                        //* Obtener parámetros de paginación con valores por defecto
                        const page = searchDTO.page || 1;
                        const limit = searchDTO.limit || 10;

                        //* Llamar al método del repositorio con paginación
                        const { employees, total } =
                                await this.employeeRepository.findByNombreOApellidoWithPagination(
                                        nombresTrimmed,
                                        apellidosTrimmed,
                                        page,
                                        limit,
                                );

                        //* Calcular información de paginación
                        const totalPages = Math.ceil(total / limit);
                        const hasNext = page < totalPages;
                        const hasPrev = page > 1;

                        //* Log para debugging
                        console.log(
                                `Búsqueda paginada: nombres="${nombresTrimmed}", apellidos="${apellidosTrimmed}". Página: ${page}, Límite: ${limit}, Total: ${total}`,
                        );

                        return {
                                employees,
                                total,
                                page,
                                limit,
                                totalPages,
                                hasNext,
                                hasPrev,
                        };
                } catch (error) {
                        //* Si es un error que ya manejamos, lo relanzamos
                        if (error instanceof BadRequestException) {
                                throw error;
                        }

                        //* Para otros errores, lanzamos un error genérico
                        console.error(
                                'Error en búsqueda paginada de empleados:',
                                error,
                        );
                        throw new InternalServerErrorException(
                                'Error interno del servidor al buscar empleados',
                        );
                }
        }
}
