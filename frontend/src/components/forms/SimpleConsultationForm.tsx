import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Textarea,
  Button,
  Card,
  CardBody,
  useToast,
  Divider,
  Icon,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FaStethoscope, FaPhone, FaUser, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { PHONE_REGEX, NIGERIAN_STATES, HEALTHCARE_SERVICES } from '../../utils/constants'
import { useBookingContext } from '../../context/BookingContext'
import PhoneNumberInput from '../common/PhoneNumberInput'

const consultationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(PHONE_REGEX, 'Please enter a valid Nigerian phone number'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  age: z.number().min(1, 'Age is required').max(120, 'Please enter a valid age'),
  gender: z.enum(['male', 'female', 'other']),
  serviceType: z.string().min(1, 'Please select an assessment type'),
  state: z.string().min(1, 'Please select your state'),
  city: z.string().min(1, 'Please enter your city'),
  address: z.string().min(10, 'Please provide your full address'),
  healthConcerns: z.string().optional(),
  preferredDate: z.string().min(1, 'Please select your preferred date'),
  preferredTime: z.enum(['morning', 'afternoon', 'evening']),
})

type ConsultationFormData = z.infer<typeof consultationSchema>

interface SimpleConsultationFormProps {
  selectedService?: any
  onClose?: () => void
  showBookingOption?: boolean // New prop to show booking option
}

