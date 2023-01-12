import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

import { IPFSConfig } from '../models/config';

@Injectable({})
export class S3Service {

    constructor(private configService: ConfigService) {
    }

    async createBucket(): Promise<void> {
        const cfg = this.configService.get<IPFSConfig>('ipfs');
        const minio = this.getMinioClient(cfg);
        if (!(await minio.bucketExists(cfg.bucket))) {
            await minio.makeBucket(cfg.bucket, 'default');
        }
    }

    async list(prefix: string): Promise<string[]> {
        const cfg = this.configService.get<IPFSConfig>('ipfs');
        const minio = this.getMinioClient(cfg);
        const stream = minio.listObjectsV2(cfg.bucket, prefix);

        return new Promise((resolve, reject) => {
            const items: string[] = [];
            stream.on('data', (obj) => {
                items.push(obj.name);
            });
            stream.on('error', function (err) {
                reject(err);
            });
            stream.on('end', () => {
                resolve(items);
            });
        });
    }

    async download(objectName: string): Promise<Buffer> {
        const cfg = this.configService.get<IPFSConfig>('ipfs');
        const minio = this.getMinioClient(cfg);
        const stream = await minio.getObject(cfg.bucket, objectName);

        return new Promise((resolve, reject) => {
            let buffer: Buffer = Buffer.from('');
            stream.on('data', (obj) => {
                buffer = Buffer.concat([buffer, Buffer.from(obj)]);
            });
            stream.on('error', function (err) {
                reject(err);
            });
            stream.on('end', () => {
                resolve(buffer);
            });
        });
    }

    async upload(objectName: string, content: Buffer) {
        const cfg = this.configService.get<IPFSConfig>('ipfs');
        const minio = this.getMinioClient(cfg);
        await minio.putObject(cfg.bucket, objectName, content);
    }

    async delete(objectName: string) {
        const cfg = this.configService.get<IPFSConfig>('ipfs');
        const minio = this.getMinioClient(cfg);
        await minio.removeObject(cfg.bucket, objectName);
    }

    async deleteFolder(prefix: string): Promise<void> {
        const cfg = this.configService.get<IPFSConfig>('ipfs');
        const minio = this.getMinioClient(cfg);
        const objects = await this.list(prefix);
        await minio.removeObjects(cfg.bucket, objects);
    }

    private getMinioClient(cfg: IPFSConfig): Client {
        const minioClient = new Client({
            endPoint: cfg.endpoint,
            port: cfg.port,
            useSSL: cfg.useSsl,
            accessKey: cfg.accessKey,
            secretKey: cfg.secretKey,
        });

        return minioClient;
    }
}
