// backend/src/modules/bookings/bookings.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Booking,
  BookingStatus,
  PaymentStatus,
} from './entities/booking.entity';
import { User, UserRole } from '../users/entities/users.entity';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Create assessment booking
  async createBooking(
    patientId: string,
    createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    try {
      console.log('=== CREATE ASSESSMENT BOOKING ===');
      console.log('Patient ID:', patientId);
      console.log('Booking Data:', createBookingDto);

      // Validate assessment price (must be exactly ₦5,000)
      if (
        createBookingDto.basePrice !== 5000 ||
        createBookingDto.totalPrice !== 5000
      ) {
        throw new BadRequestException(
          'Assessment price must be exactly ₦5,000',
        );
      }

      // Validate patient exists
      const patient = await this.userRepository.findOne({
        where: { id: patientId, role: UserRole.CLIENT },
      });

      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      // Create assessment booking
      const booking = this.bookingRepository.create({
        ...createBookingDto,
        patientId,
        status: BookingStatus.PENDING,
        paymentStatus:
          createBookingDto.paymentMethod === 'cash'
            ? PaymentStatus.CASH_ON_DELIVERY
            : PaymentStatus.PENDING,
      });

      const savedBooking = await this.bookingRepository.save(booking);
      console.log('✅ Assessment booking created:', savedBooking.id);

      // Return booking with patient information
      return await this.findBookingById(savedBooking.id);
    } catch (error) {
      console.error('Error creating assessment booking:', error);
      throw new InternalServerErrorException(
        'Failed to create assessment booking',
      );
    }
  }

  // Get user's bookings
  async findUserBookings(userId: string): Promise<Booking[]> {
    try {
      const bookings = await this.bookingRepository.find({
        where: { patientId: userId },
        relations: ['patient', 'nurse'],
        order: { createdAt: 'DESC' },
      });

      console.log(`Found ${bookings.length} bookings for user ${userId}`);
      return bookings;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw new InternalServerErrorException('Failed to fetch user bookings');
    }
  }

  // Get all bookings (Admin/Nurse only)
  async findAllBookings(): Promise<Booking[]> {
    try {
      const bookings = await this.bookingRepository.find({
        relations: ['patient', 'nurse'],
        order: { createdAt: 'DESC' },
      });

      console.log(`Found ${bookings.length} total bookings`);
      return bookings;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw new InternalServerErrorException('Failed to fetch bookings');
    }
  }

  // Get booking statistics
  async getBookingStats(): Promise<any> {
    try {
      const stats = await this.bookingRepository
        .createQueryBuilder('booking')
        .select([
          'COUNT(*) as total',
          'COUNT(CASE WHEN status = :pending THEN 1 END) as pending',
          'COUNT(CASE WHEN status = :confirmed THEN 1 END) as confirmed',
          'COUNT(CASE WHEN status = :completed THEN 1 END) as completed',
          'COUNT(CASE WHEN status = :cancelled THEN 1 END) as cancelled',
          'SUM(CASE WHEN status = :completed THEN total_price ELSE 0 END) as revenue',
        ])
        .setParameters({
          pending: BookingStatus.PENDING,
          confirmed: BookingStatus.CONFIRMED,
          completed: BookingStatus.COMPLETED,
          cancelled: BookingStatus.CANCELLED,
        })
        .getRawOne();

      const result = {
        total: parseInt(stats.total) || 0,
        pending: parseInt(stats.pending) || 0,
        confirmed: parseInt(stats.confirmed) || 0,
        completed: parseInt(stats.completed) || 0,
        cancelled: parseInt(stats.cancelled) || 0,
        revenue: parseFloat(stats.revenue) || 0,
      };

      console.log('📊 Booking statistics:', result);
      return result;
    } catch (error) {
      console.error('Error fetching booking statistics:', error);
      throw new InternalServerErrorException(
        'Failed to fetch booking statistics',
      );
    }
  }

  // Get available nurses
  async getAvailableNurses(): Promise<User[]> {
    try {
      const nurses = await this.userRepository.find({
        where: {
          role: UserRole.NURSE,
          // Remove status filter for now since we don't know the UserStatus enum values
        },
        select: [
          'id',
          'firstName',
          'lastName',
          'email',
          'phone',
          'avatar',
          'createdAt',
        ],
      });

      console.log(`Found ${nurses.length} available nurses`);
      return nurses;
    } catch (error) {
      console.error('Error fetching available nurses:', error);
      throw new InternalServerErrorException(
        'Failed to fetch available nurses',
      );
    }
  }

  // Get booking by ID
  async findBookingById(id: string): Promise<Booking> {
    try {
      const booking = await this.bookingRepository.findOne({
        where: { id },
        relations: ['patient', 'nurse'],
      });

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      return booking;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching booking by ID:', error);
      throw new InternalServerErrorException('Failed to fetch booking');
    }
  }

  // Update booking
  async updateBooking(
    id: string,
    updateData: Partial<UpdateBookingDto>,
  ): Promise<Booking> {
    try {
      const booking = await this.findBookingById(id);

      // Update booking with new data
      Object.assign(booking, updateData);
      booking.updatedAt = new Date();

      const updatedBooking = await this.bookingRepository.save(booking);
      console.log('✅ Booking updated:', updatedBooking.id);

      return updatedBooking;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw new InternalServerErrorException('Failed to update booking');
    }
  }

  // Cancel booking
  async cancelBooking(id: string, userId: string): Promise<Booking> {
    try {
      console.log('=== CANCEL BOOKING ===');
      console.log('Booking ID:', id);
      console.log('User ID:', userId);

      const booking = await this.findBookingById(id);
      console.log('✅ Booking found:', {
        id: booking.id,
        status: booking.status,
        patientId: booking.patientId,
      });

      // Check if user is authorized to cancel this booking
      if (booking.patientId !== userId) {
        throw new UnauthorizedException(
          'You can only cancel your own bookings',
        );
      }

      // Check if booking can be cancelled
      if (booking.status === BookingStatus.CANCELLED) {
        throw new BadRequestException('Booking is already cancelled');
      }

      if (booking.status === BookingStatus.COMPLETED) {
        throw new BadRequestException('Cannot cancel completed booking');
      }

      // Business rule: Can't cancel within 2 hours of appointment
      const appointmentTime = new Date(
        `${booking.scheduledDate}T${booking.scheduledTime}`,
      );
      const now = new Date();
      const timeDifference = appointmentTime.getTime() - now.getTime();
      const hoursUntilAppointment = timeDifference / (1000 * 60 * 60);

      if (hoursUntilAppointment < 2 && hoursUntilAppointment > 0) {
        throw new BadRequestException(
          'Cannot cancel booking within 2 hours of appointment time',
        );
      }

      // Cancel the booking
      booking.status = BookingStatus.CANCELLED;
      booking.cancelledAt = new Date();
      booking.updatedAt = new Date();

      const cancelledBooking = await this.bookingRepository.save(booking);
      console.log('✅ Booking cancelled successfully');

      return cancelledBooking;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error cancelling booking:', error);
      throw new InternalServerErrorException('Failed to cancel booking');
    }
  }

  // Get available assessment types
  getAvailableAssessments(): any[] {
    return [
      {
        id: 'general-health-assessment',
        name: 'General Health Assessment',
        category: 'general',
        duration: 60,
        price: 5000,
        description:
          'Comprehensive health evaluation with vital signs monitoring',
      },
      {
        id: 'elderly-care-assessment',
        name: 'Elderly Care Assessment',
        category: 'specialized',
        duration: 90,
        price: 5000,
        description:
          'Specialized assessment for seniors with mobility evaluation',
      },
      {
        id: 'chronic-condition-assessment',
        name: 'Chronic Condition Assessment',
        category: 'specialized',
        duration: 75,
        price: 5000,
        description: 'Assessment for patients with chronic health conditions',
      },
      {
        id: 'post-surgery-assessment',
        name: 'Post-Surgery Assessment',
        category: 'specialized',
        duration: 60,
        price: 5000,
        description: 'Recovery monitoring and wound assessment',
      },
      {
        id: 'mental-health-screening',
        name: 'Mental Health Screening',
        category: 'specialized',
        duration: 60,
        price: 5000,
        description: 'Confidential mental health and wellbeing assessment',
      },
      {
        id: 'maternal-health-assessment',
        name: 'Maternal Health Assessment',
        category: 'specialized',
        duration: 75,
        price: 5000,
        description: 'Prenatal and postnatal health assessment',
      },
      {
        id: 'pediatric-assessment',
        name: 'Pediatric Health Assessment',
        category: 'specialized',
        duration: 60,
        price: 5000,
        description:
          'Child-friendly health assessment and development screening',
      },
      {
        id: 'routine-checkup',
        name: 'Routine Health Check-up',
        category: 'routine',
        duration: 45,
        price: 5000,
        description: 'Regular preventive health assessment and wellness check',
      },
      {
        id: 'emergency-assessment',
        name: 'Emergency Health Assessment',
        category: 'emergency',
        duration: 45,
        price: 5000,
        description: 'Urgent assessment for non-life-threatening emergencies',
        availability: '24/7',
      },
    ];
  }
}
