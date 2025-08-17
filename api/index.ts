import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../backend/src/app.module';

let app: any;

export default async function handler(req: any, res: any) {
  if (!app) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule, 
      new ExpressAdapter(expressApp)
    );
    
    // CORS configuration for your frontend
    nestApp.enableCors({
      origin: [
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
        'https://royal-health.vercel.app',
        'http://localhost:3000'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    
    // Set API prefix (same as your current setup)
    nestApp.setGlobalPrefix('api/v1');
    
    await nestApp.init();
    app = nestApp.getHttpAdapter().getInstance();
  }
  
  return app(req, res);
}