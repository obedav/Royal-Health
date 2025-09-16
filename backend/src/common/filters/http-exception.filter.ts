// backend/src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLoggerService } from '../logger/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    const exceptionResponse = exception.getResponse();

    // Extract error details
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      ...(typeof exceptionResponse === 'object' && exceptionResponse),
    };

    // Don't log 4xx client errors as errors, but log 5xx as errors
    if (status >= 500) {
      this.logger.logError(exception, 'HttpException', {
        url: request.url,
        method: request.method,
        statusCode: status,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
      });
    } else {
      this.logger.warn(`HTTP ${status}: ${message}`, 'HttpException');
    }

    // Security logging for specific cases
    if (
      status === Number(HttpStatus.UNAUTHORIZED) ||
      status === Number(HttpStatus.FORBIDDEN)
    ) {
      this.logger.logSecurity('Unauthorized access attempt', 'medium', {
        url: request.url,
        method: request.method,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
      });
    }

    response.status(status).json(errorResponse);
  }
}
