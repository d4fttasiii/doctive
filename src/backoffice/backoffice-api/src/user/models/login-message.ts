import { ApiProperty } from "@nestjs/swagger";

export class LoginMessage {
    @ApiProperty({ type: 'string' })
    message: string;
}
