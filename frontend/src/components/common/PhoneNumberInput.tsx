// src/components/common/PhoneNumberInput.tsx
import {
  HStack,
  Select,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Box,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'

interface CountryCode {
  code: string
  name: string
  flag: string
  dialCode: string
}

interface PhoneNumberInputProps {
  label?: string
  placeholder?: string
  value?: string
  onChange: (value: string) => void
  isRequired?: boolean
  isInvalid?: boolean
  errorMessage?: string
  bg?: string
  borderColor?: string
}

// Popular country codes
const countryCodes: CountryCode[] = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
]

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label = "Phone Number",
  placeholder = "801 234 5678",
  value = "",
  onChange,
  isRequired = false,
  isInvalid = false,
  errorMessage = "",
  bg = "white",
  borderColor = "gray.200",
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0])
  const [phoneNumber, setPhoneNumber] = useState("")

  // Parse existing value if provided
  useEffect(() => {
    if (value) {
      // Find matching country code
      const country = countryCodes.find(c => value.startsWith(c.dialCode))
      if (country) {
        setSelectedCountry(country)
        setPhoneNumber(value.replace(country.dialCode, '').trim())
      } else {
        // Default to Nigeria if no match
        setSelectedCountry(countryCodes[0])
        setPhoneNumber(value)
      }
    }
  }, [value])

  const handleCountryChange = (countryCode: string) => {
    const country = countryCodes.find(c => c.code === countryCode)
    if (country) {
      setSelectedCountry(country)
      const fullNumber = phoneNumber ? `${country.dialCode} ${phoneNumber}` : country.dialCode
      onChange(fullNumber)
    }
  }

  const handlePhoneNumberChange = (number: string) => {
    // Remove any non-numeric characters except spaces and dashes
    const cleanNumber = number.replace(/[^\d\s-]/g, '')
    setPhoneNumber(cleanNumber)

    const fullNumber = cleanNumber ? `${selectedCountry.dialCode} ${cleanNumber}` : selectedCountry.dialCode
    onChange(fullNumber)
  }

  return (
    <FormControl isRequired={isRequired} isInvalid={isInvalid}>
      {label && <FormLabel>{label}</FormLabel>}
      <HStack spacing={2}>
        {/* Country Code Dropdown */}
        <Box minW="120px">
          <Select
            value={selectedCountry.code}
            onChange={(e) => handleCountryChange(e.target.value)}
            bg={bg}
            borderColor={borderColor}
            size="md"
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.dialCode}
              </option>
            ))}
          </Select>
        </Box>

        {/* Phone Number Input */}
        <Input
          type="tel"
          value={phoneNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
          placeholder={placeholder}
          bg={bg}
          borderColor={borderColor}
          flex={1}
        />
      </HStack>

      {/* Display full number preview */}
      {phoneNumber && (
        <Text fontSize="xs" color="gray.500" mt={1}>
          Full number: {selectedCountry.dialCode} {phoneNumber}
        </Text>
      )}

      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  )
}

export default PhoneNumberInput