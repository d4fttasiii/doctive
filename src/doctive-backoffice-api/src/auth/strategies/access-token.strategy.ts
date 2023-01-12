import { PrismaService } from '@/db-access/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { JwtConfig } from 'doctive-core';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { extractJwtAccessTokenFromCookie } from '../helpers/helpers';

import { JwtPayload } from '../models/jwt-payload';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractJwtAccessTokenFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get<JwtConfig>('jwt').secretKey,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
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
