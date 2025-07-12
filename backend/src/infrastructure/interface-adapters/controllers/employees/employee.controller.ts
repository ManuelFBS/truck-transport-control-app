import {
        Controller,
        Get,
        Post,
        Body,
        Param,
        Put,
        Delete,
        UseGuards,
        ParseIntPipe,
} from '@nestjs/common';
import { EmployeeService } from '../../../../application/use-cases/employees/employee.service';
import {
        CreateEmployeeDTO,
        UpdateEmployeeDTO,
        EmployeeResponseDTO,
        EmployeePublicResponseDTO,
} from '../../../../application/dto/employees/create-employee.dto';
// import { JWTAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
// import { Permissions } from '../../../../core/permissions/permissions.decorator';
// import { PermissionsGuard } from '../../../../auth/guards/permissions.guard';
import { plainToInstance } from 'class-transformer';
import { SearchEmployeeDTO } from 'src/application/dto/employees/search-employee.dto';

@Controller('api/employees')
export class EmployeeController {
        constructor(private readonly employeeService: EmployeeService) {}

        @Post('employee/newemp')
        // @UseGuards(JWTAuthGuard, PermissionsGuard)
        // @Permissions('employee:create')
        async create(
                @Body() createEmployeeDTO: CreateEmployeeDTO,
        ): Promise<EmployeeResponseDTO> {
                const employee =
                        await this.employeeService.createEmployee(
                                createEmployeeDTO,
                        );

                return plainToInstance(EmployeeResponseDTO, employee);
        }

        @Get()
        // @UseGuards(JWTAuthGuard, PermissionsGuard)
        // @Permissions('employee:read')
        async findAll(): Promise<EmployeePublicResponseDTO[]> {
                const employees = await this.employeeService.findAllEmployees();

                //* Se ordena por 'cédula' en forma ascendente...
                employees.sort((a, b) => Number(a.cedula) - Number(b.cedula));

                //* Se mapea y (opcionalmente) se transforma a instancia de DTO...
                return employees.map((emp) =>
                        plainToInstance(EmployeePublicResponseDTO, {
                                cedula: emp.cedula,
                                nombres: emp.nombres,
                                apellidos: emp.apellidos,
                                fechaNacimiento: emp.fecha_nacimiento,
                                email: emp.correo,
                                telefono: emp.telefono,
                        }),
                );
        }

        @Get('employeebyid/:id')
        // @UseGuards(JWTAuthGuard, PermissionsGuard)
        // @Permissions('employee:create', 'employee:read')
        async findOne(
                @Param('id', ParseIntPipe) id: number,
        ): Promise<EmployeeResponseDTO> {
                const employee =
                        await this.employeeService.findEmployeeByID(id);

                return plainToInstance(EmployeeResponseDTO, employee);
        }

        @Get('bycedula/:cedula')
        // @UseGuards(JWTAuthGuard, PermissionsGuard)
        // @Permissions('employee:create', 'employee:read')
        async findByCedula(
                @Param('cedula') cedula: string,
        ): Promise<EmployeeResponseDTO> {
                const employee =
                        await this.employeeService.findByCedula(cedula);

                return plainToInstance(EmployeeResponseDTO, employee);
        }

        @Get('bynombapell')
        // @UseGuards(JWTAuthGuard, PermissionsGuard)
        // @Permissions('employee:create', 'employee:read')
        async findByNombreOApellido(
                @Body() searchEmployeeDTO: SearchEmployeeDTO,
        ) {
                return await this.employeeService.findByNombreOApellido(
                        searchEmployeeDTO,
                );
        }

        @Put('updateemp/:id')
        // @UseGuards(JWTAuthGuard, PermissionsGuard)
        // @Permissions('employee:create', 'employee:read', 'employee:update')
        async updateEmployeeByID(
                @Param('id', ParseIntPipe) id: number,
                @Body() updateEmployeeDTO: UpdateEmployeeDTO,
        ): Promise<EmployeeResponseDTO> {
                const updatedEmployee = await this.employeeService.updateByID(
                        id,
                        updateEmployeeDTO,
                );

                return plainToInstance(EmployeeResponseDTO, updatedEmployee);
        }

        @Put('updateemp/:cedula')
        // @UseGuards(JWTAuthGuard, PermissionsGuard)
        // @Permissions('employee:create', 'employee:read', 'employee:update')
        async updateEmployeeByCedula(
                @Param('cedula') cedula: string,
                @Body() updateEmployeeDTO: UpdateEmployeeDTO,
        ): Promise<EmployeeResponseDTO> {
                const updatedEmployee =
                        await this.employeeService.updateByCedula(
                                cedula,
                                updateEmployeeDTO,
                        );

                return plainToInstance(EmployeeResponseDTO, updatedEmployee);
        }

        @Delete('deleteemp/:id')
        // @UseGuards(JWTAuthGuard, PermissionsGuard)
        // @Permissions('employee:create', 'employee:read', 'employee:delete')
        async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
                await this.employeeService.delete(id);
        }
}
