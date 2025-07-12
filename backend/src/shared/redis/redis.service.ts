import { Injectable, Inject } from '@nestjs/common';
import IORedis from 'ioredis';
import { RedisModuleOptions } from './redis.module';

@Injectable()
export class RedisService {
        private readonly client: IORedis;

        constructor(
                @Inject('REDIS_OPTIONS')
                private readonly options: RedisModuleOptions,
        ) {
                this.client = new IORedis({
                        host: this.options.host,
                        port: this.options.port,
                        retryStrategy: (times) => {
                                const delay = Math.min(times * 50, 2000);
                                return delay;
                        },
                });

                this.client.on('error', (err) => {
                        console.error('Redis error:', err);
                });

                this.client.on('connect', () => {
                        console.log('Connected to Redis');
                });
        }

        async set(
                key: string,
                value: string,
                mode?: 'EX' | 'PX' | 'KEEPTTL',
                duration?: number,
        ): Promise<'OK'> {
                if (mode === 'EX' && duration) {
                        return this.client.set(key, value, 'EX', duration);
                } else if (mode === 'PX' && duration) {
                        return this.client.set(key, value, 'PX', duration);
                } else if (mode === 'KEEPTTL') {
                        return this.client.set(key, value, 'KEEPTTL');
                }
                return this.client.set(key, value);
        }

        async get(key: string): Promise<string | null> {
                return this.client.get(key);
        }

        async del(key: string): Promise<number> {
                return this.client.del(key);
        }

        async exists(key: string): Promise<number> {
                return this.client.exists(key);
        }

        async expire(key: string, seconds: number): Promise<number> {
                return this.client.expire(key, seconds);
        }

        async ttl(key: string): Promise<number> {
                return this.client.ttl(key);
        }

        async disconnect(): Promise<void> {
                await this.client.quit();
        }
}
