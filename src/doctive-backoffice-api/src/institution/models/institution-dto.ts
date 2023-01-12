import { ApiProperty } from '@nestjs/swagger';
import { Institution } from '@prisma/client';

export class InstitutionListDto {
  @ApiProperty({ type: 'number' })
  id: number;
  @ApiProperty({ type: 'string' })
  name: string;
}

export class InstitutionDto extends InstitutionListDto implements Institution {
  @ApiProperty({ type: 'string' })
  fullAddress: string;
  @ApiProperty({ type: 'string' })
  email: string;
  @ApiProperty({ type: 'string' })
  phoneNr: string;
  @ApiProperty({ type: 'Date' })
  createdAt: Date;
  @ApiProperty({ type: 'Date' })
  modifiedAt: Date;
}
