import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UtilService, Web3Service } from 'doctive-core';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { JwtPayload } from '../models/jwt-payload';
import { LoginMessage } from '../models/login-message';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtTokenService: JwtService,
    private userService: UserService,
    private utilsService: UtilService,
    private web3: Web3Service,
  ) { }

  async signIn(address: string, signature: string): Promise<string> {
    const user = await this.userService.findByAddress(address);
    const session = await this.userService.findLatestSession(user.id);

    if (
      !(
        user &&
        session &&
        !session.used &&
        (await this.verifySignature(user.address, session.message, signature))
      )
    ) {
      await this.handleUsedSession(session.id);
      await this.handleUnauthorized(user);

      throw new UnauthorizedException();
    }

    const payload: JwtPayload = {
      walletAddress: user.address,
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

      const user = await this.userService.findByAddress(walletAddress);
      if (user) {
        isValid = true;
      }
    } catch (error) {
      throw new UnauthorizedException();
    }

    return isValid;
  }

  async generateMessage(address: string): Promise<LoginMessage> {
    const user = await this.userService.findByAddress(address);
    if (!user) {
      throw new UnauthorizedException();
    }
    const session = await this.userService.createSession({
      message: uuidv4(),
      User: {
        connect: {
          id: user.id,
        },
      },
    });

    return {
      message: session.message,
    };
  }

  private async handleUsedSession(sessionId: number) {
    await this.userService.updateSession({
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
    await this.userService.update({
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
