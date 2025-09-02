// backend/src/common/middleware/security.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLoggerService } from '../logger/logger.service';
import rateLimit from 'express-rate-limit';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Log suspicious requests
    this.detectSuspiciousActivity(req);

    // Set security headers
    this.setSecurityHeaders(res);

    next();
  }

  private detectSuspiciousActivity(req: Request) {
    const suspiciousPatterns = [
      /\.\.\//g, // Directory traversal
      /<script/gi, // XSS attempts
      /union.*select/gi, // SQL injection
      /javascript:/gi, // JavaScript injection
      /data:.*base64/gi, // Data URI attacks
    ];

    const userInput = JSON.stringify({
      url: req.url,
      query: req.query,
      body: req.body,
      headers: req.headers,
    });

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(userInput)) {
        this.logger.logSecurity('Suspicious request detected', 'high', {
          pattern: pattern.source,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          url: req.url,
          method: req.method,
        });
        break;
      }
    }
  }

  private setSecurityHeaders(res: Response) {
    // Additional security headers not covered by helmet
    res.setHeader('X-Request-ID', this.generateRequestId());
    res.setHeader('X-Response-Time', Date.now().toString());
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Rate limiting configuration
export const createRateLimiters = () => {
  // General API rate limiting
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Auth endpoints rate limiting (more restrictive)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 auth requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
  });

  // Password reset rate limiting (very restrictive)
  const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 password reset requests per hour
    message: 'Too many password reset attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  return {
    generalLimiter,
    authLimiter,
    passwordResetLimiter,
  };
};
