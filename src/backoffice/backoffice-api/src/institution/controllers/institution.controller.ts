import { JwtAuthGuard } from '@/auth/guards/jwt-auth-guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { InstitutionDto, InstitutionListDto } from '../models/institution-dto';
import {
  InstitutionManagerDto,
  InstitutionManagerListDto,
} from '../models/institution-manager-dto';
import { InstitutionSubscriptionDto } from '../models/institution-subscription-dto';
import { UpsertInstitutionDto } from '../models/upsert-institution-dto';
import { UpsertInstitutionManagerDto } from '../models/upsert-institution-manager-dto';
import { UpsertInstitutionSubscriptionDto } from '../models/upsert-institution-subscription-dto';
import { InstitutionService } from '../services/institution.service';

@ApiTags('Institution')
@Controller({ version: '1', path: 'institution' })
export class InstitutionController {
  constructor(private institutionService: InstitutionService) {}

  @Get(':take/:skip')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lists institutions' })
  @ApiResponse({
    status: 200,
    description: 'List of institutions',
    type: [InstitutionListDto],
  })
  async getInstitutions(
    @Param('take') take: string,
    @Param('skip') skip: string,
  ): Promise<InstitutionListDto[]> {
    return await this.institutionService.list(
      take ? parseInt(take, 10) : 50,
      skip ? parseInt(skip, 10) : 0,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Gets institution details' })
  @ApiResponse({
    status: 200,
    description: 'Institution details ',
    type: [InstitutionDto],
  })
  async getInstitution(@Param('id') id: string): Promise<InstitutionDto> {
    return await this.institutionService.findById(parseInt(id, 10));
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpsertInstitutionDto })
  @ApiOperation({ summary: 'Creates new institution' })
  @ApiResponse({
    status: 200,
    description: 'New institution',
    type: InstitutionDto,
  })
  async createInstitution(
    @Body() data: UpsertInstitutionDto,
  ): Promise<InstitutionDto> {
    return await this.institutionService.create({
      email: data.email,
      name: data.name,
      fullAddress: data.fullAddress,
      phoneNr: data.phoneNr,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpsertInstitutionDto })
  @ApiOperation({ summary: 'Updates institution' })
  @ApiResponse({
    status: 200,
    description: 'Updated institution',
    type: InstitutionDto,
  })
  async updateInstitution(
    @Param('id') id: string,
    @Body() data: UpsertInstitutionDto,
  ): Promise<InstitutionDto> {
    return this.institutionService.update({
      where: {
        id: parseInt(id, 10),
      },
      data: data,
    });
  }

  @Post(':id/subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpsertInstitutionDto })
  @ApiOperation({ summary: 'Upsert institution subscription' })
  @ApiResponse({
    status: 200,
    description: 'Institution subscription',
    type: InstitutionSubscriptionDto,
  })
  async upsertInstitutionSubscription(
    @Param('id') id: string,
    @Body() data: UpsertInstitutionSubscriptionDto,
  ): Promise<InstitutionSubscriptionDto> {
    return await this.institutionService.upsertSubscription(
      parseInt(id, 10),
      data,
    );
  }

  @Get(':id/manager')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lists institution managers' })
  @ApiResponse({
    status: 200,
    description: 'Institution managers',
    type: [InstitutionManagerListDto],
  })
  async getInstitutionManagers(
    @Param('id') id: string,
  ): Promise<InstitutionManagerListDto[]> {
    return await this.institutionService.listManagers(parseInt(id, 10));
  }

  @Get(':id/manager/:walletAddress')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lists institution managers' })
  @ApiResponse({
    status: 200,
    description: 'Institution managers',
    type: [InstitutionManagerListDto],
  })
  async getInstitutionManager(
    @Param('id') id: string,
    @Param('walletAddress') walletAddress: string,
  ): Promise<InstitutionManagerDto> {
    return await this.institutionService.findManagerByAddress(walletAddress);
  }

  @Post(':id/manager')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpsertInstitutionManagerDto })
  @ApiOperation({ summary: 'Creates institution manager' })
  @ApiResponse({
    status: 200,
    description: 'Institution subscription',
    type: InstitutionManagerDto,
  })
  async createInstitutionManager(
    @Param('id') id: string,
    @Body() data: UpsertInstitutionManagerDto,
  ): Promise<InstitutionManagerDto> {
    return await this.institutionService.createManager(parseInt(id, 10), data);
  }

  @Put(':id/manager/:walletAddress')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpsertInstitutionManagerDto })
  @ApiOperation({ summary: 'Upsert institution subscription' })
  @ApiResponse({
    status: 200,
    description: 'Institution subscription',
    type: InstitutionManagerDto,
  })
  async updateInstitutionManager(
    @Param('id') id: string,
    @Param('walletAddress') walletAddress: string,
    @Body() data: UpsertInstitutionManagerDto,
  ): Promise<InstitutionManagerDto> {
    return await this.institutionService.updateManager({
      where: {
        institutionId: parseInt(id, 10),
        walletAddress: walletAddress,
      },
      data: {
        name: data.name,
        email: data.email,
      },
    });
  }
}
