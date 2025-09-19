// Nigerian States and Local Government Areas
export const NIGERIAN_STATES = [
  { value: 'abia', label: 'Abia' },
  { value: 'adamawa', label: 'Adamawa' },
  { value: 'akwa-ibom', label: 'Akwa Ibom' },
  { value: 'anambra', label: 'Anambra' },
  { value: 'bauchi', label: 'Bauchi' },
  { value: 'bayelsa', label: 'Bayelsa' },
  { value: 'benue', label: 'Benue' },
  { value: 'borno', label: 'Borno' },
  { value: 'cross-river', label: 'Cross River' },
  { value: 'delta', label: 'Delta' },
  { value: 'ebonyi', label: 'Ebonyi' },
  { value: 'edo', label: 'Edo' },
  { value: 'ekiti', label: 'Ekiti' },
  { value: 'enugu', label: 'Enugu' },
  { value: 'gombe', label: 'Gombe' },
  { value: 'imo', label: 'Imo' },
  { value: 'jigawa', label: 'Jigawa' },
  { value: 'kaduna', label: 'Kaduna' },
  { value: 'kano', label: 'Kano' },
  { value: 'katsina', label: 'Katsina' },
  { value: 'kebbi', label: 'Kebbi' },
  { value: 'kogi', label: 'Kogi' },
  { value: 'kwara', label: 'Kwara' },
  { value: 'lagos', label: 'Lagos' },
  { value: 'nasarawa', label: 'Nasarawa' },
  { value: 'niger', label: 'Niger' },
  { value: 'ogun', label: 'Ogun' },
  { value: 'ondo', label: 'Ondo' },
  { value: 'osun', label: 'Osun' },
  { value: 'oyo', label: 'Oyo' },
  { value: 'plateau', label: 'Plateau' },
  { value: 'rivers', label: 'Rivers' },
  { value: 'sokoto', label: 'Sokoto' },
  { value: 'taraba', label: 'Taraba' },
  { value: 'yobe', label: 'Yobe' },
  { value: 'zamfara', label: 'Zamfara' },
  { value: 'fct', label: 'Federal Capital Territory' },
]

// Nigerian phone number validation (covers all major networks: MTN, Airtel, Glo, 9mobile, NTEL, Smile)
// Valid formats: +234 8012345678, +234 801 234 5678, +2348012345678, 08012345678, 8012345678
// Updated to handle spaces, formatting, and all Nigerian network prefixes
export const PHONE_REGEX = /^\+?234\s?(7[0-9]{2}|[89][0-9]{2})\s?\d{3}\s?\d{4}$|^0?[789][0-9]{2}\s?\d{3}\s?\d{4}$/

// International phone number validation (more flexible for global numbers)
export const INTERNATIONAL_PHONE_REGEX = /^[\+]?[1-9][\d]{1,14}$/

// Emergency Contact Types
export const EMERGENCY_CONTACT_TYPES = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'child', label: 'Child' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'friend', label: 'Friend' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'neighbor', label: 'Neighbor' },
  { value: 'other', label: 'Other' },
]

// ===== UPDATED: ASSESSMENT SERVICES =====

// Fixed assessment price for all services
export const ASSESSMENT_PRICE = 5000; // ₦5,000 for all assessments

// Assessment service categories
export const ASSESSMENT_CATEGORIES = [
  { value: 'general', label: 'General Assessment', icon: 'FaHeartbeat' },
  { value: 'specialized', label: 'Specialized Assessment', icon: 'FaStethoscope' },
  { value: 'emergency', label: 'Emergency Assessment', icon: 'FaAmbulance' },
  { value: 'routine', label: 'Routine Check-up', icon: 'FaCalendarCheck' },
]

