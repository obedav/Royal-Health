// backend/src/modules/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator'; // Add this import
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  VerifyEmailDto,
  VerifyPhoneDto,
  ResendVerificationDto,
  AuthResponseDto,
  MessageResponseDto,
} from './dto/auth.dto';
import { User } from '../users/entities/users.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // Add this decorator
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation errors',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - email or phone already exists',
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public() // Add this decorator
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public() // Add this decorator
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent if email exists',
    type: MessageResponseDto,
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<MessageResponseDto> {
    const result = await this.authService.forgotPassword(forgotPasswordDto);
    return { ...result, success: true };
  }

  @Public() // Add this decorator
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({
    status: 200,
    description: 'Password successfully reset',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid or expired token',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    const result = await this.authService.resetPassword(resetPasswordDto);
    return { ...result, success: true };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({
    status: 200,
    description: 'Password successfully changed',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid current password',
  })
  async changePassword(
    @Req() req: Request & { user: User },
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<MessageResponseDto> {
    const result = await this.authService.changePassword(
      req.user.id,
      changePasswordDto,
    );
    return { ...result, success: true };
  }

  @Public() // Add this decorator
  @Get('verify-email/:token')
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({
    status: 200,
    description: 'Email successfully verified',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid verification token',
  })
  async verifyEmail(
    @Param('token') token: string,
  ): Promise<MessageResponseDto> {
    const result = await this.authService.verifyEmail(token);
    return { ...result, success: true };
  }

  @Post('verify-phone')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify phone number' })
  @ApiResponse({
    status: 200,
    description: 'Phone successfully verified',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid verification code',
  })
  async verifyPhone(
    @Req() req: Request & { user: User },
    @Body() verifyPhoneDto: VerifyPhoneDto,
  ): Promise<MessageResponseDto> {
    const result = await this.authService.verifyPhone(
      req.user.id,
      verifyPhoneDto.code,
    );
    return { ...result, success: true };
  }

  @Post('resend-verification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend verification email or SMS' })
  @ApiResponse({
    status: 200,
    description: 'Verification sent successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - already verified',
  })
  async resendVerification(
    @Req() req: Request & { user: User },
    @Body() resendVerificationDto: ResendVerificationDto,
  ): Promise<MessageResponseDto> {
    const result = await this.authService.resendVerification(
      req.user.id,
      resendVerificationDto.type,
    );
    return { ...result, success: true };
  }

  @Public() // Add this decorator
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          description: 'Refresh token',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token successfully refreshed',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid refresh token',
  })
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid token',
  })
  async getProfile(@Req() req: Request & { user: User }) {
    const {
      password_hash,
      passwordResetToken,
      emailVerificationToken,
      phoneVerificationCode,
      ...user
    } = req.user;
    return {
      success: true,
      data: user,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
    type: MessageResponseDto,
  })
  async logout(
    @Req() req: Request & { user: User },
  ): Promise<MessageResponseDto> {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    // The client should remove the token from storage
    return {
      message: 'Successfully logged out',
      success: true,
    };
  }

  @Public()
  @Get('debug/db-test')
  @ApiOperation({
    summary: 'Test database connection (temporary debug endpoint)',
  })
  async testDbConnection() {
    try {
      const result = await this.authService.testDatabaseConnection();
      return {
        success: true,
        message: 'Database connection successful',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Database connection failed',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      };
    }
  }
}
