import { PrismaService } from '@/db-access/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Patient, Prisma } from '@prisma/client';
import { Web3Service } from 'doctive-core';
import moment from 'moment';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService, private web3: Web3Service) { }

  async create(data: Prisma.PatientCreateInput): Promise<Patient> {
    this.ensureValidAddress(data.walletAddress?.toString());
    this.ensureAddressUnique(data.walletAddress);

    return await this.prisma.patient.create({
      data,
    });
  }

  async findByAddress(walletAddress: string): Promise<Patient | null> {
    return await this.prisma.patient.findUnique({
      where: {
        walletAddress: walletAddress,
      },
    });
  }

  async update(params: {
    where: Prisma.PatientWhereUniqueInput;
    data: Prisma.PatientUpdateInput;
  }): Promise<Patient> {
    const { where, data } = params;
    this.ensureEmailUnique(data.email?.toString());

    return await this.prisma.patient.update({
      data: {
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
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

  private async ensureAddressUnique(walletAddress: string) {
    const count = await this.prisma.patient.count({
      where: {
        walletAddress: walletAddress,
      },
    });

    if (count > 0) {
      throw new BadRequestException(
        `Address properties have to be unique.`,
      );
    }
  }

  private async ensureEmailUnique(email: string) {
    const count = await this.prisma.patient.count({
      where: {
        email: email,
      },
    });

    if (count > 0) {
      throw new BadRequestException(
        `Email properties have to be unique.`,
      );
    }
  }
}