// Available assessment services
export const HEALTHCARE_SERVICES: BookingService[] = [
  {
    id: 'general-health-assessment',
    name: 'General Health Assessment',
    description: 'Comprehensive health evaluation including vital signs monitoring, medical history review, and basic physical examination by qualified healthcare professionals.',
    price: ASSESSMENT_PRICE,
    duration: 60, // 1 hour
    category: 'general',
    icon: 'FaHeartbeat',
    popular: true,
    requirements: [
      'Patient should be available during scheduled time',
      'List of current medications (if any)',
      'Previous medical records (if available)',
      'Comfortable clothing for examination'
    ],
    features: [
      'Vital signs monitoring (Blood pressure, pulse, temperature)',
      'Medical history consultation',
      'Basic physical examination',
      'Health recommendations',
      'Written medical assessment report'
    ]
  },
  {
    id: 'elderly-care-assessment',
    name: 'Elderly Care Assessment',
    description: 'Specialized health assessment for seniors focusing on age-related health concerns, mobility evaluation, and comprehensive care needs assessment.',
    price: ASSESSMENT_PRICE,
    duration: 90, // 1.5 hours
    category: 'specialized',
    icon: 'FaUserAlt',
    popular: true,
    requirements: [
      'Patient should be comfortable and well-rested',
      'Complete list of medications and supplements',
      'Previous medical records and test results',
      'Family member present if needed for support'
    ],
    features: [
      'Comprehensive geriatric assessment',
      'Mobility and balance evaluation',
      'Cognitive function screening',
      'Medication review and interactions check',
      'Personalized care plan recommendations'
    ]
  },
  {
    id: 'chronic-condition-assessment',
    name: 'Chronic Condition Assessment',
    description: 'Specialized assessment for patients managing chronic conditions like diabetes, hypertension, arthritis, and other long-term health conditions.',
    price: ASSESSMENT_PRICE,
    duration: 75, // 1.25 hours
    category: 'specialized',
    icon: 'FaChartLine',
    requirements: [
      'Recent medical test results (blood work, imaging)',
      'Current medication list with dosages',
      'Symptom diary or health monitoring records',
      'Insurance information or medical card'
    ],
    features: [
      'Condition-specific health evaluation',
      'Symptom monitoring and progress tracking',
      'Medication effectiveness review',
      'Lifestyle and dietary recommendations',
      'Follow-up care planning and referrals'
    ]
  },
  {
    id: 'post-surgery-assessment',
    name: 'Post-Surgery Assessment',
    description: 'Professional evaluation for patients recovering from surgery, including wound assessment, healing progress monitoring, and recovery guidance.',
    price: ASSESSMENT_PRICE,
    duration: 60, // 1 hour
    category: 'specialized',
    icon: 'FaBandAid',
    requirements: [
      'Surgery discharge notes and instructions',
      'Current pain medication list',
      'Post-operative care instructions',
      'Clean, easily accessible surgical site'
    ],
    features: [
      'Surgical site examination and wound care',
      'Healing progress assessment',
      'Pain level evaluation and management',
      'Recovery milestone monitoring',
      'Post-operative care guidance and education'
    ]
  },
  {
    id: 'mental-health-screening',
    name: 'Mental Health Screening',
    description: 'Confidential mental health assessment including stress evaluation, mood assessment, and psychological wellbeing screening with professional recommendations.',
    price: ASSESSMENT_PRICE,
    duration: 60, // 1 hour
    category: 'specialized',
    icon: 'FaBrain',
    requirements: [
      'Quiet, private environment for consultation',
      'Patient should be well-rested and comfortable',
      'List of current medications (especially mood-related)',
      'Previous mental health records (if any)'
    ],
    features: [
      'Mental health status evaluation',
      'Stress and anxiety level screening',
      'Mood and emotional wellbeing assessment',
      'Cognitive function evaluation',
      'Professional referral recommendations if needed'
    ]
  },
  {
    id: 'maternal-health-assessment',
    name: 'Maternal Health Assessment',
    description: 'Comprehensive health assessment for expectant mothers and new mothers, including prenatal check-ups and postnatal care evaluation.',
    price: ASSESSMENT_PRICE,
    duration: 75, // 1.25 hours
    category: 'specialized',
    icon: 'FaBaby',
    requirements: [
      'Pregnancy records and antenatal care card',
      'List of prenatal vitamins and medications',
      'Previous ultrasound results (if available)',
      'Comfortable, loose-fitting clothing'
    ],
    features: [
      'Prenatal or postnatal health check',
      'Blood pressure and weight monitoring',
      'Fetal health assessment (if applicable)',
      'Nutritional guidance and counseling',
      'Birth preparation or recovery advice'
    ]
  },
  {
    id: 'pediatric-assessment',
    name: 'Pediatric Health Assessment',
    description: 'Child-friendly health assessment for infants, children, and adolescents, including growth monitoring and developmental screening.',
    price: ASSESSMENT_PRICE,
    duration: 60, // 1 hour
    category: 'specialized',
    icon: 'FaChild',
    requirements: [
      'Child\'s complete vaccination records',
      'Growth chart and previous health records',
      'List of any medications or supplements',
      'Parent or legal guardian must be present',
      'Comfortable, child-friendly environment'
    ],
    features: [
      'Age-appropriate growth and development assessment',
      'Vital signs monitoring and health screening',
      'Nutritional evaluation and guidance',
      'Vaccination status review and recommendations',
      'Parental guidance and health education'
    ]
  },
  {
    id: 'routine-checkup',
    name: 'Routine Health Check-up',
    description: 'Regular preventive health assessment to monitor overall health status, identify potential health risks, and maintain optimal wellness.',
    price: ASSESSMENT_PRICE,
    duration: 45, // 45 minutes
    category: 'routine',
    icon: 'FaCalendarCheck',
    popular: true,
    requirements: [
      'Previous health screening results (if any)',
      'Current medication list',
      'Family medical history information',
      'Health insurance information'
    ],
    features: [
      'Comprehensive health screening',
      'Risk factor identification',
      'Preventive care recommendations',
      'Health maintenance planning',
      'Wellness lifestyle guidance'
    ]
  },
  {
    id: 'emergency-assessment',
    name: 'Emergency Health Assessment',
    description: 'Urgent health assessment for non-life-threatening emergencies, acute symptoms, or when immediate medical evaluation is needed.',
    price: ASSESSMENT_PRICE,
    duration: 45, // 45 minutes
    category: 'emergency',
    icon: 'FaAmbulance',
    availability: '24/7',
    requirements: [
      'Clear description of emergency symptoms',
      'List of any medications recently taken',
      'Information about known medical conditions',
      'Emergency contact details readily available'
    ],
    features: [
      'Rapid health status evaluation and triage',
      'Acute symptom assessment and management',
      'Immediate care recommendations',
      'Emergency referral coordination if needed',
      'Family education on warning signs and next steps'
    ]
  }
];

