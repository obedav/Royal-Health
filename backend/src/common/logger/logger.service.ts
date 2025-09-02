// backend/src/common/logger/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, Logger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class AppLoggerService implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.json(),
        format.printf(
          ({ timestamp, level, message, context, trace, ...meta }) => {
            const logEntry = {
              timestamp,
              level: level.toUpperCase(),
              context,
              message,
              ...(trace && { trace }),
              ...(Object.keys(meta).length && { meta }),
            };
            return JSON.stringify(logEntry);
          },
        ),
      ),
      transports: [
        // Console transport for development
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple(),
            format.printf(({ timestamp, level, message, context }) => {
              return `${timestamp} [${context || 'Application'}] ${level}: ${message}`;
            }),
          ),
        }),
        // File transport for all logs
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(format.timestamp(), format.json()),
        }),
        // Error logs only
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
        }),
      ],
    });

    // Create logs directory if it doesn't exist
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    const fs = require('fs');
    const path = require('path');
    const logsDir = path.join(process.cwd(), 'logs');

    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Custom methods for structured logging
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    context: string = 'HTTP',
  ) {
    this.logger.info('Request processed', {
      context,
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
    });
  }

  logError(
    error: Error,
    context: string = 'Application',
    additionalData?: any,
  ) {
    this.logger.error(error.message, {
      context,
      stack: error.stack,
      name: error.name,
      ...(additionalData && { additionalData }),
    });
  }

  logAuth(action: string, userId?: string, email?: string, ip?: string) {
    this.logger.info(`Authentication: ${action}`, {
      context: 'Auth',
      userId,
      email,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logDatabase(
    operation: string,
    table?: string,
    duration?: number,
    error?: string,
  ) {
    const level = error ? 'error' : 'info';
    this.logger.log(level, `Database ${operation}`, {
      context: 'Database',
      table,
      duration: duration ? `${duration}ms` : undefined,
      error,
    });
  }

  logSecurity(
    event: string,
    severity: 'low' | 'medium' | 'high',
    details?: any,
  ) {
    this.logger.warn(`Security Event: ${event}`, {
      context: 'Security',
      severity,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  // Performance logging
  logPerformance(
    operation: string,
    duration: number,
    threshold: number = 1000,
  ) {
    const level = duration > threshold ? 'warn' : 'info';
    this.logger.log(level, `Performance: ${operation}`, {
      context: 'Performance',
      duration: `${duration}ms`,
      threshold: `${threshold}ms`,
      slow: duration > threshold,
    });
  }

  // Business logic logging
  logBusiness(event: string, userId?: string, data?: any) {
    this.logger.info(`Business Event: ${event}`, {
      context: 'Business',
      userId,
      data,
      timestamp: new Date().toISOString(),
    });
  }
}
