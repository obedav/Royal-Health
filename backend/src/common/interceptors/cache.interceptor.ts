// backend/src/common/interceptors/cache.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;

    return next.handle().pipe(
      tap({
        next: () => {
          // Log cache miss/hit information
          const cacheInfo = request.headers['x-cache-status'];
          if (cacheInfo) {
            this.logger.log(`Cache ${cacheInfo} for ${method} ${url}`, 'Cache');
          }
        },
      }),
    );
  }
}

// Cache configuration helper
export interface CacheConfig {
  ttl: number; // Time to live in seconds
  key?: string; // Custom cache key
  condition?: (request: Request & { user?: any }) => boolean; // Condition for caching
}

export const getCacheKey = (
  context: ExecutionContext,
  customKey?: string,
): string => {
  const request = context.switchToHttp().getRequest<Request & { user?: any }>();

  if (customKey) {
    return customKey;
  }

  const { method, url, user } = request;
  const userId = user?.id || 'anonymous';

  return `${method}:${url}:${userId}`;
};

export const shouldCache = (context: ExecutionContext): boolean => {
  const request = context.switchToHttp().getRequest<Request & { user?: any }>();

  // Only cache GET requests
  if (request.method !== 'GET') {
    return false;
  }

  // Don't cache authenticated user-specific data unless explicitly configured
  if (request.user && !request.headers['x-cache-user-data']) {
    return false;
  }

  return true;
};
