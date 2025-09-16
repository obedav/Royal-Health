import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../modules/users/entities/users.entity';
import { Booking } from '../modules/bookings/entities/booking.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';

  // Base configuration for MySQL
  const baseConfig: Partial<TypeOrmModuleOptions> = {
    type: 'mysql',
    entities: [User, Booking],
    autoLoadEntities: true,
    retryAttempts: 3,
    retryDelay: 3000,
    maxQueryExecutionTime: 10000, // 10 seconds
    charset: 'utf8mb4', // Support for emojis and special characters
    timezone: '+00:00', // UTC timezone
  };

  if (isProduction) {
    // Production MySQL configuration
    const host = configService.get<string>('DB_HOST');
    const port = parseInt(configService.get<string>('DB_PORT', '3306'));
    const username = configService.get<string>('DB_USERNAME');
    const password = configService.get<string>('DB_PASSWORD');
    const database = configService.get<string>('DB_DATABASE');
    
    if (!host || !username || !password || !database) {
      throw new Error('❌ Missing required MySQL connection parameters');
    }

    console.log(`🔗 Connecting to Production MySQL Database: ${host}:${port}/${database}...`);

    return {
      ...baseConfig,
      host,
      port,
      username,
      password,
      database,
      synchronize: false, // NEVER true in production
      logging: ['error', 'warn'], // Only log errors and warnings
      ssl: configService.get('DB_SSL') === 'true' ? {
        rejectUnauthorized: false,
      } : false,
      
      // MySQL specific connection pool settings
      extra: {
        connectionLimit: 20, // Maximum number of connections
        acquireTimeout: 30000, // 30 seconds
        timeout: 10000, // 10 seconds
        reconnect: true,
        idleTimeout: 300000, // 5 minutes
      },
    } as TypeOrmModuleOptions;
  }

  // Development MySQL configuration
  console.log('💻 Connecting to Development MySQL Database...');
  
  return {
    ...baseConfig,
    host: configService.get('DB_HOST', 'localhost'),
    port: parseInt(configService.get('DB_PORT', '3306')),
    username: configService.get('DB_USERNAME', 'root'),
    password: String(configService.get('DB_PASSWORD', '')),
    database: configService.get('DB_DATABASE', 'royal_health_db'),
    synchronize: false, // Temporarily disabled to reduce load
    logging: true,
    ssl: false,
    
    // Development connection pool - reduced for MariaDB compatibility
    extra: {
      connectionLimit: 5,
      acquireTimeout: 60000,
      timeout: 30000,
    },
  } as TypeOrmModuleOptions;
};