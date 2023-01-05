import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UpdateUserDto implements User {
  @ApiProperty({ type: 'number' })
  id: number;
  @ApiProperty({ type: 'string' })
  address: string;
  @ApiProperty({ type: 'string' })
  name: string;
  @ApiProperty({ type: 'string' })
  email: string;
  @ApiProperty({ type: 'Date' })
  createdAt: Date;
  @ApiProperty({ type: 'Date' })
  modifiedAt: Date;
  @ApiProperty({ type: 'number' })
  role: number;
  @ApiProperty({ type: 'boolean' })
  lockEnabled: boolean;
  @ApiProperty({ type: 'number' })
  loginAttempts: number;
  @ApiProperty({ type: 'Date' })
  lockedUntil: Date;
}
