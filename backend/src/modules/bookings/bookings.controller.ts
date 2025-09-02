// backend/src/modules/bookings/bookings.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  BookingResponseDto,
  BookingStatsResponseDto,
} from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/users.entity';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new assessment booking' })
  @ApiResponse({
    status: 201,
    description: 'Assessment booking created successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid assessment data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
  })
  async createBooking(
    @Request() req,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return await this.bookingsService.createBooking(
      req.user.id,
      createBookingDto,
    );
  }

  @Get('my-bookings')
  @ApiOperation({ summary: 'Get current user assessment bookings' })
  @ApiResponse({
    status: 200,
    description: 'User assessment bookings retrieved successfully',
    type: [BookingResponseDto],
  })
  async getMyBookings(@Request() req) {
    return await this.bookingsService.findUserBookings(req.user.id);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.NURSE)
  @ApiOperation({ summary: 'Get all assessment bookings (Admin/Nurse only)' })
  @ApiResponse({
    status: 200,
    description: 'All assessment bookings retrieved successfully',
    type: [BookingResponseDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async getAllBookings() {
    return await this.bookingsService.findAllBookings();
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get assessment booking statistics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Assessment booking statistics retrieved successfully',
    type: BookingStatsResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin access required',
  })
  async getBookingStats() {
    return await this.bookingsService.getBookingStats();
  }

  @Get('available-nurses')
  @ApiOperation({ summary: 'Get available healthcare professionals' })
  @ApiResponse({
    status: 200,
    description: 'Available healthcare professionals retrieved successfully',
  })
  async getAvailableNurses() {
    return await this.bookingsService.getAvailableNurses();
  }

  @Get('assessments')
  @ApiOperation({ summary: 'Get available assessment types' })
  @ApiResponse({
    status: 200,
    description: 'Available assessment types retrieved successfully',
  })
  async getAvailableAssessments() {
    return this.bookingsService.getAvailableAssessments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assessment booking by ID' })
  @ApiResponse({
    status: 200,
    description: 'Assessment booking retrieved successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Assessment booking not found' })
  async getBooking(@Param('id') id: string) {
    return await this.bookingsService.findBookingById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.NURSE)
  @ApiOperation({ summary: 'Update assessment booking (Admin/Nurse only)' })
  @ApiResponse({
    status: 200,
    description: 'Assessment booking updated successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Assessment booking not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async updateBooking(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return await this.bookingsService.updateBooking(id, updateBookingDto);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel assessment booking' })
  @ApiResponse({
    status: 200,
    description: 'Assessment booking cancelled successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Assessment booking not found' })
  @ApiResponse({ status: 400, description: 'Cannot cancel this booking' })
  @ApiResponse({
    status: 401,
    description: 'Not authorized to cancel this booking',
  })
  async cancelBooking(@Param('id') id: string, @Request() req) {
    console.log('Cancel controller - Received ID:', id);
    console.log('Cancel controller - User ID:', req.user.id);

    // Clean the ID - remove any quotes that might be added by Swagger
    const cleanId = id.replace(/['"]/g, '').trim();
    console.log('Cancel controller - Clean ID:', cleanId);

    return await this.bookingsService.cancelBooking(cleanId, req.user.id);
  }

  @Put(':id/assign-nurse')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Assign healthcare professional to assessment (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Healthcare professional assigned successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Assessment booking not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin access required',
  })
  async assignNurse(@Param('id') id: string, @Body('nurseId') nurseId: string) {
    const updateData: UpdateBookingDto = {
      nurseId,
      status: 'confirmed',
    };
    return await this.bookingsService.updateBooking(id, updateData);
  }

  @Put(':id/complete')
  @UseGuards(RolesGuard)
  @Roles(UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Complete assessment booking (Nurse/Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Assessment booking completed successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Assessment booking not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - nurse/admin access required',
  })
  async completeBooking(
    @Param('id') id: string,
    @Body()
    completionData: {
      assessmentNotes?: string;
      assessmentRecommendations?: string;
      followUpRequired?: boolean;
      followUpDate?: string;
    },
  ) {
    const updateData: UpdateBookingDto = {
      ...completionData,
      status: 'completed',
      paymentStatus: 'paid',
    };
    return await this.bookingsService.updateBooking(id, updateData);
  }
}
