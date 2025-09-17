// App-wide configuration and constants

// Safe environment variable access
const getEnvVar = (key: string, defaultValue: string = '') => {
  try {
    return typeof window !== 'undefined' && import.meta?.env?.[key] || defaultValue
  } catch {
    return defaultValue
  }
}

const isDevelopment = getEnvVar('MODE') === 'development' || getEnvVar('NODE_ENV') === 'development'
const isProduction = getEnvVar('MODE') === 'production' || getEnvVar('NODE_ENV') === 'production'

// API Configuration
export const API_CONFIG = {
  BASE_URL: getEnvVar('VITE_API_URL') || 'http://localhost:3001/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const

// App Meta Information
export const APP_META = {
  name: 'Royal Health Services',
  description: 'Professional healthcare services delivered to your home',
  version: '2.0.0',
  author: 'Royal Health Team',
  keywords: 'healthcare, home care, nursing, consultation, Nigeria',
  url: getEnvVar('VITE_APP_URL') || 'https://royalhealth.ng',
} as const

// Feature Flags
export const FEATURES = {
  ENABLE_BOOKING_FLOW: true,
  ENABLE_CONSULTATIONS: true,
  ENABLE_PAYMENTS: false, // Disabled for consultation-focused approach
  ENABLE_USER_ACCOUNTS: false, // Guest-first approach
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: isProduction,
  ENABLE_ERROR_REPORTING: isProduction,
} as const

// UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 5000,
  LOADING_DELAY: 300,
  DEBOUNCE_DELAY: 300,
  MAX_MOBILE_WIDTH: 768,
  BREAKPOINTS: {
    sm: '30em', // 480px
    md: '48em', // 768px
    lg: '62em', // 992px
    xl: '80em', // 1280px
    '2xl': '96em', // 1536px
  },
} as const

// Business Configuration
export const BUSINESS_CONFIG = {
  PHONE: '+234 706 332 5184',
  EMAIL: 'info@royalhealth.ng',
  ADDRESS: 'Lagos, Nigeria',
  WORKING_HOURS: {
    REGULAR: 'Mon-Sat, 8AM-6PM',
    EMERGENCY: '24/7 Available',
  },
  SOCIAL_MEDIA: {
    WHATSAPP: 'https://wa.me/2347063325184',
    FACEBOOK: '#',
    TWITTER: '#',
    INSTAGRAM: '#',
  },
} as const

// Form Validation Rules
export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s]+$/,
  },
  PHONE: {
    PATTERN: /^(\+234|234|0)?[789][01]\d{8}$/,
    MESSAGE: 'Please enter a valid Nigerian phone number',
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address',
  },
  AGE: {
    MIN: 1,
    MAX: 120,
  },
  ADDRESS: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 200,
  },
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SUBMISSION_ERROR: 'Failed to submit. Please try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  CONSULTATION_SUBMITTED: 'Consultation request submitted successfully!',
  BOOKING_CREATED: 'Booking created successfully!',
  FORM_SAVED: 'Form saved successfully!',
  EMAIL_SENT: 'Email sent successfully!',
} as const

// Route Paths
export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',
  BOOKING: '/booking',
  CONSULTATION: '/consultation',
  ABOUT: '/about',
  CONTACT: '/contact',
  ADMIN: {
    BASE: '/admin',
    CONSULTATIONS: '/admin/consultations',
    BOOKINGS: '/admin/bookings',
    DASHBOARD: '/admin/dashboard',
  },
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  SELECTED_SERVICE: 'royal_health_selected_service',
  USER_PREFERENCES: 'royal_health_user_preferences',
  BOOKING_DRAFT: 'royal_health_booking_draft',
  CONSULTATION_DRAFT: 'royal_health_consultation_draft',
} as const

// Analytics Events (if analytics is enabled)
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  SERVICE_SELECTED: 'service_selected',
  CONSULTATION_STARTED: 'consultation_started',
  CONSULTATION_SUBMITTED: 'consultation_submitted',
  BOOKING_STARTED: 'booking_started',
  BOOKING_COMPLETED: 'booking_completed',
  PHONE_CLICKED: 'phone_clicked',
  WHATSAPP_CLICKED: 'whatsapp_clicked',
} as const

// Environment-specific settings
export const ENV_CONFIG = {
  IS_DEVELOPMENT: isDevelopment,
  IS_PRODUCTION: isProduction,
  IS_TEST: getEnvVar('NODE_ENV') === 'test',
  ENABLE_LOGGING: isDevelopment,
  ENABLE_DEV_TOOLS: isDevelopment,
} as const

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  LAZY_LOAD_THRESHOLD: 0.1, // Intersection observer threshold
  IMAGE_LAZY_LOAD: true,
  COMPONENT_LAZY_LOAD: true,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  PREFETCH_ON_HOVER: true,
} as const

// Security Configuration
export const SECURITY_CONFIG = {
  ENABLE_CSP: true,
  ALLOWED_ORIGINS: [
    'https://royalhealth.ng',
    'https://www.royalhealth.ng',
  ],
  SANITIZE_HTML: true,
  XSS_PROTECTION: true,
} as const

// Default export for easy importing
export default {
  API_CONFIG,
  APP_META,
  FEATURES,
  UI_CONFIG,
  BUSINESS_CONFIG,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  STORAGE_KEYS,
  ANALYTICS_EVENTS,
  ENV_CONFIG,
  PERFORMANCE_CONFIG,
  SECURITY_CONFIG,
} as const