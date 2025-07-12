import { Module } from '@nestjs/common';
import { EmployeeService } from '../../application/use-cases/employees/employee.service';
import { EmployeeController } from '../../infrastructure/interface-adapters/controllers/employees/employee.controller';
import { PrismaEmployeeRepository } from '../../infrastructure/repositories/employees/prisma-employee.repository';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';

@Module({
        controllers: [EmployeeController],
        providers: [
                EmployeeService,
                PrismaService,
                {
                        provide: 'EmployeeRepository',
                        useClass: PrismaEmployeeRepository,
                },
        ],
        exports: [EmployeeService, 'EmployeeRepository'],
})
export class EmployeeModule {}
