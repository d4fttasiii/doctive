import { AuthModule } from '@/auth/auth.module';
import { DbAccessModule } from '@/db-access/db-access.module';
import { Module } from '@nestjs/common';
import { DoctiveCoreModule } from 'doctive-core';
import { InstitutionController } from './controllers/institution.controller';
import { InstitutionService } from './services/institution.service';

@Module({
    imports: [
        DoctiveCoreModule,
        DbAccessModule,
        AuthModule.fooRootAsync(),
    ],
    controllers: [InstitutionController],
    providers: [InstitutionService],
})
export class InstitutionModule {}