// Helper function to format price consistently
export const formatAssessmentPrice = (): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(ASSESSMENT_PRICE);
};

// Updated booking service interface
export interface BookingService {
  id: string
  name: string
  description: string
  price: number // Always ASSESSMENT_PRICE (5000)
  duration: number // in minutes
  category: 'general' | 'specialized' | 'emergency' | 'routine'
  icon: string
  popular?: boolean
  requirements?: string[]
  features?: string[]
  availability?: string // For emergency services
}

export interface TimeSlot {
  time: string
  available: boolean
  price?: number // Will always be ASSESSMENT_PRICE
}

export interface BookingFormData {
  // Service Details
  serviceId: string
  date: string
  timeSlot: string
  duration: number
  
  // Patient Information
  patientName: string
  patientAge: number
  patientGender: 'male' | 'female' | 'other'
  patientPhone: string
  patientEmail?: string
  
  // Medical Information
  medicalCondition?: string
  medications?: string
  allergies?: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  
  // Location Information
  address: {
    street: string
    area: string
    city: string
    state: string
    landmark?: string
  }
  
  // Special Requirements
  specialRequirements?: string
  nurseGenderPreference?: 'male' | 'female' | 'no-preference'
  
  // Payment
  paymentMethod: 'card' | 'bank-transfer' | 'ussd' | 'cash'
  totalAmount: number // Will always be ASSESSMENT_PRICE (5000)
}

export interface BookingStep {
  id: number
  title: string
  description: string
  completed: boolean
  active: boolean
}

// Assessment-specific constants
export const ASSESSMENT_DURATIONS = {
  SHORT: 45,   // 45 minutes - Emergency, Routine
  STANDARD: 60, // 1 hour - General, Post-surgery, Mental health, Pediatric
  EXTENDED: 75, // 1.25 hours - Chronic conditions, Maternal
  COMPREHENSIVE: 90 // 1.5 hours - Elderly care
};

// Service availability
export const SERVICE_AVAILABILITY = {
  REGULAR: 'Mon-Sat, 8AM-6PM',
  EMERGENCY: '24/7 Available',
  WEEKEND: 'Weekend appointments available',
  FLEXIBLE: 'Flexible scheduling available'
};