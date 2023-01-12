import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({ type: 'string' })
  access_token: string;
  @ApiProperty({ type: 'string' })
  refresh_token: string;
}
