import { DbAccessModule } from '@/db-access/db-access.module';
import { Module } from '@nestjs/common';
import { DoctiveCoreModule } from 'doctive-core';

@Module({
  imports: [
    DoctiveCoreModule,
    DbAccessModule,
  ]
})
export class AdminModule { }
