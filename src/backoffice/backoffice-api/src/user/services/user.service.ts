import { PrismaService } from '@/db-access/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, User, UserSession } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByAddress(address: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        address: address,
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return await this.prisma.user.update({
      data,
      where,
    });
  }

  async findLatestSession(userId: number): Promise<UserSession | null> {
    return await this.prisma.userSession.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
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

  async updateSession(params: {
    where: Prisma.UserSessionWhereUniqueInput;
    data: Prisma.UserSessionUpdateInput;
  }): Promise<UserSession> {
    const { where, data } = params;
    return await this.prisma.userSession.update({
      data,
      where,
    });
  }
}
