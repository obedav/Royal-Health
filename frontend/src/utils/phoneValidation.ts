// src/utils/phoneValidation.ts
import { PHONE_REGEX, INTERNATIONAL_PHONE_REGEX } from './constants';
import { parsePhoneNumber, isValidPhoneNumber, formatInCallingCode } from 'libphonenumber-js';

/**
 * Nigerian Phone Number Validation and Formatting Utilities
 */

// Nigerian network prefixes
export const NIGERIAN_NETWORKS = {
  MTN: ['803', '806', '813', '814', '816', '810', '903', '906', '703', '706', '704'],
  AIRTEL: ['802', '808', '812', '701', '708', '901', '902', '904', '907'],
  GLO: ['805', '807', '815', '811', '705', '905'],
  '9MOBILE': ['809', '817', '818', '819', '908', '909'],
  NTEL: ['804'],
  SMILE: ['702']
};

/**
 * Validate Nigerian phone number using network prefixes
 */
export const validateNigerianPhone = (phone: string): boolean => {
  if (!phone) return false;

  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  // Extract the network prefix to check against known prefixes
  const allPrefixes = Object.values(NIGERIAN_NETWORKS).flat();

  let numberToCheck = '';

  if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
    // Format: 08012345678 → extract 801
    numberToCheck = cleanPhone.slice(1, 4);
  } else if (cleanPhone.length === 10) {
    // Format: 8012345678 → extract 801
    numberToCheck = cleanPhone.slice(0, 3);
  } else if (cleanPhone.length === 13 && cleanPhone.startsWith('234')) {
    // Format: 2348012345678 → extract 801
    numberToCheck = cleanPhone.slice(3, 6);
  } else if (cleanPhone.length === 14 && cleanPhone.startsWith('+234')) {
    // Handle +234 format in case it gets through
    return false; // This should be cleaned first
  } else {
    return false; // Invalid length
  }

  // Check if the prefix is in our known Nigerian networks
  return allPrefixes.includes(numberToCheck);
};

/**
 * Validate international phone number using libphonenumber-js
 */
export const validateInternationalPhone = (phone: string): boolean => {
  if (!phone) return false;

  try {
    // Use libphonenumber-js for comprehensive international validation
    return isValidPhoneNumber(phone);
  } catch (error) {
    // Fallback to basic validation if parsing fails
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 7 && cleanPhone.length <= 15;
  }
};

/**
 * Smart phone validation - tries Nigerian first, then international
 */
export const validatePhone = (phone: string, allowInternational = true): {
  isValid: boolean;
  type: 'nigerian' | 'international' | 'invalid';
  formatted?: string;
} => {
  if (!phone?.trim()) {
    return { isValid: false, type: 'invalid' };
  }

  // First try Nigerian validation
  if (validateNigerianPhone(phone)) {
    return {
      isValid: true,
      type: 'nigerian',
      formatted: formatNigerianPhone(phone)
    };
  }

  // Then try international if allowed
  if (allowInternational && validateInternationalPhone(phone)) {
    return {
      isValid: true,
      type: 'international',
      formatted: formatInternationalPhone(phone)
    };
  }

  return { isValid: false, type: 'invalid' };
};

/**
 * Format Nigerian phone number to +234 format
 */
export const formatNigerianPhone = (phone: string): string => {
  if (!phone) return '';

  const cleanPhone = phone.replace(/\D/g, '');

  // Handle different input formats
  if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
    // 08012345678 → +234 801 234 5678
    const withoutZero = cleanPhone.slice(1);
    return `+234 ${withoutZero.slice(0, 3)} ${withoutZero.slice(3, 6)} ${withoutZero.slice(6)}`;
  } else if (cleanPhone.length === 10) {
    // 8012345678 → +234 801 234 5678
    return `+234 ${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
  } else if (cleanPhone.length === 13 && cleanPhone.startsWith('234')) {
    // 2348012345678 → +234 801 234 5678
    const number = cleanPhone.slice(3);
    return `+234 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
  }

  return phone; // Return original if can't format
};

