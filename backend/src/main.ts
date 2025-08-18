// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // CORS configuration - UPDATED to include Vercel domains
  const corsOrigins = configService.get('CORS_ORIGIN')?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://royal-health-testing-r2we00vpm-david-m-gs-projects.vercel.app',
    'https://*.vercel.app', // Allow all Vercel preview domains
    'https://your-frontend-domain.com' // Add your custom domain when you have one
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin matches any allowed pattern
      const isAllowed = corsOrigins.some(allowedOrigin => {
        if (allowedOrigin.includes('*')) {
          // Handle wildcard patterns like *.vercel.app
          const pattern = allowedOrigin.replace(/\*/g, '.*');
          return new RegExp('^' + pattern + '$').test(origin);
        }
        return allowedOrigin === origin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.log('❌ CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1', {
    exclude: ['/', '/health'],
  });

  // Swagger documentation
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Royal Health API')
      .setDescription('Healthcare services platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Authentication')
      .addTag('Users')
      .addTag('Bookings')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      message: 'Royal Health API is running',
      timestamp: new Date().toISOString(),
      environment: configService.get('NODE_ENV') || 'development',
    });
  });

  // Root endpoint
  app.getHttpAdapter().get('/', (req, res) => {
    res.status(200).json({
      message: 'Welcome to Royal Health API',
      version: '1.0.0',
      documentation: '/api/docs',
      health: '/health',
    });
  });

  const port = configService.get('PORT', 3001);
  await app.listen(port, '0.0.0.0'); // Listen on all interfaces

  console.log(`🚀 Royal Health API server running on port ${port}`);
  console.log(`🏥 Environment: ${configService.get('NODE_ENV') || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${port}/health`);
  
  if (configService.get('NODE_ENV') !== 'production') {
    console.log(`📱 Local API: http://localhost:${port}/api/v1`);
    console.log(`📚 API Docs: http://localhost:${port}/api/docs`);
  }
}

bootstrap();