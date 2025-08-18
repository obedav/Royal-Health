import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  Checkbox,
  Link,
  Divider,
  Icon,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  RadioGroup,
  Radio,
  useToast,
  IconButton,
  Progress,
  Badge
} from '@chakra-ui/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaPhone, 
  FaEnvelope,
  FaUserMd,
  FaUserFriends,
  FaCheck
} from 'react-icons/fa'

// Nigerian phone regex
const PHONE_REGEX = /^(\+234|234|0)[789][01]\d{8}$/

// Validation schema matching backend expectations
const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(PHONE_REGEX, 'Please enter a valid Nigerian phone number (+234xxxxxxxxxx)'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  role: z.enum(['client', 'nurse'], { required_error: 'Please select your role' }),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  agreeToPrivacy: z.boolean().refine(val => val === true, 'You must agree to the privacy policy')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type RegisterFormSchema = z.infer<typeof registerSchema>

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'client'
    }
  })

  const password = watch('password')
  const selectedRole = watch('role')

  // Password strength calculation
  const getPasswordStrength = (password: string): number => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    return strength
  }

  const passwordStrength = getPasswordStrength(password)

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 50) return 'red'
    if (strength < 75) return 'orange'
    return 'green'
  }

const onSubmit = async (formData: RegisterFormSchema) => {
  setIsSubmitting(true)
  setError('')

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        preferredLanguage: 'en',
      }),
    })

    const data = await response.json()

    if (response.ok) {
      // Registration successful
      toast({
        title: 'Registration Successful!',
        description: `Welcome to Royal Health, ${data.user.firstName}!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Store tokens
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))

      navigate('/dashboard')
    } else {
      // Registration failed
      setError(data.message || 'Registration failed. Please try again.')
      toast({
        title: 'Registration Failed',
        description: data.message || 'Please check your information and try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  } catch (err: any) {
    console.error('Registration error:', err)
    setError('Network error. Please check your connection and try again.')
    toast({
      title: 'Connection Error',
      description: 'Unable to connect to the server. Please try again.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    })
  } finally {
    setIsSubmitting(false)
  }
}


  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FCE7F3 0%, #F3E5F5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <Container maxW="lg">
        <Card boxShadow="2xl" borderRadius="2xl" overflow="hidden">
          <CardBody p={8}>
            <VStack spacing={8} align="stretch">
              {/* Header */}
              <VStack spacing={4} textAlign="center">
                <Box
                  w="16"
                  h="16"
                  bg="linear-gradient(45deg, var(--chakra-colors-primary-500), var(--chakra-colors-secondary-500))"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mx="auto"
                >
                  <Icon as={FaUserFriends} color="white" fontSize="2xl" />
                </Box>
                
                <VStack spacing={2}>
                  <Heading size="lg" color="gray.800">
                    Join Royal Health
                  </Heading>
                  <Text color="gray.600">
                    Create your account to access professional healthcare services
                  </Text>
                </VStack>
              </VStack>

              {/* Error Alert */}
              {error && (
                <Alert status="error" borderRadius="lg">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={6}>
                  {/* Role Selection */}
                  <FormControl isInvalid={!!errors.role}>
                    <FormLabel>I am a:</FormLabel>
                    <RadioGroup 
                      value={selectedRole} 
                      onChange={(value) => setValue('role', value as 'client' | 'nurse')}
                    >
                      <HStack spacing={8}>
                        <HStack 
                          spacing={3} 
                          p={4} 
                          borderRadius="lg" 
                          border="2px" 
                          borderColor={selectedRole === 'client' ? 'primary.500' : 'gray.200'} 
                          bg={selectedRole === 'client' ? 'primary.50' : 'white'} 
                          cursor="pointer" 
                          flex={1} 
                          justify="center"
                          onClick={() => setValue('role', 'client')}
                        >
                          <Radio value="client" colorScheme="primary" />
                          <VStack spacing={1} align="start">
                            <HStack>
                              <Icon as={FaUser} color="primary.500" />
                              <Text fontWeight="bold" color="gray.800">Patient</Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.600">Book healthcare services</Text>
                          </VStack>
                        </HStack>
                        
                        <HStack 
                          spacing={3} 
                          p={4} 
                          borderRadius="lg" 
                          border="2px" 
                          borderColor={selectedRole === 'nurse' ? 'secondary.500' : 'gray.200'} 
                          bg={selectedRole === 'nurse' ? 'secondary.50' : 'white'} 
                          cursor="pointer" 
                          flex={1} 
                          justify="center"
                          onClick={() => setValue('role', 'nurse')}
                        >
                          <Radio value="nurse" colorScheme="purple" />
                          <VStack spacing={1} align="start">
                            <HStack>
                              <Icon as={FaUserMd} color="secondary.500" />
                              <Text fontWeight="bold" color="gray.800">Nurse</Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.600">Provide healthcare services</Text>
                          </VStack>
                        </HStack>
                      </HStack>
                    </RadioGroup>
                    <FormErrorMessage>{errors.role?.message}</FormErrorMessage>
                  </FormControl>

                  {/* Name Fields */}
                  <HStack spacing={4} w="full">
                    <FormControl isInvalid={!!errors.firstName}>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        {...register('firstName')}
                        placeholder="First name"
                        size="lg"
                        borderRadius="lg"
                      />
                      <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.lastName}>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        {...register('lastName')}
                        placeholder="Last name"
                        size="lg"
                        borderRadius="lg"
                      />
                      <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
                    </FormControl>
                  </HStack>

                  {/* Contact Fields */}
                  <HStack spacing={4} w="full">
                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel>Email Address</FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <Icon as={FaEnvelope} color="gray.400" />
                        </InputLeftElement>
                        <Input
                          {...register('email')}
                          type="email"
                          placeholder="email@example.com"
                          size="lg"
                          borderRadius="lg"
                        />
                      </InputGroup>
                      <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.phone}>
                      <FormLabel>Phone Number</FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <Icon as={FaPhone} color="gray.400" />
                        </InputLeftElement>
                        <Input
                          {...register('phone')}
                          placeholder="+2348012345678"
                          size="lg"
                          borderRadius="lg"
                        />
                      </InputGroup>
                      <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                    </FormControl>
                  </HStack>

                  {/* Password Fields */}
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FaLock} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        size="lg"
                        borderRadius="lg"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={<Icon as={showPassword ? FaEyeSlash : FaEye} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    
                    {/* Password Strength Indicator */}
                    {password && (
                      <VStack spacing={2} mt={2} align="stretch">
                        <HStack justify="space-between">
                          <Text fontSize="xs" color="gray.600">Password strength:</Text>
                          <Badge colorScheme={getPasswordStrengthColor(passwordStrength)} size="sm">
                            {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Good' : 'Strong'}
                          </Badge>
                        </HStack>
                        <Progress value={passwordStrength} colorScheme={getPasswordStrengthColor(passwordStrength)} size="sm" borderRadius="full" />
                      </VStack>
                    )}
                    
                    <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.confirmPassword}>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FaLock} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        size="lg"
                        borderRadius="lg"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          icon={<Icon as={showConfirmPassword ? FaEyeSlash : FaEye} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
                  </FormControl>

                  {/* Agreement Checkboxes */}
                  <VStack spacing={3} align="stretch">
                    <FormControl isInvalid={!!errors.agreeToTerms}>
                      <Checkbox {...register('agreeToTerms')} colorScheme="primary">
                        <Text fontSize="sm">
                          I agree to the{' '}
                          <Link color="primary.500" textDecoration="underline">
                            Terms and Conditions
                          </Link>
                        </Text>
                      </Checkbox>
                      <FormErrorMessage>{errors.agreeToTerms?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.agreeToPrivacy}>
                      <Checkbox {...register('agreeToPrivacy')} colorScheme="primary">
                        <Text fontSize="sm">
                          I agree to the{' '}
                          <Link color="primary.500" textDecoration="underline">
                            Privacy Policy
                          </Link>{' '}
                          and consent to receiving SMS notifications
                        </Text>
                      </Checkbox>
                      <FormErrorMessage>{errors.agreeToPrivacy?.message}</FormErrorMessage>
                    </FormControl>
                  </VStack>

                  {/* Register Button */}
                  <Button
                    type="submit"
                    colorScheme="primary"
                    size="lg"
                    w="full"
                    isLoading={isSubmitting}
                    loadingText="Creating account..."
                    borderRadius="lg"
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                  >
                    Create Account
                  </Button>
                </VStack>
              </form>

              {/* Divider */}
              <HStack>
                <Divider />
                <Text fontSize="sm" color="gray.500" px={3}>
                  OR
                </Text>
                <Divider />
              </HStack>

              {/* Login Link */}
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Already have an account?{' '}
                <Link 
                  as={RouterLink} 
                  to="/login" 
                  color="primary.500" 
                  fontWeight="bold"
                >
                  Sign In
                </Link>
              </Text>

              {/* Demo Credentials */}
              <Box 
                bg="blue.50" 
                p={4} 
                borderRadius="lg" 
                textAlign="center"
              >
                <Text fontSize="xs" fontWeight="bold" color="blue.700" mb={2}>
                  Demo Test Account
                </Text>
                <Text fontSize="xs" color="blue.600">
                  You can also test with: john.doe@royalhealth.ng / SecurePassword123!
                </Text>
              </Box>

              {/* Security Notice */}
              <Box 
                bg="gray.50" 
                p={4} 
                borderRadius="lg" 
                textAlign="center"
              >
                <HStack justify="center" mb={2}>
                  <Icon as={FaCheck} color="green.500" fontSize="sm" />
                  <Text fontSize="xs" fontWeight="bold" color="gray.700">
                    Your data is secure and encrypted
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.600">
                  We comply with Nigerian healthcare privacy regulations and never share your personal information.
                </Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </div>
  )
}

export default Register