import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DoctiveConfig } from 'doctive-core';

import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { InstitutionModule } from './institution/institution.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [DoctiveConfig],
      isGlobal: true,
      envFilePath: './env/debug.env',
    }),
    UserModule,
    AdminModule,
    InstitutionModule,
  ],
})
export class AppModule {}
