import { PrismaService } from '@/db-access/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Institution, Prisma } from '@prisma/client';
import { Web3Service } from 'doctive-core';
import moment from 'moment';

import { InstitutionListDto } from '../models/institution-dto';

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


  private async ensureUnique(name: string, email: string) {
    const count = await this.prisma.institution.count({
      where: {
        OR: {
          name: name,
          email: email,
        }
      }
    });

    if (count > 0) {
      throw new BadRequestException(`Name and email properties have to be unique.`);
    }
  }
}
