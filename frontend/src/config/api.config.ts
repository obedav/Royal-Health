// API Configuration with environment-based endpoints
export const API_CONFIG = {
  // Base URL for API endpoints
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',

  // API Endpoints
  ENDPOINTS: {
    CONSULTATIONS: '/api/consultations',
    BOOKINGS: '/api/bookings',
    SERVICES: '/api/services',
    CONTACT: '/api/contact',
    HEALTH_CHECK: '/api/health'
  },

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Retry configuration
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 1000 // ms
  }
} as const

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper function for API requests with retry logic
export const apiRequest = async (
  url: string,
  options: RequestInit = {},
  retryAttempts: number = API_CONFIG.RETRY.ATTEMPTS
): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

  const requestOptions: RequestInit = {
    ...options,
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, requestOptions)
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response
  } catch (error) {
    clearTimeout(timeoutId)

    // Retry logic for network errors
    if (retryAttempts > 1 && (
      error instanceof TypeError || // Network error
      (error instanceof Error && error.name === 'AbortError') // Timeout
    )) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY.DELAY))
      return apiRequest(url, options, retryAttempts - 1)
    }

    throw error
  }
}

// Environment configuration check
export const checkEnvironmentConfig = (): { isValid: boolean; issues: string[] } => {
  const issues: string[] = []

  if (!import.meta.env.VITE_API_BASE_URL) {
    issues.push('VITE_API_BASE_URL environment variable is not set. Using fallback: localhost:3001')
  }

  return {
    isValid: issues.length === 0,
    issues
  }
}