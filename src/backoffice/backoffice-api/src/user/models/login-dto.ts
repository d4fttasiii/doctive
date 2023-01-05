import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ type: 'string' })
    address: string;
    @ApiProperty({ type: 'string' })
    signature: string;
}