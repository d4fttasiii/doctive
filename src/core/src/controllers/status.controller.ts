import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Status')
@Controller({ version: '1', path: 'status' })
export class StatusController {
    @Get('')
    @ApiOperation({ summary: 'Returns HTTP 200, if the application is running.' })
    @ApiResponse({ status: 200, description: 'Application is running' })
    getStatus(): string {
        return `Application says: OK @ ${new Date().toUTCString()}`;
    }
}
