// backend/src/health/health.service.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async getHealthStatus() {
    const dbStatus = await this.checkDatabaseConnection();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus ? 'connected' : 'disconnected',
      memory: this.getMemoryUsage(),
      pid: process.pid,
    };
  }

  async getDetailedHealthStatus() {
    const basicHealth = await this.getHealthStatus();

    return {
      ...basicHealth,
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        cpuUsage: process.cpuUsage(),
        memoryUsage: process.memoryUsage(),
      },
      dependencies: {
        database: await this.getDatabaseInfo(),
      },
    };
  }

  private async checkDatabaseConnection(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  private async getDatabaseInfo() {
    try {
      const result = await this.dataSource.query('SELECT version()');
      return {
        status: 'connected',
        version: result[0]?.version || 'unknown',
        type: 'postgresql',
      };
    } catch (error) {
      return {
        status: 'disconnected',
        error: error.message,
        type: 'postgresql',
      };
    }
  }

  private getMemoryUsage() {
    const used = process.memoryUsage();
    return {
      rss: `${Math.round((used.rss / 1024 / 1024) * 100) / 100} MB`,
      heapTotal: `${Math.round((used.heapTotal / 1024 / 1024) * 100) / 100} MB`,
      heapUsed: `${Math.round((used.heapUsed / 1024 / 1024) * 100) / 100} MB`,
      external: `${Math.round((used.external / 1024 / 1024) * 100) / 100} MB`,
    };
  }
}
