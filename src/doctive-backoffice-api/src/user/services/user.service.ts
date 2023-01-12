import { PrismaService } from '@/db-access/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { Web3Service } from 'doctive-core';
import moment from 'moment';

import { UserListDto } from '../models/user-dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private web3: Web3Service) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    this.ensureValidAddress(data.walletAddress?.toString());
    this.ensureUnique(data.walletAddress, data.email);

    return await this.prisma.user.create({
      data,
    });
  }

  async list(take = 50, skip = 0): Promise<UserListDto[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        walletAddress: true,
      },
      skip: skip,
      take: take,
    });
  }

  async findByAddress(walletAddress: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        walletAddress: walletAddress,
      },
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    this.ensureUnique(data.walletAddress?.toString(), data.email?.toString());

    return await this.prisma.user.update({
      data: {
        email: data.email,
        name: data.name,
        role: data.role,
        lockEnabled: data.lockEnabled,
        modifiedAt: moment().toNow(),
      },
      where,
    });
  }

  private ensureValidAddress(address: string) {
    if (!this.web3.isValidAddress(address)) {
      throw new BadRequestException(`${address} is not a valid address.`);
    }
  }

  private async ensureUnique(walletAddress: string, email: string) {
    const count = await this.prisma.user.count({
      where: {
        OR: {
          walletAddress: walletAddress,
          email: email,
        },
      },
    });

    if (count > 0) {
      throw new BadRequestException(
        `Address and email properties have to be unique.`,
      );
    }
  }
}
