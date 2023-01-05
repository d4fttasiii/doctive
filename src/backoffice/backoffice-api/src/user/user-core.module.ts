import { DbAccessModule } from '@/db-access/db-access.module';
import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DoctiveCoreModule, JwtConfig } from 'doctive-core';

import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({})
export class UserCoreModule {
  static fooRootAsync(): DynamicModule {
    return {
      imports: [
        DoctiveCoreModule,
        DbAccessModule,
        HttpModule,
        PassportModule.register({
          defaultStrategy: 'jwt',
          property: 'user',
          session: false,
        }),
        JwtModule.registerAsync({
          useFactory: (cfgService: ConfigService) => {
            const cfg = cfgService.get<JwtConfig>('jwt');
            return {
              secret: cfg.secretKey,
              signOptions: { expiresIn: cfg.expiration },
            };
          },
          inject: [ConfigService],
        }),
      ],
      module: UserCoreModule,
      providers: [UserService, AuthService, JwtStrategy, JwtAuthGuard],
      exports: [UserService, AuthService, JwtStrategy, JwtAuthGuard],
    };
  }
}
