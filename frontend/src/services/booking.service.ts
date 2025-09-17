import axios from 'axios'
import { BookingFormData, BookingService } from '../types/booking.types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// API instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface GuestBookingData {
  sessionId: string
  bookingData: BookingFormData
  isGuest: true
}

export interface AuthenticatedBookingData {
  userId: string
  bookingData: BookingFormData
  isGuest: false
}

export interface BookingResponse {
  success: boolean
  bookingId: string
  message: string
  confirmationCode?: string
  estimatedArrival?: string
}

export interface BookingConfirmation {
  bookingId: string
  confirmationCode: string
  serviceName: string
  scheduledDate: string
  scheduledTime: string
  totalAmount: number
  patientName: string
  address: string
  nurseAssigned?: {
    name: string
    phone: string
    profilePicture?: string
  }
  estimatedArrival: string
  paymentStatus: 'pending' | 'paid' | 'failed'
}

class BookingServiceClass {
  // Get available services
  async getServices(): Promise<BookingService[]> {
    try {
      const response = await api.get('/services')
      return response.data
    } catch (error) {
      console.error('Failed to fetch services:', error)
      // Return mock services for development
      return this.getMockServices()
    }
  }

  // Mock services for development
  private getMockServices(): BookingService[] {
    return [
      {
        id: 'health-assessment',
        name: 'Comprehensive Health Assessment',
        description: 'Complete health screening and medical evaluation at home',
        price: 5000,
        duration: 60,
        category: 'monitoring',
        icon: 'FaStethoscope',
        popular: true,
      },
      {
        id: 'vital-signs',
        name: 'Vital Signs Check',
        description: 'Blood pressure, temperature, heart rate monitoring',
        price: 5000,
        duration: 30,
        category: 'monitoring',
        icon: 'FaHeartbeat',
      },
      {
        id: 'medication-management',
        name: 'Medication Management',
        description: 'Medication administration and management assistance',
        price: 5000,
        duration: 45,
        category: 'nursing',
        icon: 'FaPills',
      },
      {
        id: 'wound-care',
        name: 'Wound Care',
        description: 'Professional wound cleaning, dressing, and care',
        price: 5000,
        duration: 30,
        category: 'nursing',
        icon: 'FaBandAid',
      },
      {
        id: 'emergency-assessment',
        name: '24/7 Emergency Health Assessment',
        description: 'Urgent health assessment for non-life-threatening emergencies',
        price: 5000,
        duration: 45,
        category: 'emergency',
        icon: 'FaAmbulance',
      },
    ]
  }

  // Create guest booking
  async createGuestBooking(guestData: GuestBookingData): Promise<BookingResponse> {
    try {
      const response = await api.post('/bookings/guest', {
        sessionId: guestData.sessionId,
        ...guestData.bookingData,
        bookingType: 'guest',
      })
      return response.data
    } catch (error) {
      console.error('Failed to create guest booking:', error)
      throw new Error('Failed to create booking. Please try again.')
    }
  }

  // Create authenticated user booking
  async createUserBooking(userData: AuthenticatedBookingData): Promise<BookingResponse> {
    try {
      const response = await api.post('/bookings/user', {
        userId: userData.userId,
        ...userData.bookingData,
        bookingType: 'authenticated',
      })
      return response.data
    } catch (error) {
      console.error('Failed to create user booking:', error)
      throw new Error('Failed to create booking. Please try again.')
    }
  }

  // Get booking confirmation details
  async getBookingConfirmation(bookingId: string, sessionId?: string): Promise<BookingConfirmation> {
    try {
      const params = sessionId ? { sessionId } : {}
      const response = await api.get(`/bookings/${bookingId}/confirmation`, { params })
      return response.data
    } catch (error) {
      console.error('Failed to fetch booking confirmation:', error)
      throw new Error('Failed to fetch booking details.')
    }
  }

  // Check booking status
  async getBookingStatus(bookingId: string, sessionId?: string): Promise<any> {
    try {
      const params = sessionId ? { sessionId } : {}
      const response = await api.get(`/bookings/${bookingId}/status`, { params })
      return response.data
    } catch (error) {
      console.error('Failed to check booking status:', error)
      throw new Error('Failed to check booking status.')
    }
  }

  // Cancel booking
  async cancelBooking(bookingId: string, sessionId?: string): Promise<{ success: boolean; message: string }> {
    try {
      const params = sessionId ? { sessionId } : {}
      const response = await api.delete(`/bookings/${bookingId}`, { params })
      return response.data
    } catch (error) {
      console.error('Failed to cancel booking:', error)
      throw new Error('Failed to cancel booking.')
    }
  }

  // Get guest bookings (by session ID)
  async getGuestBookings(sessionId: string): Promise<any[]> {
    try {
      const response = await api.get(`/bookings/guest/${sessionId}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch guest bookings:', error)
      return []
    }
  }

  // Get user bookings (authenticated)
  async getUserBookings(): Promise<any[]> {
    try {
      const response = await api.get('/bookings/user')
      return response.data
    } catch (error) {
      console.error('Failed to fetch user bookings:', error)
      return []
    }
  }

  // Convert guest booking to user account
  async convertGuestToUser(sessionId: string, userCredentials: { email: string; password: string }): Promise<{ success: boolean; userId: string }> {
    try {
      const response = await api.post('/bookings/convert-guest', {
        sessionId,
        ...userCredentials,
      })
      return response.data
    } catch (error) {
      console.error('Failed to convert guest to user:', error)
      throw new Error('Failed to create account.')
    }
  }

  // Check time slot availability
  async checkAvailability(date: string, serviceId: string): Promise<any> {
    try {
      const response = await api.get(`/services/${serviceId}/availability`, {
        params: { date }
      })
      return response.data
    } catch (error) {
      console.error('Failed to check availability:', error)
      // Return mock availability for development
      return this.getMockAvailability()
    }
  }

  private getMockAvailability() {
    // Generate mock time slots for the next 7 days
    const slots = []
    for (let hour = 8; hour <= 18; hour++) {
      ['00', '30'].forEach(minute => {
        const time = `${hour.toString().padStart(2, '0')}:${minute}`
        const displayTime = hour === 12 ? `12:${minute} PM` :
                           hour < 12 ? `${hour}:${minute} AM` :
                           `${hour - 12}:${minute} PM`

        slots.push({
          time: displayTime,
          available: Math.random() > 0.3, // 70% availability
          price: 5000
        })
      })
    }
    return { slots }
  }
}

// Export singleton instance
export const bookingService = new BookingServiceClass()
export default bookingService