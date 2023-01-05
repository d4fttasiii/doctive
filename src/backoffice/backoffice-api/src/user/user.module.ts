import { Module } from '@nestjs/common';

import { UserController } from './controllers/user.controller';
import { UserCoreModule } from './user-core.module';

@Module({
  imports: [UserCoreModule.fooRootAsync()],
  controllers: [UserController],
})
export class UserModule {}
