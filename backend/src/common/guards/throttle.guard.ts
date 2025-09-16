// backend/src/common/guards/throttle.guard.ts
import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Request } from 'express';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class CustomThrottlerGuard implements CanActivate {
  private requests = new Map<string, { count: number; resetTime: number }>();

  constructor(private readonly logger: AppLoggerService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const key = `${request.ip}_${request.url}`;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 100; // 100 requests per minute

    const record = this.requests.get(key);

    if (!record) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (now > record.resetTime) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) {
      // Log rate limiting event
      this.logger.logSecurity('Rate limit exceeded', 'medium', {
        ip: request.ip || 'unknown',
        userAgent: request.headers['user-agent'] || 'unknown',
        url: request.url || 'unknown',
        method: request.method || 'unknown',
        limit: maxRequests,
        windowMs,
      });

      throw new ThrottlerException('Rate limit exceeded');
    }

    record.count++;
    return true;
  }
}
