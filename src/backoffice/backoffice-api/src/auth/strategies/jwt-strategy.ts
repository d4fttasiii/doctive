import { PrismaService } from '@/db-access/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { JwtConfig } from 'doctive-core';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../models/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
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

  private static extractJWT(req: any): string | null {
    if (
      req.cookies &&
      'access_token' in req.cookies &&
      req.cookies.access_token.length > 0
    ) {
      return req.cookies.access_token;
    }

    return null;
  }
}
