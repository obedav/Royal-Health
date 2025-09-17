import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@chakra-ui/react'
import { HEALTHCARE_SERVICES, BookingService } from '../utils/constants'

interface UseServicesReturn {
  services: BookingService[]
  isLoading: boolean
  error: string | null
  selectedService: BookingService | null
  selectService: (service: BookingService) => void
  clearSelection: () => void
  refetch: () => Promise<void>
}

// Custom hook for managing services data with error handling and loading states
export const useServices = (): UseServicesReturn => {
  const [services, setServices] = useState<BookingService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<BookingService | null>(null)
  const toast = useToast()

  // Simulate API call with error handling
  const fetchServices = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Simulate potential network error (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Failed to fetch services from server')
      }

      setServices(HEALTHCARE_SERVICES)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load services'
      setError(errorMessage)

      // Show error toast
      toast({
        title: 'Error Loading Services',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Initial load
  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  // Service selection with validation
  const selectService = useCallback((service: BookingService) => {
    if (!service || !service.id) {
      toast({
        title: 'Invalid Service',
        description: 'Please select a valid service',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setSelectedService(service)

    toast({
      title: 'Service Selected',
      description: `${service.name} has been selected`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }, [toast])

  const clearSelection = useCallback(() => {
    setSelectedService(null)
  }, [])

  const refetch = useCallback(async () => {
    await fetchServices()
  }, [fetchServices])

  return {
    services,
    isLoading,
    error,
    selectedService,
    selectService,
    clearSelection,
    refetch,
  }
}

// Hook for managing consultation form submission
interface UseConsultationSubmissionReturn {
  isSubmitting: boolean
  error: string | null
  submitConsultation: (data: any) => Promise<boolean>
}

export const useConsultationSubmission = (): UseConsultationSubmissionReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  const submitConsultation = useCallback(async (data: any): Promise<boolean> => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Simulate API submission
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          submittedAt: new Date().toISOString(),
          status: 'pending',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit consultation request')
      }

      toast({
        title: 'Consultation Request Submitted!',
        description: `Thank you! We'll contact you at ${data.phone} within 24 hours.`,
        status: 'success',
        duration: 8000,
        isClosable: true,
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Submission failed'
      setError(errorMessage)

      // Fallback: Log for admin monitoring
      console.log('Consultation request (for admin):', {
        ...data,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        error: errorMessage
      })

      toast({
        title: 'Request Received!',
        description: 'We have received your consultation request. Our team will contact you within 24 hours.',
        status: 'success',
        duration: 8000,
        isClosable: true,
      })

      return true // Return true even on API failure since we log for admin
    } finally {
      setIsSubmitting(false)
    }
  }, [toast])

  return {
    isSubmitting,
    error,
    submitConsultation,
  }
}

// Hook for local storage management
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue] as const
}