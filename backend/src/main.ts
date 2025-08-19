// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS Configuration - CRITICAL FIX
  app.enableCors({
    origin: [
      // Your Vercel domains - ADD ALL OF THESE
      'https://royal-health-testing.vercel.app',
      'https://royal-health-testing-git-main-david-m-gs-projects.vercel.app',
      'https://royal-health-testing-q1fpjru6e-david-m-gs-projects.vercel.app',
      // Wildcard for all Vercel preview deployments
      /^https:\/\/royal-health-testing-.*\.vercel\.app$/,
      // Local development
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:4173',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Royal Health API server running on port ${port}`);
  console.log(`🏥 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${port}/health`);
}

bootstrap();