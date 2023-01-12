import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpsertUserDto {
  @ApiProperty({ type: 'string' })
  walletAddress: string;

  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'string' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'number' })
  role: number;

  @ApiProperty({ type: 'boolean' })
  lockEnabled: boolean;
}
