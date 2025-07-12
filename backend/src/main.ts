/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
        const app = await NestFactory.create(AppModule);
        const config = new DocumentBuilder()
                .setTitle('NestJS Clean Architecture API')
                .setDescription('API for employee and user management')
                .setVersion('1.0')
                .addTag('users')
                .addTag('employees')
                .build();
        const document = SwaggerModule.createDocument(app, config);

        SwaggerModule.setup('api', app, document);

        console.log('REDIS_HOST:', process.env.REDIS_HOST);
        console.log('REDIS_PORT:', process.env.REDIS_PORT);

        await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
