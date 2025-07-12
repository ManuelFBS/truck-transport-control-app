import {
        Injectable,
        Inject,
        ConflictException,
        NotFoundException,
} from '@nestjs/common';
import { Employee } from '../../core/entities/employees/employee.entity';
import { EmployeeRepository } from '../../core/repositories/employees/employee.repository';
import {
        CreateEmployeeDTO,
        UpdateEmployeeDTO,
} from '../dto/employees/create-employee.dto';

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
}
