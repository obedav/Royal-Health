// backend/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { Public } from '../modules/auth/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
@Public() // Allow public access to health checks
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
        version: { type: 'string', example: '1.0.0' },
        environment: { type: 'string', example: 'production' },
        database: { type: 'string', example: 'connected' },
      },
    },
  })
  async check() {
    return await this.healthService.getHealthStatus();
  }

  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health check with system information' })
  @ApiResponse({ status: 200, description: 'Detailed health information' })
  async detailedCheck() {
    return await this.healthService.getDetailedHealthStatus();
  }
}