/**
 * Format international phone number using libphonenumber-js
 */
export const formatInternationalPhone = (phone: string): string => {
  if (!phone) return '';

  try {
    const phoneNumber = parsePhoneNumber(phone);
    if (phoneNumber && phoneNumber.isValid()) {
      return phoneNumber.formatInternational();
    }
  } catch (error) {
    // Fallback to basic formatting
  }

  // Fallback formatting
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length >= 7 && !phone.startsWith('+')) {
    return `+${cleanPhone}`;
  }

  return phone;
};

/**
 * Get network provider for Nigerian numbers
 */
export const getNigerianNetwork = (phone: string): string | null => {
  if (!validateNigerianPhone(phone)) return null;

  const cleanPhone = phone.replace(/\D/g, '');
  let prefix = '';

  if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
    prefix = cleanPhone.slice(1, 4); // Get digits 1-3 (after 0)
  } else if (cleanPhone.length === 10) {
    prefix = cleanPhone.slice(0, 3); // Get first 3 digits
  } else if (cleanPhone.length === 13 && cleanPhone.startsWith('234')) {
    prefix = cleanPhone.slice(3, 6); // Get digits 3-5 (after 234)
  }

  for (const [network, prefixes] of Object.entries(NIGERIAN_NETWORKS)) {
    if (prefixes.includes(prefix)) {
      return network;
    }
  }

  return null;
};

/**
 * Phone validation for forms with detailed error messages
 */
export const validatePhoneForForm = (
  phone: string,
  options: {
    required?: boolean;
    allowInternational?: boolean;
    preferNigerian?: boolean;
  } = {}
): {
  isValid: boolean;
  error?: string;
  formatted?: string;
} => {
  const { required = false, allowInternational = true, preferNigerian = true } = options;

  // Check if required
  if (required && !phone?.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }

  if (!phone?.trim()) {
    return { isValid: true }; // Optional field, empty is OK
  }

  const validation = validatePhone(phone, allowInternational);

  if (!validation.isValid) {
    if (preferNigerian) {
      return {
        isValid: false,
        error: 'Please enter a valid Nigerian phone number (e.g., 08012345678)'
      };
    } else {
      return {
        isValid: false,
        error: 'Please enter a valid phone number'
      };
    }
  }

  return {
    isValid: true,
    formatted: validation.formatted
  };
};

/**
 * Clean phone number for storage/API calls
 */
export const cleanPhoneForStorage = (phone: string): string => {
  if (!phone) return '';

  const validation = validatePhone(phone);
  if (!validation.isValid) return phone;

  if (validation.type === 'nigerian') {
    // Always store Nigerian numbers as +234XXXXXXXXXX
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.startsWith('0')) {
      return `+234${cleanPhone.slice(1)}`;
    } else if (cleanPhone.startsWith('234')) {
      return `+${cleanPhone}`;
    } else if (cleanPhone.length === 10) {
      return `+234${cleanPhone}`;
    }
  }

  // For international numbers, use libphonenumber-js formatting
  try {
    const phoneNumber = parsePhoneNumber(phone);
    if (phoneNumber && phoneNumber.isValid()) {
      return phoneNumber.format('E.164'); // Standard international format: +1234567890
    }
  } catch (error) {
    // Fallback to validation formatted result
  }

  return validation.formatted || phone;
};

/**
 * Get example phone number for placeholder
 */
export const getPhoneExample = (countryCode?: string): string => {
  switch (countryCode) {
    case 'NG':
    case '+234':
      return '801 234 5678';
    case 'US':
    case '+1':
      return '555 123 4567';
    case 'GB':
    case '+44':
      return '20 7123 4567';
    default:
      return '801 234 5678'; // Default to Nigerian
  }
};