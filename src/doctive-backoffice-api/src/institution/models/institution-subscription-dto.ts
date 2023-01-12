import { ApiProperty } from '@nestjs/swagger';
import { InstitutionSubscription } from '@prisma/client';

export class InstitutionSubscriptionDto implements InstitutionSubscription {
  @ApiProperty({ type: 'number' })
  id: number;
  @ApiProperty({ type: 'boolean' })
  isActive: boolean;
  @ApiProperty({ type: 'Date' })
  createdAt: Date;
  @ApiProperty({ type: 'Date' })
  modifiedAt: Date;
  @ApiProperty({ type: 'number' })
  institutionId: number;
}
