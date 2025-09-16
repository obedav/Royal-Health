// backend/src/common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'Unknown';

    // Log incoming request
    this.logger.log(`Incoming ${method} ${url}`, 'HTTP');

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>();
          const { statusCode } = response;
          const responseTime = Date.now() - startTime;

          // Log successful response
          this.logger.logRequest(
            method || 'UNKNOWN',
            url || 'unknown',
            statusCode,
            responseTime,
          );

          // Log performance if slow
          if (responseTime > 1000) {
            this.logger.logPerformance(
              `${method || 'UNKNOWN'} ${url || 'unknown'}`,
              responseTime,
            );
          }
        },
        error: (error: Error) => {
          const responseTime = Date.now() - startTime;

          // Log error with context
          this.logger.logError(error, 'HTTP', {
            method: method || 'UNKNOWN',
            url: url || 'unknown',
            ip: ip || 'unknown',
            userAgent,
            responseTime,
          });
        },
      }),
    );
  }
}
