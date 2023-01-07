import { PrismaService } from '@/db-access/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User, UserSession } from '@prisma/client';
import { Web3Service } from 'doctive-core';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { JwtPayload } from '../models/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private jwtTokenService: JwtService,
    private prisma: PrismaService,
    private web3: Web3Service,
  ) {}

  async signIn(address: string, signature: string): Promise<string> {
    const user = await this.findByAddress(address);
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

    const payload: JwtPayload = {
      walletAddress: user.walletAddress,
      name: user.name,
    };
    await this.handleUsedSession(session.id);

    return await this.jwtTokenService.signAsync(payload);
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
      },
    });
  }

  private async verifySignature(
    address: string,
    message: string,
    signature: string,
  ): Promise<boolean> {
    return await this.web3.verifySignature(message, signature, address);
  }
}
