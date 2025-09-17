// src/constants/assessments.ts
import { 
  FaHeartbeat, 
  FaStethoscope,
  FaAmbulance,
  FaClipboardCheck,
  FaBaby
} from 'react-icons/fa'
import { MdHealthAndSafety, MdElderlyWoman, MdPsychology } from 'react-icons/md'

// Fixed assessment price - All health assessments have the same price
export const ASSESSMENT_PRICE = 30000

// Assessment-focused healthcare services - All cost ₦30,000 (fixed price)
export const healthcareAssessments = [
  {
    id: 'general-health-assessment',
    name: 'General Health Assessment',
    description: 'Comprehensive health evaluation including vital signs, basic medical history review, and overall wellness check by qualified healthcare professionals.',
    shortDescription: 'Comprehensive health evaluation and wellness check',
    price: ASSESSMENT_PRICE, // Fixed assessment price
    duration: 60, // 1 hour assessment
    category: 'general',
    icon: 'FaStethoscope',
    iconComponent: FaStethoscope,
    popular: true,
    features: [
      'Complete vital signs check (BP, pulse, temperature)',
      'Medical history review and documentation',
      'Basic physical examination',
      'Health risk assessment',
      'Wellness recommendations',
      'Written assessment report'
    ],
    requirements: ['Valid ID', 'List of current medications if any'],
    availability: '7 days a week, 8 AM - 8 PM',
    preparation: [
      'Prepare a list of current medications and supplements',
      'Note any symptoms or health concerns',
      'Have your ID ready for verification',
      'Ensure a quiet, well-lit space for the assessment'
    ]
  },
  {
    id: 'elderly-care-assessment',
    name: 'Elderly Care Assessment',
    description: 'Specialized comprehensive health assessment for seniors (65+) focusing on age-related health concerns, mobility, cognitive function, and care needs evaluation.',
    shortDescription: 'Specialized health assessment for seniors (65+)',
    price: ASSESSMENT_PRICE,
    duration: 90, // 1.5 hours for thorough senior assessment
    category: 'specialized',
    icon: 'MdElderlyWoman',
    iconComponent: MdElderlyWoman,
    popular: true,
    features: [
      'Age-appropriate comprehensive health screening',
      'Mobility and balance assessment',
      'Cognitive function evaluation',
      'Medication review and safety check',
      'Fall risk assessment',
      'Care needs evaluation and recommendations'
    ],
    requirements: ['Medical history', 'Current medications list', 'Emergency contact'],
    availability: '7 days a week, 9 AM - 6 PM',
    preparation: [
      'Gather all current medications and medical records',
      'Prepare list of any falls or balance issues',
      'Have emergency contact information ready',
      'Note any changes in memory or thinking'
    ]
  },
  {
    id: 'chronic-condition-assessment',
    name: 'Chronic Condition Assessment',
    description: 'Focused health assessment for patients with chronic conditions like diabetes, hypertension, arthritis, or heart conditions to monitor status and adjust care plans.',
    shortDescription: 'Health assessment for chronic condition management',
    price: ASSESSMENT_PRICE,
    duration: 75, // 1.25 hours for detailed chronic condition review
    category: 'specialized',
    icon: 'FaHeartbeat',
    iconComponent: FaHeartbeat,
    features: [
      'Condition-specific health monitoring',
      'Blood pressure and vital signs assessment',
      'Medication effectiveness evaluation',
      'Symptom tracking and documentation',
      'Lifestyle impact assessment',
      'Care plan optimization recommendations'
    ],
    requirements: ['Medical diagnosis documentation', 'Current medications', 'Recent lab results if available'],
    availability: '6 days a week, 8 AM - 7 PM',
    preparation: [
      'Bring recent lab results or test reports',
      'Document symptoms and how you\'ve been feeling',
      'List all medications with dosages',
      'Note any side effects or concerns'
    ]
  },
  {
    id: 'post-surgery-assessment',
    name: 'Post-Surgery Assessment',
    description: 'Comprehensive recovery assessment after surgical procedures, including wound evaluation, healing progress monitoring, and post-operative care recommendations.',
    shortDescription: 'Recovery assessment and monitoring after surgery',
    price: ASSESSMENT_PRICE,
    duration: 60, // 1 hour for post-surgery evaluation
    category: 'specialized',
    icon: 'MdHealthAndSafety',
    iconComponent: MdHealthAndSafety,
    features: [
      'Surgical site inspection and assessment',
      'Healing progress evaluation',
      'Pain level assessment and management advice',
      'Mobility and function evaluation',
      'Infection risk assessment',
      'Recovery timeline guidance'
    ],
    requirements: ['Surgery discharge notes', 'Post-op instructions', 'Current medications'],
    availability: '7 days a week, 9 AM - 8 PM',
    preparation: [
      'Have surgery discharge notes and instructions ready',
      'Prepare the surgical site for examination (clean, accessible)',
      'List any concerns about healing or recovery',
      'Have pain medication information available'
    ]
  },
  {
    id: 'mental-health-screening',
    name: 'Mental Health Screening',
    description: 'Compassionate mental health and psychological wellbeing assessment including mood evaluation, stress assessment, and mental health resource recommendations.',
    shortDescription: 'Mental health and psychological wellbeing assessment',
    price: ASSESSMENT_PRICE,
    duration: 75, // 1.25 hours for thorough mental health screening
    category: 'specialized',
    icon: 'MdPsychology',
    iconComponent: MdPsychology,
    features: [
      'Mood and emotional state assessment',
      'Stress and anxiety level evaluation',
      'Sleep pattern and quality review',
      'Social support system assessment',
      'Coping strategies evaluation',
      'Mental health resource recommendations'
    ],
    requirements: ['Comfortable, private space for discussion'],
    availability: '6 days a week, 10 AM - 6 PM',
    preparation: [
      'Think about your mood and feelings recently',
      'Consider your sleep patterns and stress levels',
      'Prepare to discuss any concerns openly',
      'Ensure privacy during the assessment'
    ]
  },
  {
    id: 'maternal-health-assessment',
    name: 'Maternal Health Assessment',
    description: 'Specialized health assessment for pregnant women and new mothers, focusing on maternal wellbeing, prenatal/postnatal health monitoring, and care guidance.',
    shortDescription: 'Health assessment for pregnant women and new mothers',
    price: ASSESSMENT_PRICE,
    duration: 75, // 1.25 hours for comprehensive maternal assessment
    category: 'specialized',
    icon: 'FaBaby',
    iconComponent: FaBaby,
    features: [
      'Prenatal or postnatal health evaluation',
      'Vital signs and weight monitoring',
      'Nutritional assessment and guidance',
      'Emotional wellbeing check',
      'Breastfeeding support (if applicable)',
      'Maternal care recommendations'
    ],
    requirements: ['Prenatal records if available', 'List of prenatal vitamins/medications'],
    availability: '7 days a week, 8 AM - 7 PM',
    preparation: [
      'Bring prenatal records or discharge papers',
      'List any pregnancy symptoms or concerns',
      'Have prenatal vitamin information ready',
      'Prepare questions about pregnancy or baby care'
    ]
  },
  {
    id: 'pediatric-assessment',
    name: 'Pediatric Health Assessment',
    description: 'Child-friendly comprehensive health assessment for children and adolescents, including growth monitoring, developmental assessment, and pediatric health evaluation.',
    shortDescription: 'Child-friendly health assessment for children and teens',
    price: ASSESSMENT_PRICE,
    duration: 60, // 1 hour child-friendly assessment
    category: 'specialized',
    icon: 'FaBaby',
    iconComponent: FaBaby,
    features: [
      'Age-appropriate health screening',
      'Growth and development assessment',
      'Immunization status review',
      'Nutritional evaluation',
      'Behavioral and social development check',
      'Parent guidance and recommendations'
    ],
    requirements: ['Child\'s health records', 'Immunization card', 'Parent/guardian present'],
    availability: '6 days a week, 9 AM - 6 PM',
    preparation: [
      'Bring child\'s health records and immunization card',
      'List any concerns about child\'s health or development',
      'Prepare child for the friendly health professional visit',
      'Have snacks or comfort items for the child'
    ]
  },
  {
    id: 'routine-checkup',
    name: 'Routine Health Check-up',
    description: 'Regular preventive health assessment to maintain optimal wellness, early detection of health issues, and ongoing health maintenance guidance.',
    shortDescription: 'Regular preventive health assessment and wellness maintenance',
    price: ASSESSMENT_PRICE,
    duration: 45, // 45 minutes for routine check
    category: 'routine',
    icon: 'FaClipboardCheck',
    iconComponent: FaClipboardCheck,
    popular: true,
    features: [
      'Annual or bi-annual health screening',
      'Preventive care assessment',
      'Health maintenance evaluation',
      'Risk factor identification',
      'Wellness planning and goal setting',
      'Health education and resources'
    ],
    requirements: ['Previous health records if available'],
    availability: '7 days a week, 8 AM - 8 PM',
    preparation: [
      'Gather any previous health assessment reports',
      'Think about your health goals and concerns',
      'List any family medical history',
      'Prepare questions about maintaining good health'
    ]
  },
  {
    id: 'emergency-assessment',
    name: 'Emergency Health Assessment',
    description: 'Urgent comprehensive health assessment for non-life-threatening health concerns that require immediate professional evaluation and guidance.',
    shortDescription: 'Urgent health assessment for immediate concerns',
    price: ASSESSMENT_PRICE,
    duration: 60, // 1 hour emergency assessment
    category: 'emergency',
    icon: 'FaAmbulance',
    iconComponent: FaAmbulance,
    features: [
      'Rapid health status evaluation',
      'Symptom assessment and documentation',
      'Immediate care recommendations',
      'Hospital referral guidance if needed',
      'Emergency care planning',
      '24/7 availability for urgent needs'
    ],
    requirements: ['Immediate availability needed'],
    availability: '24/7 Emergency Response',
    preparation: [
      'Document symptoms and when they started',
      'List any medications taken for the issue',
      'Have emergency contact information ready',
      'Be prepared to describe the health concern clearly'
    ]
  }
]

// Assessment categories
export const assessmentCategories = {
  general: { name: 'General', color: 'blue' },
  specialized: { name: 'Specialized', color: 'purple' },
  routine: { name: 'Routine', color: 'green' },
  emergency: { name: 'Emergency', color: 'red' }
}