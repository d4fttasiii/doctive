import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpsertInstitutionManagerDto {
  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'string' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string' })
  walletAddress: string;
}
