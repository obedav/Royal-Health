// backend/src/modules/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes, createHash } from 'crypto';
import * as bcrypt from 'bcryptjs';

import { User, UserStatus } from '../users/entities/users.entity';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  AuthResponseDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Replace your register method in auth.service.ts with this:

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, phone, password, confirmPassword, ...userData } =
      registerDto;

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { phone }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already registered');
      }
      if (existingUser.phone === phone) {
        throw new ConflictException('Phone number already registered');
      }
    }

    // Create new user - only include fields that exist in the User entity
    const user = this.userRepository.create({
      email,
      phone,
      password_hash: password, // assign here
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      state: userData.state,
      city: userData.city,
      preferredLanguage: userData.preferredLanguage || 'en',
      emailVerificationToken: this.generateVerificationToken(),
      phoneVerificationCode: this.generatePhoneVerificationCode(),
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    const savedUser = await this.userRepository.save(user);

    // TODO: Send verification email and SMS
    // await this.emailService.sendVerificationEmail(savedUser);
    // await this.smsService.sendVerificationSMS(savedUser);

    // Generate tokens
    const tokens = await this.generateTokens(savedUser);

    return {
      ...tokens,
      user: this.sanitizeUser(savedUser),
      expiresIn: 3600, // 1 hour
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password, rememberMe } = loginDto;

    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);

    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      console.log('❌ User not found for email:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      loginAttempts: user.loginAttempts,
      isLocked: user.isLocked,
    });

    // Check if account is locked
    if (user.isLocked) {
      console.log('❌ Account locked until:', user.lockUntil);
      throw new UnauthorizedException(
        'Account temporarily locked due to too many failed attempts',
      );
    }

    // Check if account is suspended
    if (user.status === UserStatus.SUSPENDED) {
      console.log('❌ Account suspended');
      throw new UnauthorizedException(
        'Account suspended. Please contact support',
      );
    }

    // Verify password
    console.log('🔍 Comparing passwords...');

    let isPasswordValid = false;
    try {
      isPasswordValid = await user.comparePassword(password);
      console.log('Password comparison result:', isPasswordValid);
    } catch (error) {
      console.error('Password comparison error:', error);
      isPasswordValid = false;
    }

    if (!isPasswordValid) {
      console.log('❌ Password invalid - incrementing login attempts');
      // Use direct SQL update with correct column names (snake_case)
      await this.userRepository.query(
        'UPDATE users SET "login_attempts" = "login_attempts" + 1 WHERE id = $1',
        [user.id],
      );

      // Check if we need to lock the account
      if (user.loginAttempts + 1 >= 5) {
        const lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000);
        await this.userRepository.query(
          'UPDATE users SET "lock_until" = $1 WHERE id = $2',
          [lockUntil, user.id],
        );
      }

      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('✅ Password valid - logging in user');

    // Update login info using direct SQL with correct column names (snake_case)
    await this.userRepository.query(
      'UPDATE users SET "login_attempts" = 0, "lock_until" = NULL, "last_login_at" = NOW() WHERE id = $1',
      [user.id],
    );

    // Generate tokens
    const expiresIn = rememberMe ? 7 * 24 * 3600 : 3600; // 7 days or 1 hour
    const tokens = await this.generateTokens(user, expiresIn);

    console.log('✅ Login successful for user:', user.email);

    return {
      ...tokens,
      user: this.sanitizeUser(user),
      expiresIn,
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = this.generateResetToken();
    const resetTokenHash = createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.userRepository.save(user);

    // TODO: Send reset email
    // await this.emailService.sendPasswordResetEmail(user, resetToken);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, password, confirmPassword } = resetPasswordDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const resetTokenHash = createHash('sha256').update(token).digest('hex');

    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: resetTokenHash,
      },
    });

    if (!user || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Update password
    user.password_hash = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.resetLoginAttempts(); // Reset any login attempts

    await this.userRepository.save(user);

    return { message: 'Password reset successful' };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Update password
    user.password_hash = newPassword;
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.status = UserStatus.ACTIVE;

    await this.userRepository.save(user);

    return { message: 'Email verified successfully' };
  }

  async verifyPhone(
    userId: string,
    code: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.phoneVerificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    user.isPhoneVerified = true;
    user.phoneVerificationCode = null;

    await this.userRepository.save(user);

    return { message: 'Phone verified successfully' };
  }

  async resendVerification(
    userId: string,
    type: 'email' | 'phone',
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (type === 'email') {
      if (user.isEmailVerified) {
        throw new BadRequestException('Email already verified');
      }
      user.emailVerificationToken = this.generateVerificationToken();
      // TODO: Send verification email
      // await this.emailService.sendVerificationEmail(user);
    } else {
      if (user.isPhoneVerified) {
        throw new BadRequestException('Phone already verified');
      }
      user.phoneVerificationCode = this.generatePhoneVerificationCode();
      // TODO: Send verification SMS
      // await this.smsService.sendVerificationSMS(user);
    }

    await this.userRepository.save(user);

    return { message: `Verification ${type} sent successfully` };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);

      return {
        ...tokens,
        user: this.sanitizeUser(user),
        expiresIn: 3600,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(payload: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }

  private async generateTokens(user: User, expiresIn: number = 3600) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private generateVerificationToken(): string {
    return randomBytes(32).toString('hex');
  }

  private generatePhoneVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateResetToken(): string {
    return randomBytes(32).toString('hex');
  }

  private sanitizeUser(user: User) {
    const {
      password_hash, // 🔥 EXCLUDE sensitive fields
      passwordResetToken,
      emailVerificationToken,
      phoneVerificationCode,
      loginAttempts, // 🔥 EXCLUDE sensitive fields
      isLocked, // 🔥 EXCLUDE sensitive fields
      lockUntil, // 🔥 EXCLUDE sensitive fields
      ...sanitized
    } = user;

    return {
      ...sanitized,
      // Ensure dates are properly serialized (they'll become ISO strings in JSON)
      createdAt: sanitized.createdAt,
      updatedAt: sanitized.updatedAt,
    };
  }
}
