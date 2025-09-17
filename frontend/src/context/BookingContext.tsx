import React, { createContext, useContext, useState, ReactNode } from 'react'

// Types for consultation data
interface ConsultationData {
  name: string
  phone: string
  email?: string
  age: number
  gender: 'male' | 'female' | 'other'
  serviceType: string
  state: string
  city: string
  address: string
  healthConcerns?: string
  preferredDate: string
  preferredTime: 'morning' | 'afternoon' | 'evening'
}

// Types for patient information (booking format)
interface PatientInformation {
  firstName: string
  lastName: string
  phone: string
  email?: string
  age: number
  gender: 'male' | 'female' | 'other'
  address: {
    street: string
    area: string
    city: string
    state: string
    landmark?: string
  }
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  medicalHistory?: {
    conditions?: string
    medications?: string
    allergies?: string
    previousTreatments?: string
  }
  healthConcerns?: string
}

// Context interface
interface BookingContextType {
  consultationData: ConsultationData | null
  setConsultationData: (data: ConsultationData | null) => void
  convertConsultationToPatientInfo: (consultationData: ConsultationData) => Partial<PatientInformation>
  clearBookingData: () => void
}

// Create context
const BookingContext = createContext<BookingContextType | undefined>(undefined)

// Provider component
export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [consultationData, setConsultationData] = useState<ConsultationData | null>(null)

  // Convert consultation form data to patient information format
  const convertConsultationToPatientInfo = (data: ConsultationData): Partial<PatientInformation> => {
    // Split name into first and last name
    const nameParts = data.name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    return {
      firstName,
      lastName,
      phone: data.phone,
      email: data.email || '',
      age: data.age,
      gender: data.gender,
      address: {
        street: data.address,
        area: '', // Will need to be filled manually
        city: data.city,
        state: data.state,
        landmark: '',
      },
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
      },
      medicalHistory: {
        conditions: '',
        medications: '',
        allergies: '',
        previousTreatments: '',
      },
      healthConcerns: data.healthConcerns || '',
    }
  }

  const clearBookingData = () => {
    setConsultationData(null)
  }

  const value: BookingContextType = {
    consultationData,
    setConsultationData,
    convertConsultationToPatientInfo,
    clearBookingData,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

// Custom hook to use the context
export const useBookingContext = (): BookingContextType => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider')
  }
  return context
}

// Helper function to get schedule data from consultation
export const getScheduleFromConsultation = (data: ConsultationData) => {
  const timeSlotMap = {
    morning: { time: '09:00 AM', available: true },
    afternoon: { time: '02:00 PM', available: true },
    evening: { time: '06:00 PM', available: true },
  }

  return {
    date: data.preferredDate,
    timeSlot: timeSlotMap[data.preferredTime],
    address: {
      street: data.address,
      area: '',
      city: data.city,
      state: data.state,
      landmark: '',
    },
    notes: data.healthConcerns || '',
  }
}

export default BookingContext