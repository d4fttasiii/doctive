import { ApiProperty } from '@nestjs/swagger';

export class UpsertInstitutionSubscriptionDto {
  @ApiProperty({ type: 'boolean' })
  isActive: boolean;
}
