import { PrismaService } from '@/db-access/prisma/prisma.service';
import { AuthResponse } from '@/user/models/auth-response';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User, UserSession } from '@prisma/client';
import { JwtConfig, UtilService, Web3Service } from 'doctive-core';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { JwtPayload } from '../models/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtTokenService: JwtService,
    private utils: UtilService,
    private prisma: PrismaService,
    private web3: Web3Service,
  ) { }

  async signIn(walletAddress: string, signature: string): Promise<AuthResponse> {
    const user = await this.findByAddress(walletAddress);
    const session = await this.prisma.userSession.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });

    if (
      !(
        user &&
        session &&
        !session.used &&
        (await this.verifySignature(
          user.walletAddress,
          session.message,
          signature,
        ))
      )
    ) {
      await this.handleUsedSession(session.id);
      await this.handleUnauthorized(user);

      throw new UnauthorizedException();
    }
    await this.handleUsedSession(session.id);

    return await this.generateJwtTokens(user);
  }

  async refreshJwt(walletAddress: string, refreshToken: string): Promise<AuthResponse> {
    const user = await this.findByAddress(walletAddress);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Unable to refresh tokens');
    }
    await this.ensureValidRefreshToken(refreshToken, user.refreshToken);

    return await this.generateJwtTokens(user);
  }

  async verifyJwt(token: string): Promise<boolean> {
    let isValid: boolean = false;
    try {
      const payload = await this.jwtTokenService.verifyAsync(token);
      const { walletAddress } = payload;

      const user = await this.findByAddress(walletAddress);
      if (user) {
        isValid = true;
      }
    } catch (error) {
      throw new UnauthorizedException();
    }

    return isValid;
  }

  async generateMessage(address: string): Promise<string> {
    const user = await this.findByAddress(address);
    if (!user) {
      throw new UnauthorizedException();
    }
    const session = await this.createSession({
      message: uuidv4(),
      User: {
        connect: {
          id: user.id,
        },
      },
    });

    return session.message;
  }

  async findByAddress(walletAddress: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        walletAddress: walletAddress,
      },
    });
  }

  async createSession(
    data: Prisma.UserSessionCreateInput,
  ): Promise<UserSession> {
    return await this.prisma.userSession.create({
      data,
    });
  }

  private async handleUsedSession(sessionId: number) {
    await this.prisma.userSession.update({
      where: {
        id: sessionId,
      },
      data: {
        used: true,
      },
    });
  }

  private async handleUnauthorized(user: User) {
    if (!user.lockEnabled) {
      return;
    }
    const failedAttempts = user.loginAttempts + 1;
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: failedAttempts,
        lockedUntil:
          failedAttempts >= 5 ? moment().add(5, 'minutes').toDate() : null,
        refreshToken: null,
      },
    });
  }

  private async handleRefreshToken(userId: number, refreshToken: string) {
    const hash = await this.utils.argon2Hash(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hash,
      }
    });
  }

  private async generateJwtTokens(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = {
      walletAddress: user.walletAddress,
      name: user.name,
    };
    const jwtConfig = this.configService.get<JwtConfig>('jwt');
    const [access_token, refresh_token] = await Promise.all([
      this.jwtTokenService.signAsync(payload),
      this.jwtTokenService.signAsync(payload, {
        secret: jwtConfig.refreshKey,
        expiresIn: jwtConfig.refreshTokenExpiration,
      }),
    ]);
    await this.handleRefreshToken(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }

  private async verifySignature(
    address: string,
    message: string,
    signature: string,
  ): Promise<boolean> {
    return await this.web3.verifySignature(message, signature, address);
  }

  private async ensureValidRefreshToken(token: string, hash: string) {
    if (await this.utils.argon2Verify(hash, token)) {
      return;
    }

    throw new ForbiddenException('Invalid refresh token');
  }
}
