// backend/src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLoggerService } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let stack: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      stack = exception.stack;
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Internal server error';
      stack = exception.stack;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Unknown error occurred';
      stack = exception ? String(exception) : 'Unknown error';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : message,
      ...(process.env.NODE_ENV !== 'production' && { stack }),
    };

    // Log all unhandled exceptions as errors
    this.logger.logError(new Error(message), 'UnhandledException', {
      originalException:
        exception instanceof Error ? exception.message : String(exception),
      url: request.url,
      method: request.method,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      stack,
    });

    // Security alert for frequent errors from same IP
    this.logger.logSecurity('Unhandled exception occurred', 'high', {
      url: request.url,
      method: request.method,
      ip: request.ip,
      statusCode: status,
    });

    response.status(status).json(errorResponse);
  }
}
