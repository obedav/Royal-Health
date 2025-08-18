// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BookingsModule } from './modules/bookings/bookings.module';

// Import guards
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';

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

    // Database Configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const directUrl = configService.get<string>('DATABASE_URL_DIRECT');
        const poolerUrl = configService.get<string>('DATABASE_URL_POOLER');
        const fallbackUrl = configService.get<string>('DATABASE_URL'); // optional legacy

        if (isProduction) {
          // Prefer Direct, fallback to Pooler, then legacy DATABASE_URL
          const databaseUrl = directUrl || poolerUrl || fallbackUrl;
          if (!databaseUrl) {
            throw new Error('❌ No production DATABASE_URL found');
          }

          console.log(`🔗 Connecting to Supabase Database (${directUrl ? 'Direct' : poolerUrl ? 'Pooler' : 'Default'})...`);
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, Booking],
            synchronize: false, // Never in prod
            logging: false,
            ssl: { rejectUnauthorized: false },
          };
        }

        console.log('💻 Connecting to Local Postgres Database (Development)...');
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: parseInt(configService.get('DB_PORT', '5432')),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: String(configService.get('DB_PASSWORD', 'postgres')),
          database: configService.get('DB_NAME', 'postgres'),
          entities: [User, Booking],
          synchronize: true, // Safe for dev
          logging: true,
          ssl: { rejectUnauthorized: false },
        };
      },
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    BookingsModule,
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
  ],
})
export class AppModule {}
