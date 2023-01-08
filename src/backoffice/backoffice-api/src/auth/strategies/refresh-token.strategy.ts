import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { extractJwtRefreshTokenFromCookie } from '../helpers/helpers';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from 'doctive-core';
import { PrismaService } from '@/db-access/prisma/prisma.service';
import { JwtPayload } from '../models/jwt-payload';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractJwtRefreshTokenFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get<JwtConfig>('jwt').refreshKey,
      passReqToCallback: true,
    });
  }

  async validate(payload: JwtPayload) {
    const { walletAddress } = payload;
    const user = await this.prisma.user.findUnique({
      where: {
        walletAddress: walletAddress,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
