// src/utils/patientFormValidation.ts

import { PatientInformation, PatientFormErrors } from '../types/patient.types'
import { validatePhone, formatNigerianPhone } from './phoneValidation'

export const validatePhoneNumber = (phone: string): boolean => {
  const validation = validatePhone(phone, true) // Allow international numbers
  return validation.isValid
}

// Keep the old function for backward compatibility
export const validateNigerianPhoneNumber = (phone: string): boolean => {
  const validation = validatePhone(phone, false) // Nigerian only
  return validation.isValid && validation.type === 'nigerian'
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateAge = (dateOfBirth: string): { isValid: boolean; age?: number } => {
  if (!dateOfBirth) return { isValid: false }
  
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  let actualAge = age
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    actualAge = age - 1
  }
  
  const isValid = actualAge >= 0 && actualAge <= 120 && birthDate <= today
  return { isValid, age: isValid ? actualAge : undefined }
}

export const validatePatientForm = (formData: PatientInformation): PatientFormErrors => {
  const errors: PatientFormErrors = {}

  // Required personal information
  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required'
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required'
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required'
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required'
  } else if (!validatePhoneNumber(formData.phone)) {
    errors.phone = 'Please enter a valid phone number'
  }

  if (!formData.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required'
  } else {
    const ageValidation = validateAge(formData.dateOfBirth)
    if (!ageValidation.isValid) {
      errors.dateOfBirth = 'Please enter a valid date of birth'
    }
  }

  // Emergency contact validation
  if (!formData.emergencyContact.name.trim()) {
    errors.emergencyContactName = 'Emergency contact name is required'
  }

  if (!formData.emergencyContact.phone.trim()) {
    errors.emergencyContactPhone = 'Emergency contact phone is required'
  } else if (!validatePhoneNumber(formData.emergencyContact.phone)) {
    errors.emergencyContactPhone = 'Please enter a valid phone number'
  }

  if (!formData.emergencyContact.relationship) {
    errors.emergencyContactRelationship = 'Relationship is required'
  }

  // Consent validation
  if (!formData.consentToTreatment) {
    errors.consentToTreatment = 'Consent to treatment is required'
  }

  if (!formData.consentToDataProcessing) {
    errors.consentToDataProcessing = 'Consent to data processing is required'
  }

  return errors
}

export const calculateAge = (dateOfBirth: string): number | null => {
  const validation = validateAge(dateOfBirth)
  return validation.age || null
}

export const formatPhoneNumber = (phone: string): string => {
  return formatNigerianPhone(phone)
}

export const sanitizeFormData = (formData: PatientInformation): PatientInformation => {
  return {
    ...formData,
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim().toLowerCase(),
    phone: formatPhoneNumber(formData.phone),
    emergencyContact: {
      ...formData.emergencyContact,
      name: formData.emergencyContact.name.trim(),
      phone: formatPhoneNumber(formData.emergencyContact.phone)
    },
    medicalHistory: {
      ...formData.medicalHistory,
      conditions: formData.medicalHistory.conditions.filter(c => c.trim()),
      currentMedications: formData.medicalHistory.currentMedications.filter(m => m.trim()),
      allergies: formData.medicalHistory.allergies.filter(a => a.trim()),
      previousSurgeries: formData.medicalHistory.previousSurgeries.filter(s => s.trim()),
      hospitalizations: formData.medicalHistory.hospitalizations.filter(h => h.trim())
    }
  }
}

// Get form completion percentage for progress tracking
export const getFormCompletionPercentage = (formData: PatientInformation): number => {
  const totalFields = 15 // Total important fields
  let completedFields = 0

  // Personal info (6 fields)
  if (formData.firstName.trim()) completedFields++
  if (formData.lastName.trim()) completedFields++
  if (formData.email.trim()) completedFields++
  if (formData.phone.trim()) completedFields++
  if (formData.dateOfBirth) completedFields++
  if (formData.gender !== 'prefer_not_to_say') completedFields++

  // Emergency contact (3 fields)
  if (formData.emergencyContact.name.trim()) completedFields++
  if (formData.emergencyContact.phone.trim()) completedFields++
  if (formData.emergencyContact.relationship) completedFields++

  // Medical history (3 fields)
  if (formData.medicalHistory.conditions.length > 0) completedFields++
  if (formData.medicalHistory.allergies.length > 0) completedFields++
  if (formData.medicalHistory.currentMedications.length > 0) completedFields++

  // Consents (2 fields)
  if (formData.consentToTreatment) completedFields++
  if (formData.consentToDataProcessing) completedFields++

  // Insurance (1 field)
  if (formData.insuranceProvider) completedFields++

  return Math.round((completedFields / totalFields) * 100)
}

export const isFormValid = (formData: PatientInformation): boolean => {
  const errors = validatePatientForm(formData)
  return Object.keys(errors).length === 0
}