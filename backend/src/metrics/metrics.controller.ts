// backend/src/metrics/metrics.controller.ts
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../modules/auth/guards/roles.guard';
import { Roles } from '../modules/auth/decorators/roles.decorator';
import { UserRole } from '../modules/users/entities/users.entity';

@ApiTags('Metrics')
@Controller('metrics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('health')
  @ApiOperation({ summary: 'Get health metrics with system status' })
  @ApiResponse({
    status: 200,
    description: 'Health metrics retrieved successfully',
  })
  @Roles(UserRole.ADMIN)
  getHealthMetrics() {
    return this.metricsService.getHealthMetrics();
  }

  @Get('system')
  @ApiOperation({ summary: 'Get system metrics (memory, CPU, uptime)' })
  @ApiResponse({
    status: 200,
    description: 'System metrics retrieved successfully',
  })
  @Roles(UserRole.ADMIN)
  getSystemMetrics() {
    return this.metricsService.getSystemMetrics();
  }

  @Get('application')
  @ApiOperation({
    summary: 'Get application metrics (requests, database, cache)',
  })
  @ApiResponse({
    status: 200,
    description: 'Application metrics retrieved successfully',
  })
  @Roles(UserRole.ADMIN)
  getApplicationMetrics() {
    return this.metricsService.getApplicationMetrics();
  }

  @Get('endpoints')
  @ApiOperation({ summary: 'Get detailed metrics for each endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Endpoint metrics retrieved successfully',
  })
  @Roles(UserRole.ADMIN)
  getEndpointMetrics() {
    return this.metricsService.getEndpointMetrics();
  }

  @Post('reset')
  @ApiOperation({ summary: 'Reset all metrics counters' })
  @ApiResponse({ status: 200, description: 'Metrics reset successfully' })
  @Roles(UserRole.ADMIN)
  resetMetrics() {
    this.metricsService.resetMetrics();
    return { message: 'Metrics reset successfully' };
  }
}
