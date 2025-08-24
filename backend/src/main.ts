// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS Configuration
  app.enableCors({
    origin: [
      'https://royal-health-testing.vercel.app',
      'https://royal-health-testing-git-main-david-m-gs-projects.vercel.app',
      'https://royal-health-testing-q1fpjru6e-david-m-gs-projects.vercel.app',
      /^https:\/\/royal-health-testing-.*\.vercel\.app$/,
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

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // 🔹 Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Royal Health API')
    .setDescription('API documentation for Royal Health system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Royal Health API server running on port ${port}`);
  console.log(`🏥 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${port}/health`);
  console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
