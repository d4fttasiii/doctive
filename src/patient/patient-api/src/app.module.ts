import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DoctiveConfig } from 'doctive-core';

import { PatientModule } from './patient/patient.module';

@Module({
  imports: [ConfigModule.forRoot({
    load: [DoctiveConfig],
    isGlobal: true,
    envFilePath: './env/debug.env',
  }), PatientModule],
  
})
export class AppModule {}
