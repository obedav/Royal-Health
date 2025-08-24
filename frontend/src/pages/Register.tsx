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
  FaCheck,
  FaShieldAlt
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
      background: 'linear-gradient(135deg, #FCE7F3 0%, #F3E5F5 50%, #C2185B08 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      {/* Background Decorative Elements */}
      <Box
        position="absolute"
        top="10%"
        left="10%"
        w="100px"
        h="100px"
        borderRadius="full"
        bgGradient="linear(45deg, brand.200, purple.200)"
        opacity="0.3"
        filter="blur(40px)"
      />
      <Box
        position="absolute"
        bottom="20%"
        right="15%"
        w="150px"
        h="150px"
        borderRadius="full"
        bgGradient="linear(45deg, purple.200, brand.200)"
        opacity="0.2"
        filter="blur(60px)"
      />

      <Container maxW="lg">
        <Card 
          boxShadow="0 25px 50px rgba(194, 24, 91, 0.15)" 
          borderRadius="3xl" 
          overflow="hidden"
          border="1px solid"
          borderColor="brand.100"
          bg="white"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '4px',
            bgGradient: 'linear(90deg, brand.500, purple.500)',
          }}
        >
          <CardBody p={10}>
            <VStack spacing={8} align="stretch">
              {/* Header - Enhanced */}
              <VStack spacing={4} textAlign="center">
                <Box
                  w="20"
                  h="20"
                  bgGradient="linear(45deg, brand.500, purple.500)"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mx="auto"
                  boxShadow="0 8px 25px rgba(194, 24, 91, 0.3)"
                  position="relative"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: '-4px',
                    left: '-4px',
                    right: '-4px',
                    bottom: '-4px',
                    bgGradient: 'linear(45deg, brand.400, purple.400)',
                    borderRadius: 'full',
                    zIndex: -1,
                    opacity: 0.3,
                  }}
                >
                  <Icon as={FaUserFriends} color="white" fontSize="2xl" />
                </Box>
                
                <VStack spacing={3}>
                  <Heading 
                    size="xl" 
                    color="gray.800"
                    fontWeight="800"
                  >
                    Join{' '}
                    <Text
                      as="span"
                      bgGradient="linear(45deg, brand.500, purple.500)"
                      bgClip="text"
                      sx={{
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Royal Health
                    </Text>
                  </Heading>
                  <Text color="gray.600" fontSize="lg" fontWeight="500">
                    Create your account to access professional healthcare services
                  </Text>
                </VStack>
              </VStack>

              {/* Error Alert - Enhanced */}
              {error && (
                <Alert 
                  status="error" 
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="red.300"
                  boxShadow="0 4px 15px rgba(220, 38, 38, 0.1)"
                >
                  <AlertIcon />
                  <Text fontWeight="600">{error}</Text>
                </Alert>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={6}>
                  {/* Role Selection - Enhanced */}
                  <FormControl isInvalid={!!errors.role}>
                    <FormLabel fontWeight="700" color="gray.700" fontSize="md">I am a:</FormLabel>
                    <RadioGroup 
                      value={selectedRole} 
                      onChange={(value) => setValue('role', value as 'client' | 'nurse')}
                    >
                      <HStack spacing={4}>
                        <Box 
                          flex={1}
                          p={5} 
                          borderRadius="xl" 
                          border="3px solid" 
                          borderColor={selectedRole === 'client' ? 'brand.500' : 'gray.200'} 
                          bgGradient={selectedRole === 'client' ? 'linear(135deg, brand.50, brand.25)' : 'linear(135deg, gray.50, white)'} 
                          cursor="pointer" 
                          onClick={() => setValue('role', 'client')}
                          transition="all 0.3s ease-in-out"
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: selectedRole === 'client' 
                              ? '0 8px 25px rgba(194, 24, 91, 0.15)' 
                              : '0 4px 15px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <VStack spacing={3}>
                            <HStack justify="center" spacing={3}>
                              <Radio value="client" colorScheme="brand" size="lg" />
                              <Icon 
                                as={FaUser} 
                                color={selectedRole === 'client' ? 'brand.600' : 'gray.500'} 
                                fontSize="xl"
                              />
                            </HStack>
                            <VStack spacing={1}>
                              <Text fontWeight="800" color="gray.800" fontSize="lg">Patient</Text>
                              <Text fontSize="sm" color="gray.600" textAlign="center" fontWeight="500">
                                Book healthcare services
                              </Text>
                            </VStack>
                          </VStack>
                        </Box>
                        
                        <Box 
                          flex={1}
                          p={5} 
                          borderRadius="xl" 
                          border="3px solid" 
                          borderColor={selectedRole === 'nurse' ? 'purple.500' : 'gray.200'} 
                          bgGradient={selectedRole === 'nurse' ? 'linear(135deg, purple.50, purple.25)' : 'linear(135deg, gray.50, white)'} 
                          cursor="pointer" 
                          onClick={() => setValue('role', 'nurse')}
                          transition="all 0.3s ease-in-out"
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: selectedRole === 'nurse' 
                              ? '0 8px 25px rgba(123, 31, 162, 0.15)' 
                              : '0 4px 15px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <VStack spacing={3}>
                            <HStack justify="center" spacing={3}>
                              <Radio value="nurse" colorScheme="purple" size="lg" />
                              <Icon 
                                as={FaUserMd} 
                                color={selectedRole === 'nurse' ? 'purple.600' : 'gray.500'} 
                                fontSize="xl"
                              />
                            </HStack>
                            <VStack spacing={1}>
                              <Text fontWeight="800" color="gray.800" fontSize="lg">Nurse</Text>
                              <Text fontSize="sm" color="gray.600" textAlign="center" fontWeight="500">
                                Provide healthcare services
                              </Text>
                            </VStack>
                          </VStack>
                        </Box>
                      </HStack>
                    </RadioGroup>
                    <FormErrorMessage fontWeight="600">{errors.role?.message}</FormErrorMessage>
                  </FormControl>

                  {/* Name Fields - Enhanced */}
                  <HStack spacing={4} w="full">
                    <FormControl isInvalid={!!errors.firstName}>
                      <FormLabel fontWeight="700" color="gray.700">First Name</FormLabel>
                      <Input
                        {...register('firstName')}
                        placeholder="First name"
                        size="lg"
                        borderRadius="xl"
                        borderWidth="2px"
                        borderColor="gray.300"
                        _hover={{
                          borderColor: "brand.400"
                        }}
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
                        }}
                        fontWeight="500"
                      />
                      <FormErrorMessage fontWeight="600">{errors.firstName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.lastName}>
                      <FormLabel fontWeight="700" color="gray.700">Last Name</FormLabel>
                      <Input
                        {...register('lastName')}
                        placeholder="Last name"
                        size="lg"
                        borderRadius="xl"
                        borderWidth="2px"
                        borderColor="gray.300"
                        _hover={{
                          borderColor: "brand.400"
                        }}
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
                        }}
                        fontWeight="500"
                      />
                      <FormErrorMessage fontWeight="600">{errors.lastName?.message}</FormErrorMessage>
                    </FormControl>
                  </HStack>

                  {/* Contact Fields - Enhanced */}
                  <HStack spacing={4} w="full">
                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel fontWeight="700" color="gray.700">Email Address</FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <Icon as={FaEnvelope} color="brand.500" />
                        </InputLeftElement>
                        <Input
                          {...register('email')}
                          type="email"
                          placeholder="email@example.com"
                          size="lg"
                          borderRadius="xl"
                          borderWidth="2px"
                          borderColor="gray.300"
                          _hover={{
                            borderColor: "brand.400"
                          }}
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
                          }}
                          fontWeight="500"
                        />
                      </InputGroup>
                      <FormErrorMessage fontWeight="600">{errors.email?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.phone}>
                      <FormLabel fontWeight="700" color="gray.700">Phone Number</FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <Icon as={FaPhone} color="brand.500" />
                        </InputLeftElement>
                        <Input
                          {...register('phone')}
                          placeholder="+2348012345678"
                          size="lg"
                          borderRadius="xl"
                          borderWidth="2px"
                          borderColor="gray.300"
                          _hover={{
                            borderColor: "brand.400"
                          }}
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
                          }}
                          fontWeight="500"
                        />
                      </InputGroup>
                      <FormErrorMessage fontWeight="600">{errors.phone?.message}</FormErrorMessage>
                    </FormControl>
                  </HStack>

                  {/* Password Fields - Enhanced */}
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel fontWeight="700" color="gray.700">Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FaLock} color="brand.500" />
                      </InputLeftElement>
                      <Input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        size="lg"
                        borderRadius="xl"
                        borderWidth="2px"
                        borderColor="gray.300"
                        _hover={{
                          borderColor: "brand.400"
                        }}
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
                        }}
                        fontWeight="500"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={<Icon as={showPassword ? FaEyeSlash : FaEye} />}
                          variant="ghost"
                          size="sm"
                          color="brand.500"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    
                    {/* Password Strength Indicator - Enhanced */}
                    {password && (
                      <VStack spacing={2} mt={3} align="stretch">
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.600" fontWeight="600">Password strength:</Text>
                          <Badge 
                            colorScheme={getPasswordStrengthColor(passwordStrength)} 
                            size="sm"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontWeight="700"
                          >
                            {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Good' : 'Strong'}
                          </Badge>
                        </HStack>
                        <Progress 
                          value={passwordStrength} 
                          colorScheme={getPasswordStrengthColor(passwordStrength)} 
                          size="md" 
                          borderRadius="full"
                          bg="gray.200"
                        />
                      </VStack>
                    )}
                    
                    <FormErrorMessage fontWeight="600">{errors.password?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.confirmPassword}>
                    <FormLabel fontWeight="700" color="gray.700">Confirm Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FaLock} color="brand.500" />
                      </InputLeftElement>
                      <Input
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        size="lg"
                        borderRadius="xl"
                        borderWidth="2px"
                        borderColor="gray.300"
                        _hover={{
                          borderColor: "brand.400"
                        }}
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
                        }}
                        fontWeight="500"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          icon={<Icon as={showConfirmPassword ? FaEyeSlash : FaEye} />}
                          variant="ghost"
                          size="sm"
                          color="brand.500"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage fontWeight="600">{errors.confirmPassword?.message}</FormErrorMessage>
                  </FormControl>

                  {/* Agreement Checkboxes - Enhanced */}
                  <VStack spacing={4} align="stretch">
                    <FormControl isInvalid={!!errors.agreeToTerms}>
                      <Checkbox 
                        {...register('agreeToTerms')} 
                        colorScheme="brand" 
                        size="lg"
                        iconColor="white"
                      >
                        <Text fontSize="sm" fontWeight="500">
                          I agree to the{' '}
                          <Link 
                            color="brand.600" 
                            textDecoration="underline"
                            fontWeight="700"
                            _hover={{ color: "brand.700" }}
                          >
                            Terms and Conditions
                          </Link>
                        </Text>
                      </Checkbox>
                      <FormErrorMessage fontWeight="600">{errors.agreeToTerms?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.agreeToPrivacy}>
                      <Checkbox 
                        {...register('agreeToPrivacy')} 
                        colorScheme="brand" 
                        size="lg"
                        iconColor="white"
                      >
                        <Text fontSize="sm" fontWeight="500">
                          I agree to the{' '}
                          <Link 
                            color="brand.600" 
                            textDecoration="underline"
                            fontWeight="700"
                            _hover={{ color: "brand.700" }}
                          >
                            Privacy Policy
                          </Link>
                          {' '}and consent to receiving SMS notifications
                        </Text>
                      </Checkbox>
                      <FormErrorMessage fontWeight="600">{errors.agreeToPrivacy?.message}</FormErrorMessage>
                    </FormControl>
                  </VStack>

                  {/* Register Button - Enhanced */}
                  <Button
                    type="submit"
                    bgGradient="linear(45deg, brand.500, purple.500)"
                    color="white"
                    size="lg"
                    w="full"
                    isLoading={isSubmitting}
                    loadingText="Creating account..."
                    borderRadius="xl"
                    py={7}
                    fontSize="lg"
                    fontWeight="800"
                    boxShadow="0 8px 25px rgba(194, 24, 91, 0.25)"
                    _hover={{
                      bgGradient: "linear(45deg, brand.600, purple.600)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 35px rgba(194, 24, 91, 0.35)"
                    }}
                    _active={{
                      transform: "translateY(0)"
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    Create Account
                  </Button>
                </VStack>
              </form>

              {/* Divider - Enhanced */}
              <HStack>
                <Divider borderColor="gray.300" />
                <Text fontSize="sm" color="gray.500" px={4} fontWeight="600">
                  OR
                </Text>
                <Divider borderColor="gray.300" />
              </HStack>

              {/* Login Link - Enhanced */}
              <Text fontSize="md" color="gray.600" textAlign="center" fontWeight="500">
                Already have an account?{' '}
                <Link 
                  as={RouterLink} 
                  to="/login" 
                  color="brand.600" 
                  fontWeight="800"
                  textDecoration="none"
                  _hover={{ 
                    color: "brand.700",
                    textDecoration: "underline"
                  }}
                >
                  Sign In
                </Link>
              </Text>

              {/* Security Notice - Enhanced */}
              <Box 
                bgGradient="linear(135deg, green.50, green.25)" 
                p={5} 
                borderRadius="xl" 
                textAlign="center"
                border="2px solid"
                borderColor="green.200"
              >
                <HStack justify="center" mb={3}>
                  <Icon as={FaShieldAlt} color="green.600" fontSize="lg" />
                  <Text fontSize="sm" fontWeight="800" color="green.700">
                    Your data is secure and encrypted
                  </Text>
                </HStack>
                <Text fontSize="sm" color="green.600" fontWeight="500">
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