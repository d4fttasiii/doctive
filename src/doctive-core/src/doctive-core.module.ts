import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DoctiveConfig } from './configs';
import { StatusController } from './controllers/status.controller';
import { CacheService, EncryptionService, S3Service, SecretService, UtilService, Web3Service } from './services';

const SERVICES = [
    EncryptionService,
    SecretService,
    CacheService,
    S3Service,
    UtilService,
    Web3Service,
];

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [DoctiveConfig],
            isGlobal: false,
        })
    ],
    providers: [...SERVICES],
    exports: [...SERVICES],
    controllers: [StatusController]
})
export class DoctiveCoreModule { }
