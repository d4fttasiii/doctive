import { AuthModule } from '@/auth/auth.module';
import { DbAccessModule } from '@/db-access/db-access.module';
import { Module } from '@nestjs/common';
import { DoctiveCoreModule } from 'doctive-core';

import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [DoctiveCoreModule, DbAccessModule, AuthModule.fooRootAsync()],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule { }
