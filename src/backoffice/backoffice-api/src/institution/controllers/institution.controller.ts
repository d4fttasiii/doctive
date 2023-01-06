import { JwtAuthGuard } from '@/auth/guards/jwt-auth-guard';
import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { InstitutionDto, InstitutionListDto } from '../models/institution-dto';
import { UpsertInstitutionDto } from '../models/upsert-institution-dto';
import { InstitutionService } from '../services/institution.service';

@ApiTags('Institution')
@Controller({ version: '1', path: 'institution' })
export class InstitutionController {
    constructor(private institutionService: InstitutionService) { }

    @Get(':take/:skip')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Lists institutions' })
    @ApiResponse({ status: 200, description: 'List of institutions', type: [InstitutionListDto] })
    async getInstitutions(@Param('take') take: string, @Param('skip') skip: string): Promise<InstitutionListDto[]> {
        return await this.institutionService.list(
            take ? parseInt(take, 10) : 50,
            skip ? parseInt(skip, 10) : 0);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Gets institution details' })
    @ApiResponse({ status: 200, description: 'Institution details ', type: [InstitutionDto] })
    async getInstitution(@Param('id') id: string): Promise<InstitutionDto> {
        return await this.institutionService.findById(parseInt(id, 10));
    }

    @Post('')
    @UseGuards(JwtAuthGuard)
    @ApiBody({ type: UpsertInstitutionDto })
    @ApiOperation({ summary: 'Creates new institution' })
    @ApiResponse({ status: 200, description: 'New institution', type: InstitutionDto })
    async createUser(@Body() data: UpsertInstitutionDto): Promise<InstitutionDto> {
        return await this.institutionService.create({
            email: data.email,
            name: data.name,
            fullAddress: data.fullAddress,
            phoneNr: data.phoneNr
        });
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBody({ type: UpsertInstitutionDto })
    @ApiOperation({ summary: 'Updates institution' })
    @ApiResponse({ status: 200, description: 'Updated institution', type: InstitutionDto })
    async updateUser(@Param('id') id: string, @Body() data: UpsertInstitutionDto): Promise<InstitutionDto> {
        return this.institutionService.update({
            where: {
                id: parseInt(id, 10),
            },
            data: data,
        })
    }
}
