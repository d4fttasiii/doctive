import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

import { RedisConfig } from '../models/config';
import { EncryptionService, SecretService } from '.';

@Injectable()
export class CacheService {

    constructor(
        private configService: ConfigService,
        private encryptionService: EncryptionService,
        private secretService: SecretService) { }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        const cfg = this.configService.get<RedisConfig>('redis');
        const client = createClient({
            url: `redis://${cfg.host}:${cfg.port}`,
            password: cfg.password,
        });
        await client.connect();
        if (!ttl) {
            await client.set(key, JSON.stringify(value));
        } else {
            await client.set(key, JSON.stringify(value), { PX: ttl });
        }
        await client.disconnect();
    }

    async get<TValue>(key: string): Promise<TValue> {
        const cfg = this.configService.get<RedisConfig>('redis');
        const client = createClient({
            url: `redis://${cfg.host}:${cfg.port}`,
            password: cfg.password,
        });
        await client.connect();
        const value = await client.get(key);
        const typed = JSON.parse(value) as TValue;
        await client.disconnect();

        return typed
    }

    async setEncrypted(key: string, value: any, ttl?: number): Promise<void> {
        const cfg = this.configService.get<RedisConfig>('redis');
        const client = createClient({
            url: `redis://${cfg.host}:${cfg.port}`,
            password: cfg.password,
        });
        const encryptionKey = await this.secretService.getSecret('cache-encryption-key');
        const encryptedValue = this.encryptionService.encryptString(
            JSON.stringify(value),
            encryptionKey
        );

        await client.connect();
        if (!ttl) {
            await client.set(key, encryptedValue);
        }
        else {
            await client.set(key, encryptedValue, { EX: ttl });
        }
        await client.disconnect();
    }

    async getEncrypted<TValue>(key: string): Promise<TValue> {
        const cfg = this.configService.get<RedisConfig>('redis');
        const client = createClient({
            url: `redis://${cfg.host}:${cfg.port}`,
            password: cfg.password,
        });
        const encryptionKey = await this.secretService.getSecret('cache-encryption-key');
        await client.connect();
        const encryptedValue = await client.get(key);
        await client.disconnect();
        const value = this.encryptionService.decryptString(encryptedValue, encryptionKey);

        return JSON.parse(value) as TValue;
    }

    async getEncryptedAndDelete<TValue>(key: string): Promise<TValue> {
        const val = await this.getEncrypted<TValue>(key);
        await this.delete(key);

        return val;
    }

    async delete(key: string): Promise<void> {
        const cfg = this.configService.get<RedisConfig>('redis');
        const client = createClient({
            url: `redis://${cfg.host}:${cfg.port}`,
            password: cfg.password,
        });
        await client.connect();
        await client.del(key);
        await client.disconnect();
    }
}
