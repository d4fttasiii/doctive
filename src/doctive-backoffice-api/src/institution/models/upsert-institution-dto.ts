import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpsertInstitutionDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'string' })
  fullAddress: string;

  @ApiProperty({ type: 'string' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string' })
  phoneNr: string;
}
