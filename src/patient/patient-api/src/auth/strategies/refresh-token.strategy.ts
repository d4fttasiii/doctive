import { PrismaService } from '@/db-access/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtConfig } from 'doctive-core';
import { FastifyRequest } from 'fastify';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { extractJwtRefreshTokenFromCookie } from '../helpers/helpers';
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

  async validate(req: FastifyRequest, payload: JwtPayload) {
    const { walletAddress } = payload;
    const patient = await this.prisma.patient.findUnique({
      where: {
        walletAddress: walletAddress,
      },
    });

    if (!patient) {
      throw new UnauthorizedException();
    }

    return patient;
  }
}
