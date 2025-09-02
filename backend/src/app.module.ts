// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { CompanyModule } from './modules/company/company.module';
import { SupportModule } from './modules/support/support.module';
import { ContactModule } from './modules/contact/contact.module';
import { HealthModule } from './health/health.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { LoggerModule } from './common/logger/logger.module';
import { CacheModule } from './common/cache/cache.module';
import { MetricsModule } from './metrics/metrics.module';

// Import guards
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { CustomThrottlerGuard } from './common/guards/throttle.guard';

// Import interceptors
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

// Import filters
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// Import entities
import { User } from './modules/users/entities/users.entity';
import { Booking } from './modules/bookings/entities/booking.entity';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Logger module (Global)
    LoggerModule,

    // Cache module (Global)
    CacheModule,

    // Database Configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        if (isProduction) {
          const directUrl = configService.get<string>('DATABASE_URL_DIRECT');
          const poolerUrl = configService.get<string>('DATABASE_URL_POOLER');
          const fallbackUrl = configService.get<string>('DATABASE_URL');

          const databaseUrl = directUrl || poolerUrl || fallbackUrl;
          if (!databaseUrl) {
            throw new Error('❌ No production DATABASE_URL found');
          }

          console.log(
            `🔗 Connecting to Supabase Database (${directUrl ? 'Direct' : poolerUrl ? 'Pooler' : 'Default'})...`,
          );

          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, Booking],
            synchronize: false, // Never in production
            logging: false,
            ssl: { rejectUnauthorized: false }, // SSL enabled for production
          };
        }

        // Local development config
        console.log(
          '💻 Connecting to Local Postgres Database (Development)...',
        );

        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: parseInt(configService.get('DB_PORT', '5432')),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: String(configService.get('DB_PASSWORD', 'postgres')),
          database: configService.get('DB_DATABASE', 'royal_health_db'),
          entities: [User, Booking],
          synchronize: true,
          logging: true,
          ssl: false, // SSL disabled for local dev
        };
      },
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    BookingsModule,
    NotificationsModule,

    // New modules for Contact page
    CompanyModule,
    SupportModule,
    ContactModule,

    // Health check module
    HealthModule,

    // Metrics module
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global guards
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    // Global interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // Global filters
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
