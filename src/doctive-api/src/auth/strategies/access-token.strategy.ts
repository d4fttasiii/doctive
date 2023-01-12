import { PrismaService } from '@/db-access/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Patient } from '@prisma/client';
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

  async validate(payload: JwtPayload): Promise<Patient> {
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
