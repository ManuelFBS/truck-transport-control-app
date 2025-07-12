import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './shared/redis/redis.module';
import { EmployeeModule } from './modules/employees/employee.module';
// import { AuthModule } from './modules/auth/auth.module';
// import { UserModule } from './modules/users/user.module';
// import { UserSessionModule } from './modules/usersessions/user-session.module';

@Module({
        imports: [
                ConfigModule.forRoot({
                        isGlobal: true,
                        envFilePath: '.env',
                }),
                RedisModule.forRootAsync({
                        inject: [ConfigService],
                        useFactory: (configService: ConfigService) => ({
                                host:
                                        configService.get<string>(
                                                'REDIS_HOST',
                                        ) || 'localhost',
                                port: parseInt(
                                        configService.get<string>(
                                                'REDIS_PORT',
                                        ) || '6379',
                                        10,
                                ),
                                db: parseInt(
                                        configService.get<string>('REDIS_DB') ||
                                                '0',
                                        10,
                                ),
                                password:
                                        configService.get<string>(
                                                'REDIS_PASSWORD',
                                        ) || '',
                        }),
                }),
                // AuthModule,
                // UserModule,
                EmployeeModule,
                // UserSessionModule,
        ],
        //? No se necesitan controllers ni providers aquí si ya están en los módulos...
})
export class AppModule {}
