import { create } from 'zustand'
import { BookingFormData, BookingService } from '../types/booking.types'

interface GuestSession {
  sessionId: string
  email?: string
  phone: string
  name: string
  createdAt: number
}

interface BookingState {
  // Current booking data
  currentBooking: Partial<BookingFormData> | null
  selectedService: BookingService | null

  // Guest session management
  guestSession: GuestSession | null
  isGuestUser: boolean

  // UI state
  isLoading: boolean
  error: string | null
  currentStep: number

  // Actions
  setSelectedService: (service: BookingService) => void
  updateBookingData: (data: Partial<BookingFormData>) => void
  setCurrentStep: (step: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Guest session actions
  createGuestSession: (phone: string, email?: string, name?: string) => void
  getGuestSession: () => GuestSession | null
  clearGuestSession: () => void

  // Reset
  resetBooking: () => void
}

// Generate guest session ID
const generateSessionId = (): string => {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Session storage helpers
const GUEST_SESSION_KEY = 'royal_health_guest_session'

const saveGuestSession = (session: GuestSession) => {
  try {
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session))
  } catch (error) {
    console.warn('Failed to save guest session:', error)
  }
}

const loadGuestSession = (): GuestSession | null => {
  try {
    const saved = localStorage.getItem(GUEST_SESSION_KEY)
    if (!saved) return null

    const session = JSON.parse(saved) as GuestSession
    // Check if session is not older than 24 hours
    const isExpired = Date.now() - session.createdAt > 24 * 60 * 60 * 1000

    if (isExpired) {
      localStorage.removeItem(GUEST_SESSION_KEY)
      return null
    }

    return session
  } catch (error) {
    console.warn('Failed to load guest session:', error)
    return null
  }
}

const clearGuestSession = () => {
  try {
    localStorage.removeItem(GUEST_SESSION_KEY)
  } catch (error) {
    console.warn('Failed to clear guest session:', error)
  }
}

export const useBookingStore = create<BookingState>((set, get) => ({
  // Initial state
  currentBooking: null,
  selectedService: null,
  guestSession: loadGuestSession(),
  isGuestUser: false,
  isLoading: false,
  error: null,
  currentStep: 1,

  // Service selection
  setSelectedService: (service) => {
    set({ selectedService: service, currentStep: 2 })
  },

  // Booking data management
  updateBookingData: (data) => {
    set((state) => ({
      currentBooking: {
        ...state.currentBooking,
        ...data,
      },
    }))
  },

  // UI state management
  setCurrentStep: (step) => set({ currentStep: step }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Guest session management
  createGuestSession: (phone, email, name) => {
    const session: GuestSession = {
      sessionId: generateSessionId(),
      phone,
      email,
      name: name || 'Guest User',
      createdAt: Date.now(),
    }

    saveGuestSession(session)
    set({
      guestSession: session,
      isGuestUser: true,
      currentBooking: {
        patientPhone: phone,
        patientEmail: email,
        patientName: name || 'Guest User',
      }
    })
  },

  getGuestSession: () => {
    const session = get().guestSession
    if (session) {
      // Check if session is still valid
      const isExpired = Date.now() - session.createdAt > 24 * 60 * 60 * 1000
      if (isExpired) {
        get().clearGuestSession()
        return null
      }
    }
    return session
  },

  clearGuestSession: () => {
    clearGuestSession()
    set({
      guestSession: null,
      isGuestUser: false
    })
  },

  // Reset booking
  resetBooking: () => {
    set({
      currentBooking: null,
      selectedService: null,
      currentStep: 1,
      error: null,
      isLoading: false,
    })
  },
}))

// Helper hook for guest user detection
export const useIsGuestUser = () => {
  const { guestSession, isGuestUser } = useBookingStore()
  return guestSession !== null || isGuestUser
}

// Helper hook for guest session data
export const useGuestSession = () => {
  const { guestSession, getGuestSession, createGuestSession, clearGuestSession } = useBookingStore()
  return {
    session: guestSession,
    getSession: getGuestSession,
    createSession: createGuestSession,
    clearSession: clearGuestSession,
    isGuest: guestSession !== null,
  }
}