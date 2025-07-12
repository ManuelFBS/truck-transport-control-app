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
                nombres: string,
                apellidos: string,
        ): Promise<Employee[]> {
                try {
                        //* Validación de parámetros...
                        const nombresTrimmed = nombres?.trim() || '';
                        const apellidosTrimmed = apellidos?.trim() || '';

                        //* Verificar que al menos uno de los parámetros tenga contenido...
                        if (!nombresTrimmed && !apellidosTrimmed) {
                                throw new BadRequestException(
                                        'Debe proporcionar al menos un nombre o apellido para la búsqueda',
                                );
                        }

                        //* Validar longitud mínima de los parámetros...
                        if (
                                nombresTrimmed.length < 3 &&
                                apellidosTrimmed.length < 3
                        ) {
                                throw new BadRequestException(
                                        'Los términos de búsqueda deben tener al menos 3 caracteres',
                                );
                        }

                        //* Llamada al método del repo para realizar la búsqueda...
                        const employees =
                                await this.employeeRepository.findByNombreOApellido(
                                        nombres,
                                        apellidos,
                                );

                        //* Log para debugging (opcional)...
                        console.log(
                                `Búsqueda realizada: nombres="${nombresTrimmed}", apellidos="${apellidosTrimmed}". Resultados: ${employees.length}`,
                        );

                        //* Se retorna el array de empleados encontrados...
                        //* Si no se encuentran empleados, el array estará vacío...
                        return employees;
                } catch (error) {
                        //* Si es un error que ya se maneja, se relanza...
                        if (error instanceof BadRequestException) {
                                throw error;
                        }

                        //* Para otros errores (base de datos, etc.), se lanza un error genérico...
                        console.error(
                                'Error en la búsqueda de empleados...',
                                error,
                        );
                        throw new InternalServerErrorException(
                                'Error interno del servidor al buscar empleados...',
                        );
                }
        }
}
