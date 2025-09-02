// backend/src/metrics/metrics.service.ts
import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '../common/logger/logger.service';

export interface SystemMetrics {
  uptime: number;
  memory: NodeJS.MemoryUsage;
  cpu: NodeJS.CpuUsage;
  timestamp: string;
}

export interface ApplicationMetrics {
  requests: {
    total: number;
    errors: number;
    avgResponseTime: number;
  };
  database: {
    connections: number;
    queries: number;
    errors: number;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
  };
}

@Injectable()
export class MetricsService {
  private metrics: {
    requests: Map<string, { count: number; totalTime: number; errors: number }>;
    startTime: number;
    totalRequests: number;
    totalErrors: number;
    dbQueries: number;
    dbErrors: number;
    cacheHits: number;
    cacheMisses: number;
  };

  constructor(private readonly logger: AppLoggerService) {
    this.metrics = {
      requests: new Map(),
      startTime: Date.now(),
      totalRequests: 0,
      totalErrors: 0,
      dbQueries: 0,
      dbErrors: 0,
      cacheHits: 0,
      cacheMisses: 0,
    };
  }

  // Record request metrics
  recordRequest(
    method: string,
    path: string,
    statusCode: number,
    responseTime: number,
  ) {
    const key = `${method} ${path}`;
    const existing = this.metrics.requests.get(key) || {
      count: 0,
      totalTime: 0,
      errors: 0,
    };

    existing.count++;
    existing.totalTime += responseTime;

    if (statusCode >= 400) {
      existing.errors++;
      this.metrics.totalErrors++;
    }

    this.metrics.requests.set(key, existing);
    this.metrics.totalRequests++;
  }

  // Record database metrics
  recordDatabaseQuery(success: boolean, duration?: number) {
    this.metrics.dbQueries++;
    if (!success) {
      this.metrics.dbErrors++;
    }

    if (duration) {
      this.logger.logDatabase(
        'Query executed',
        undefined,
        duration,
        success ? undefined : 'Query failed',
      );
    }
  }

  // Record cache metrics
  recordCacheHit() {
    this.metrics.cacheHits++;
  }

  recordCacheMiss() {
    this.metrics.cacheMisses++;
  }

  // Get system metrics
  getSystemMetrics(): SystemMetrics {
    return {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      timestamp: new Date().toISOString(),
    };
  }

  // Get application metrics
  getApplicationMetrics(): ApplicationMetrics {
    const totalCacheRequests =
      this.metrics.cacheHits + this.metrics.cacheMisses;
    const hitRate =
      totalCacheRequests > 0 ? this.metrics.cacheHits / totalCacheRequests : 0;

    // Calculate average response time
    let totalTime = 0;
    let totalRequests = 0;

    for (const [, data] of this.metrics.requests) {
      totalTime += data.totalTime;
      totalRequests += data.count;
    }

    const avgResponseTime = totalRequests > 0 ? totalTime / totalRequests : 0;

    return {
      requests: {
        total: this.metrics.totalRequests,
        errors: this.metrics.totalErrors,
        avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      },
      database: {
        connections: 1, // This would need to be tracked from your connection pool
        queries: this.metrics.dbQueries,
        errors: this.metrics.dbErrors,
      },
      cache: {
        hits: this.metrics.cacheHits,
        misses: this.metrics.cacheMisses,
        hitRate: Math.round(hitRate * 10000) / 100, // Percentage with 2 decimal places
      },
    };
  }

  // Get detailed endpoint metrics
  getEndpointMetrics() {
    const endpoints = [];

    for (const [endpoint, data] of this.metrics.requests) {
      const avgResponseTime = data.count > 0 ? data.totalTime / data.count : 0;
      const errorRate = data.count > 0 ? (data.errors / data.count) * 100 : 0;

      endpoints.push({
        endpoint,
        requests: data.count,
        errors: data.errors,
        avgResponseTime: Math.round(avgResponseTime * 100) / 100,
        errorRate: Math.round(errorRate * 100) / 100,
      });
    }

    return endpoints.sort((a, b) => b.requests - a.requests);
  }

  // Health check with metrics
  getHealthMetrics() {
    const system = this.getSystemMetrics();
    const application = this.getApplicationMetrics();

    // Determine health status based on metrics
    const memoryUsagePercent =
      (system.memory.heapUsed / system.memory.heapTotal) * 100;
    const errorRate =
      application.requests.total > 0
        ? (application.requests.errors / application.requests.total) * 100
        : 0;

    let status = 'healthy';
    const alerts = [];

    if (memoryUsagePercent > 85) {
      status = 'warning';
      alerts.push(`High memory usage: ${memoryUsagePercent.toFixed(2)}%`);
    }

    if (errorRate > 10) {
      status = 'critical';
      alerts.push(`High error rate: ${errorRate.toFixed(2)}%`);
    }

    if (application.requests.avgResponseTime > 2000) {
      status = status === 'critical' ? 'critical' : 'warning';
      alerts.push(
        `Slow response time: ${application.requests.avgResponseTime}ms`,
      );
    }

    return {
      status,
      alerts,
      system,
      application,
      timestamp: new Date().toISOString(),
    };
  }

  // Reset metrics (useful for testing or periodic resets)
  resetMetrics() {
    this.metrics.requests.clear();
    this.metrics.totalRequests = 0;
    this.metrics.totalErrors = 0;
    this.metrics.dbQueries = 0;
    this.metrics.dbErrors = 0;
    this.metrics.cacheHits = 0;
    this.metrics.cacheMisses = 0;
    this.metrics.startTime = Date.now();

    this.logger.log('Metrics reset', 'MetricsService');
  }
}