const SimpleConsultationForm: React.FC<SimpleConsultationFormProps> = ({
  selectedService,
  onClose,
  showBookingOption = true
}) => {
  const toast = useToast()
  const navigate = useNavigate()
  const { setConsultationData } = useBookingContext()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      preferredTime: 'morning'
    }
  })

  const onSubmit = async (data: ConsultationFormData) => {
    try {
      // Import API configuration
      const { buildApiUrl, apiRequest } = await import('../../config/api.config')

      // Submit to admin monitoring system with proper error handling
      const response = await apiRequest(
        buildApiUrl('/api/consultations'),
        {
          method: 'POST',
          body: JSON.stringify({
            ...data,
            submittedAt: new Date().toISOString(),
            status: 'pending',
            selectedService: selectedService?.name || 'Not specified',
          }),
        }
      )

      // Parse response to ensure it's valid
      const result = await response.json()

      // Show genuine success message
      toast({
        title: 'Consultation Request Submitted!',
        description: showBookingOption
          ? 'Your request has been successfully submitted. Would you like to proceed with detailed booking?'
          : `Thank you! We'll contact you at ${data.phone} within 24 hours.`,
        status: 'success',
        duration: showBookingOption ? 12000 : 8000,
        isClosable: true,
      })

      // Save data to context for potential booking flow
      setConsultationData(data)
      reset()

      // Offer booking option if enabled
      if (showBookingOption) {
        setTimeout(() => {
          const proceedToBooking = window.confirm(
            'Your consultation request has been submitted successfully!\n\n' +
            'Would you like to proceed with detailed booking to schedule your appointment immediately?\n\n' +
            'Click "OK" to continue with booking or "Cancel" to wait for our call.'
          )

          if (proceedToBooking) {
            // Close modal and navigate to booking with pre-filled data
            if (onClose) onClose()
            navigate('/booking?from=consultation')
          } else {
            // Just close modal
            if (onClose) onClose()
          }
        }, 1500)
      } else {
        // Close modal if provided
        if (onClose) {
          setTimeout(onClose, 2000)
        }
      }
    } catch (error) {
      // Log actual error for debugging
      console.error('Consultation submission error:', error)

      // Show appropriate error message based on error type
      const isNetworkError = error instanceof TypeError ||
                            (error instanceof Error && error.name === 'AbortError')

      if (isNetworkError) {
        // Network/timeout error - provide offline fallback
        toast({
          title: 'Connection Issue',
          description: 'Unable to submit online. Please call us directly at +234 706 332 5184 or try again later.',
          status: 'warning',
          duration: 10000,
          isClosable: true,
        })

        // Still save data locally for potential retry
        setConsultationData(data)

        // Log for admin monitoring (local storage as fallback)
        try {
          const existingRequests = JSON.parse(localStorage.getItem('pendingConsultations') || '[]')
          existingRequests.push({
            ...data,
            submittedAt: new Date().toISOString(),
            status: 'pending_offline',
            selectedService: selectedService?.name || 'Not specified',
            error: error instanceof Error ? error.message : 'Network error'
          })
          localStorage.setItem('pendingConsultations', JSON.stringify(existingRequests))
        } catch (storageError) {
          console.warn('Could not save to local storage:', storageError)
        }
      } else {
        // Server error
        toast({
          title: 'Submission Error',
          description: 'There was an issue processing your request. Please try again or call us at +234 706 332 5184.',
          status: 'error',
          duration: 10000,
          isClosable: true,
        })
      }

      // Don't reset form on error so user can retry
      // Don't close modal on error
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="2xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Icon as={FaStethoscope} fontSize="4xl" color="brand.500" mb={4} />
            <Heading
              size="xl"
              mb={4}
              bgGradient="linear(45deg, brand.600, purple.600)"
              bgClip="text"
              sx={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Request Health Consultation
            </Heading>
            <Text color="gray.600" fontSize="lg" mb={2}>
              Professional healthcare assessment at your home
            </Text>
            <Text color="gray.500" fontSize="sm">
              Fill out the form below and we'll contact you to schedule your appointment
            </Text>
          </Box>

          {/* Form */}
          <Card>
            <CardBody p={8}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={6} align="stretch">
                  {/* Personal Information */}
                  <Box>
                    <HStack spacing={2} mb={4}>
                      <Icon as={FaUser} color="brand.500" />
                      <Heading size="md" color="gray.700">Personal Information</Heading>
                    </HStack>

                    <VStack spacing={4}>
                      <HStack spacing={4} w="full">
                        <FormControl isInvalid={!!errors.name}>
                          <FormLabel>Full Name *</FormLabel>
                          <Input {...register('name')} placeholder="Enter your full name" />
                          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.age}>
                          <FormLabel>Age *</FormLabel>
                          <Input
                            type="number"
                            {...register('age', { valueAsNumber: true })}
                            placeholder="Age"
                          />
                          <FormErrorMessage>{errors.age?.message}</FormErrorMessage>
                        </FormControl>
                      </HStack>

                      <HStack spacing={4} w="full">
                        <PhoneNumberInput
                          label="Phone Number *"
                          value={watch('phone') || ''}
                          onChange={(value) => setValue('phone', value)}
                          placeholder="8012345678"
                          isRequired={true}
                          isInvalid={!!errors.phone}
                          errorMessage={errors.phone?.message}
                        />

                        <FormControl isInvalid={!!errors.gender}>
                          <FormLabel>Gender *</FormLabel>
                          <Select {...register('gender')} placeholder="Select gender">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </Select>
                          <FormErrorMessage>{errors.gender?.message}</FormErrorMessage>
                        </FormControl>
                      </HStack>

                      <FormControl isInvalid={!!errors.email}>
                        <FormLabel>Email Address (Optional)</FormLabel>
                        <Input
                          {...register('email')}
                          placeholder="email@example.com"
                          type="email"
                        />
                        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                      </FormControl>
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Assessment Type */}
                  <Box>
                    <HStack spacing={2} mb={4}>
                      <Icon as={FaStethoscope} color="brand.500" />
                      <Heading size="md" color="gray.700">Assessment Type</Heading>
                    </HStack>

                    <FormControl isInvalid={!!errors.serviceType}>
                      <FormLabel>Select Assessment Type *</FormLabel>
                      <Select
                        {...register('serviceType')}
                        placeholder="Choose the type of assessment"
                        defaultValue={selectedService?.id || ''}
                      >
                        {HEALTHCARE_SERVICES.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name} ({service.duration} min)
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>{errors.serviceType?.message}</FormErrorMessage>
                    </FormControl>
                  </Box>

                  <Divider />

                  {/* Location */}
                  <Box>
                    <HStack spacing={2} mb={4}>
                      <Icon as={FaMapMarkerAlt} color="brand.500" />
                      <Heading size="md" color="gray.700">Location</Heading>
                    </HStack>

                    <VStack spacing={4}>
                      <HStack spacing={4} w="full">
                        <FormControl isInvalid={!!errors.state}>
                          <FormLabel>State *</FormLabel>
                          <Select {...register('state')} placeholder="Select your state">
                            {NIGERIAN_STATES.map((state) => (
                              <option key={state.value} value={state.value}>
                                {state.label}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage>{errors.state?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.city}>
                          <FormLabel>City *</FormLabel>
                          <Input {...register('city')} placeholder="Enter your city" />
                          <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
                        </FormControl>
                      </HStack>

                      <FormControl isInvalid={!!errors.address}>
                        <FormLabel>Full Address *</FormLabel>
                        <Textarea
                          {...register('address')}
                          placeholder="Enter your complete address including street, area, and any landmarks"
                          rows={3}
                        />
                        <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
                      </FormControl>
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Scheduling */}
                  <Box>
                    <HStack spacing={2} mb={4}>
                      <Icon as={FaCalendarAlt} color="brand.500" />
                      <Heading size="md" color="gray.700">Preferred Schedule</Heading>
                    </HStack>

                    <HStack spacing={4} w="full">
                      <FormControl isInvalid={!!errors.preferredDate}>
                        <FormLabel>Preferred Date *</FormLabel>
                        <Input
                          type="date"
                          min={getMinDate()}
                          {...register('preferredDate')}
                        />
                        <FormErrorMessage>{errors.preferredDate?.message}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.preferredTime}>
                        <FormLabel>Preferred Time *</FormLabel>
                        <Select {...register('preferredTime')}>
                          <option value="morning">Morning (8AM - 12PM)</option>
                          <option value="afternoon">Afternoon (12PM - 5PM)</option>
                          <option value="evening">Evening (5PM - 8PM)</option>
                        </Select>
                        <FormErrorMessage>{errors.preferredTime?.message}</FormErrorMessage>
                      </FormControl>
                    </HStack>
                  </Box>

                  <Divider />

                  {/* Health Concerns */}
                  <Box>
                    <FormControl>
                      <FormLabel>Health Concerns (Optional)</FormLabel>
                      <Textarea
                        {...register('healthConcerns')}
                        placeholder="Please describe any specific health concerns or symptoms you'd like to discuss"
                        rows={4}
                      />
                    </FormControl>
                  </Box>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    bgGradient="linear(45deg, brand.500, purple.500)"
                    color="white"
                    size="lg"
                    fontSize="lg"
                    fontWeight="700"
                    py={6}
                    borderRadius="xl"
                    isLoading={isSubmitting}
                    loadingText="Submitting Request..."
                    _hover={{
                      bgGradient: "linear(45deg, brand.600, purple.600)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(194, 24, 91, 0.25)"
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    Submit Consultation Request
                  </Button>

                  {/* Info Text */}
                  <Box textAlign="center" pt={2}>
                    <Text fontSize="sm" color="gray.500">
                      We'll contact you within 24 hours to schedule your appointment.
                      Our healthcare professional will visit you at your specified location.
                    </Text>
                  </Box>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Contact Info */}
          <Box textAlign="center">
            <Text color="gray.600" fontSize="sm">
              Need immediate help? Call us at{' '}
              <Text as="span" fontWeight="bold" color="brand.600">
                +234 706 332 5184
              </Text>
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default SimpleConsultationForm