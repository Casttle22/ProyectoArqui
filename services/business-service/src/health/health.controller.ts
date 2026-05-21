import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller(['health', 'negocios/health'])
export class HealthController {
  @Get()
  check() {
    return {
      service: 'business-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
