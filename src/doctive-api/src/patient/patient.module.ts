import { DbAccessModule } from '@/db-access/db-access.module';
import { Module } from '@nestjs/common';
import { DoctiveCoreModule } from 'doctive-core';
import { PatientController } from './controllers/patient.controller';
import { PatientService } from './services/patient.service';

@Module({
  imports: [
    DoctiveCoreModule,
    DbAccessModule,
  ],
  controllers: [PatientController],
  providers: [PatientService]
})
export class PatientModule {}
