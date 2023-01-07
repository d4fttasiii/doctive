import { PrismaService } from '@/db-access/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Institution, InstitutionManager, InstitutionSubscription, Prisma } from '@prisma/client';
import { Web3Service } from 'doctive-core';
import moment from 'moment';

import { InstitutionListDto } from '../models/institution-dto';
import { InstitutionManagerListDto } from '../models/institution-manager-dto';
import { UpsertInstitutionManagerDto } from '../models/upsert-institution-manager-dto';
import { UpsertInstitutionSubscriptionDto } from '../models/upsert-institution-subscription-dto';

@Injectable()
export class InstitutionService {
  constructor(private prisma: PrismaService, private web3: Web3Service) { }

  async create(data: Prisma.InstitutionCreateInput): Promise<Institution> {
    this.ensureUnique(data.name, data.email);

    return await this.prisma.institution.create({
      data,
    });
  }

  async list(take = 50, skip = 0): Promise<InstitutionListDto[]> {
    return await this.prisma.institution.findMany({
      select: {
        id: true,
        name: true,
      },
      skip: skip,
      take: take,
    });
  }

  async findById(id: number): Promise<Institution | null> {
    return await this.prisma.institution.findUnique({
      where: {
        id: id,
      },
      include: {
        Subscription: true,
      }
    });
  }

  async update(params: {
    where: Prisma.InstitutionWhereUniqueInput;
    data: Prisma.InstitutionUpdateInput;
  }): Promise<Institution> {
    const { where, data } = params;
    this.ensureUnique(data.name?.toString(), data.email?.toString());

    return await this.prisma.institution.update({
      data: {
        email: data.email,
        name: data.name,
        fullAddress: data.fullAddress,
        phoneNr: data.phoneNr,
        modifiedAt: moment().toNow(),
      },
      where,
    });
  }

  async upsertSubscription(
    institutionId: number,
    data: UpsertInstitutionSubscriptionDto,
  ): Promise<InstitutionSubscription> {
    return await this.prisma.institutionSubscription.upsert({
      create: {
        isActive: data.isActive,
        Institution: {
          connect: {
            id: institutionId,
          },
        },
      },
      update: {
        modifiedAt: moment().toNow(),
        isActive: data.isActive,
      },
      where: {
        institutionId: institutionId,
      },
    });
  }

  async createManager(institutionId: number, data: UpsertInstitutionManagerDto): Promise<InstitutionManager> {
    this.ensureValidAddress(data.walletAddress);
    this.ensureUniqueManager(data.walletAddress, data.email);

    return await this.prisma.institutionManager.create({
      data: {
        ...data,
        Institution: {
          connect: {
            id: institutionId,
          }
        }
      }
    });
  }

  async listManagers(take = 50, skip = 0): Promise<InstitutionManagerListDto[]> {
    return await this.prisma.institutionManager.findMany({
      select: {
        id: true,
        name: true,
        walletAddress: true,
        email: true,
      },
      skip: skip,
      take: take,
    });
  }

  async findManagerByAddress(walletAddress: string): Promise<InstitutionManager | null> {
    return await this.prisma.institutionManager.findUnique({
      where: {
        walletAddress: walletAddress,
      }
    });
  }

  async updateManager(params: {
    where: Prisma.InstitutionManagerWhereUniqueInput;
    data: Prisma.InstitutionManagerUpdateInput;
  }): Promise<InstitutionManager | null> {
    const { where, data } = params;
    this.ensureValidAddress(data.walletAddress?.toString());
    this.ensureUniqueManager(data.walletAddress?.toString(), data.email?.toString());

    return await this.prisma.institutionManager.update({
      data: {
        email: data.email,
        name: data.name,
        modifiedAt: moment().toNow(),
      },
      where
    });
  }

  private ensureValidAddress(address: string) {
    if (!this.web3.isValidAddress(address)) {
      throw new BadRequestException(`${address} is not a valid address.`);
    }
  }

  private async ensureUnique(name: string, email: string) {
    const count = await this.prisma.institution.count({
      where: {
        OR: {
          name: name,
          email: email,
        },
      },
    });

    if (count > 0) {
      throw new BadRequestException(
        `Name and email properties have to be unique.`,
      );
    }
  }

  private async ensureUniqueManager(walletAddress: string, email: string) {
    const count = await this.prisma.institutionManager.count({
      where: {
        OR: {
          walletAddress: walletAddress,
          email: email,
        },
      },
    });

    if (count > 0) {
      throw new BadRequestException(
        `Wallet address and email properties have to be unique.`,
      );
    }
  }
}
