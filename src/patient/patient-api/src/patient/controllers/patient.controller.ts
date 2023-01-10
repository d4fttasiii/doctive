import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Patient')
@Controller({ version: '1', path: 'patient' })
export class PatientController {
    
}
