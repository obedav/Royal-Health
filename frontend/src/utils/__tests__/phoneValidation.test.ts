// src/utils/__tests__/phoneValidation.test.ts
import {
  validateNigerianPhone,
  validateInternationalPhone,
  validatePhone,
  formatNigerianPhone,
  formatInternationalPhone,
  getNigerianNetwork,
  validatePhoneForForm,
  cleanPhoneForStorage
} from '../phoneValidation';

describe('Phone Validation Tests', () => {
  describe('Nigerian Phone Validation', () => {
    test('should validate correct Nigerian phone numbers', () => {
      const validNumbers = [
        '08012345678',    // MTN format with 0
        '8012345678',     // MTN format without 0
        '+2348012345678', // MTN international format
        '2348012345678',  // MTN without + prefix
        '08056789012',    // Glo
        '08178901234',    // 9mobile
        '08023456789',    // Airtel
        '07012345678',    // MTN (70x prefix)
        '09012345678',    // MTN (90x prefix)
      ];

      validNumbers.forEach(number => {
        expect(validateNigerianPhone(number)).toBe(true);
      });
    });

    test('should reject invalid Nigerian phone numbers', () => {
      const invalidNumbers = [
        '08112345678',    // Invalid prefix (811)
        '0612345678',     // Invalid prefix (61)
        '123456789',      // Too short
        '080123456789',   // Too long
        '+1234567890',    // Wrong country code
        '',               // Empty string
        '08o12345678',    // Contains letter
        '080-123-4567',   // With dashes (not cleaned)
      ];

      invalidNumbers.forEach(number => {
        expect(validateNigerianPhone(number)).toBe(false);
      });
    });
  });

  describe('International Phone Validation', () => {
    test('should validate international phone numbers', () => {
      const validNumbers = [
        '+14155552671',   // US
        '+442071234567',  // UK
        '+33123456789',   // France
        '+49123456789',   // Germany
        '+861234567890',  // China
        '14155552671',    // US without +
      ];

      validNumbers.forEach(number => {
        expect(validateInternationalPhone(number)).toBe(true);
      });
    });

    test('should reject invalid international phone numbers', () => {
      const invalidNumbers = [
        '123',            // Too short
        '12345678901234567890', // Too long
        '',               // Empty
        '+',              // Just plus
      ];

      invalidNumbers.forEach(number => {
        expect(validateInternationalPhone(number)).toBe(false);
      });
    });
  });

  describe('Smart Phone Validation', () => {
    test('should correctly identify Nigerian numbers', () => {
      const result = validatePhone('08012345678');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('nigerian');
      expect(result.formatted).toBe('+234 801 234 5678');
    });

    test('should correctly identify international numbers', () => {
      const result = validatePhone('+14155552671', true);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('international');
    });

    test('should reject international when not allowed', () => {
      const result = validatePhone('+14155552671', false);
      expect(result.isValid).toBe(false);
      expect(result.type).toBe('invalid');
    });
  });

  describe('Phone Formatting', () => {
    test('should format Nigerian numbers correctly', () => {
      const testCases = [
        ['08012345678', '+234 801 234 5678'],
        ['8012345678', '+234 801 234 5678'],
        ['+2348012345678', '+234 801 234 5678'],
        ['2348012345678', '+234 801 234 5678'],
      ];

      testCases.forEach(([input, expected]) => {
        expect(formatNigerianPhone(input)).toBe(expected);
      });
    });

    test('should format international numbers correctly', () => {
      const testCases = [
        ['14155552671', '+14155552671'],
        ['+14155552671', '+14155552671'],
        ['442071234567', '+442071234567'],
      ];

      testCases.forEach(([input, expected]) => {
        expect(formatInternationalPhone(input)).toBe(expected);
      });
    });
  });

  describe('Network Detection', () => {
    test('should detect Nigerian networks correctly', () => {
      const testCases = [
        ['08012345678', 'MTN'],
        ['08056789012', 'GLO'],
        ['08178901234', '9MOBILE'],
        ['08023456789', 'AIRTEL'],
        ['09012345678', 'MTN'],
      ];

      testCases.forEach(([number, expectedNetwork]) => {
        expect(getNigerianNetwork(number)).toBe(expectedNetwork);
      });
    });

    test('should return null for invalid numbers', () => {
      expect(getNigerianNetwork('1234567890')).toBeNull();
      expect(getNigerianNetwork('+14155552671')).toBeNull();
    });
  });

  describe('Form Validation', () => {
    test('should validate required Nigerian phone numbers', () => {
      const validResult = validatePhoneForForm('08012345678', {
        required: true,
        preferNigerian: true
      });
      expect(validResult.isValid).toBe(true);
      expect(validResult.error).toBeUndefined();
      expect(validResult.formatted).toBe('+234 801 234 5678');
    });

    test('should reject invalid required phone numbers', () => {
      const invalidResult = validatePhoneForForm('123', {
        required: true,
        preferNigerian: true
      });
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error).toContain('valid Nigerian phone number');
    });

    test('should handle empty optional phone numbers', () => {
      const emptyResult = validatePhoneForForm('', { required: false });
      expect(emptyResult.isValid).toBe(true);
      expect(emptyResult.error).toBeUndefined();
    });

    test('should require phone when marked as required', () => {
      const emptyResult = validatePhoneForForm('', { required: true });
      expect(emptyResult.isValid).toBe(false);
      expect(emptyResult.error).toBe('Phone number is required');
    });
  });

  describe('Storage Formatting', () => {
    test('should clean Nigerian numbers for storage', () => {
      const testCases = [
        ['08012345678', '+2348012345678'],
        ['8012345678', '+2348012345678'],
        ['2348012345678', '+2348012345678'],
        ['+2348012345678', '+2348012345678'],
      ];

      testCases.forEach(([input, expected]) => {
        expect(cleanPhoneForStorage(input)).toBe(expected);
      });
    });

    test('should clean international numbers for storage', () => {
      const testCases = [
        ['14155552671', '+14155552671'],
        ['+14155552671', '+14155552671'],
      ];

      testCases.forEach(([input, expected]) => {
        expect(cleanPhoneForStorage(input)).toBe(expected);
      });
    });
  });
});