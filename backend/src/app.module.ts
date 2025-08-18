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
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (isProduction && databaseUrl) {
          console.log('🔗 Connecting to Supabase/Render Database (Production)...');
          return {
            type: 'postgres',
            url: databaseUrl, // Pooler URI from Supabase
            entities: [User, Booking],
            synchronize: false, // Never sync in production
            logging: false,
            ssl: {
              rejectUnauthorized: false,
            },
            extra: {
              ssl: true,
            },
          };
        }

        console.log('💻 Connecting to Local Postgres Database (Development)...');
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: parseInt(configService.get('DB_PORT', '5432')),
          username: configService.get('DB_USERNAME'),
          password: String(configService.get('DB_PASSWORD')),
          database: configService.get('DB_NAME'),
          entities: [User, Booking],
          synchronize: true, // OK for dev
          logging: true,
          ssl: false,
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
