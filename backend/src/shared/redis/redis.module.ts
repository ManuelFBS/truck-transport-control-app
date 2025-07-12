import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

export interface RedisModuleOptions {
        host: string;
        port: number;
        db: number;
        password: string;
}

@Global()
@Module({})
export class RedisModule {
        static forRoot(options: RedisModuleOptions): DynamicModule {
                return {
                        module: RedisModule,
                        providers: [
                                {
                                        provide: 'REDIS_OPTIONS',
                                        useValue: options,
                                },
                                {
                                        provide: RedisService,
                                        useFactory: (
                                                redisOptions: RedisModuleOptions,
                                        ) => {
                                                return new RedisService(
                                                        redisOptions,
                                                );
                                        },
                                        inject: ['REDIS_OPTIONS'],
                                },
                        ],
                        exports: [RedisService],
                };
        }

        static forRootAsync(options: {
                inject: any[];
                useFactory: (
                        ...args: any[]
                ) => RedisModuleOptions | Promise<RedisModuleOptions>;
        }): DynamicModule {
                return {
                        module: RedisModule,
                        providers: [
                                {
                                        provide: 'REDIS_OPTIONS',
                                        useFactory: options.useFactory,
                                        inject: options.inject,
                                },
                                {
                                        provide: RedisService,
                                        useFactory: (
                                                redisOptions: RedisModuleOptions,
                                        ) => {
                                                return new RedisService(
                                                        redisOptions,
                                                );
                                        },
                                        inject: ['REDIS_OPTIONS'],
                                },
                        ],
                        exports: [RedisService],
                };
        }
}
