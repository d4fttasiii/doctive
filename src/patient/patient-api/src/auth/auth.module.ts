import { DbAccessModule } from '@/db-access/db-access.module';
import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DoctiveCoreModule, JwtConfig } from 'doctive-core';

import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { JwtAuthRefreshGuard } from './guards/jwt-auth-refresh-guard';
import { AuthService } from './services/auth.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({})
export class AuthModule {
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
                  signOptions: { expiresIn: cfg.accessTokenExpiration },
                };
              },
              inject: [ConfigService],
            }),
          ],
          module: AuthModule,
          providers: [
            AccessTokenStrategy,
            RefreshTokenStrategy,
            AuthService,
            JwtAuthGuard,
            JwtAuthRefreshGuard,
          ],
          exports: [AuthService, JwtAuthGuard, JwtAuthRefreshGuard],
        };
      }
}
