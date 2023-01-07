import { ApiProperty } from "@nestjs/swagger";
import { InstitutionManager } from "@prisma/client";

export class InstitutionManagerListDto {
    @ApiProperty({ type: 'number' })
    id: number;
    @ApiProperty({ type: 'string' })
    walletAddress: string;
    @ApiProperty({ type: 'string' })
    name: string;
    @ApiProperty({ type: 'string' })
    email: string;
}

export class InstitutionManagerDto extends InstitutionManagerListDto implements InstitutionManager {
    @ApiProperty({ type: 'Date' })
    createdAt: Date;
    @ApiProperty({ type: 'Date' })
    modifiedAt: Date;
    @ApiProperty({ type: 'number' })
    institutionId: number;
}