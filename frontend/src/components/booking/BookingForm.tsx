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
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Icon,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaStethoscope } from 'react-icons/fa'
import { BookingService, BookingFormData, TimeSlot } from '../../types/booking.types'
import { NIGERIAN_STATES, PHONE_REGEX, ASSESSMENT_PRICE } from '../../utils/constants'
import { useBookingStore, useGuestSession } from '../../store/bookingStore'
import bookingService from '../../services/booking.service'

// Validation schema for assessment booking
const assessmentBookingSchema = z.object({
  // Patient Information
  patientName: z.string().min(2, 'Name must be at least 2 characters'),
  patientAge: z.number().min(1, 'Age is required').max(120, 'Please enter a valid age'),
  patientGender: z.enum(['male', 'female', 'other']),
  patientPhone: z.string().regex(PHONE_REGEX, 'Please enter a valid Nigerian phone number'),
  patientEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  
  // Assessment Appointment Details
  date: z.string().min(1, 'Please select a date'),
  timeSlot: z.string().min(1, 'Please select a time'),
  
  // Location for Home Assessment
  state: z.string().min(1, 'Please select your state'),
  city: z.string().min(1, 'Please select your city'),
  area: z.string().min(1, 'Please specify your area'),
  street: z.string().min(5, 'Please provide a detailed address'),
  landmark: z.string().optional(),
  
  // Emergency Contact
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().regex(PHONE_REGEX, 'Please enter a valid phone number'),
  emergencyContactRelationship: z.string().min(1, 'Please specify relationship'),
  
  // Medical Information for Assessment
  currentMedicalConditions: z.string().optional(),
  currentMedications: z.string().optional(),
  knownAllergies: z.string().optional(),
  previousHealthIssues: z.string().optional(),
  
  // Assessment Preferences
  nurseGenderPreference: z.enum(['male', 'female', 'no-preference']),
  specialRequirements: z.string().optional(),
  healthconcerns: z.string().optional(),
  
  // Payment for Assessment
  paymentMethod: z.enum(['card', 'bank-transfer', 'ussd', 'cash']),
})

type AssessmentBookingSchema = z.infer<typeof assessmentBookingSchema>

interface BookingFormProps {
  service: BookingService
  onSubmit: (data: BookingFormData) => void
  onBack: () => void
  allowGuestBooking?: boolean
}

const BookingForm: React.FC<BookingFormProps> = ({ service, onSubmit, onBack, allowGuestBooking = true }) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const toast = useToast()

  // Guest session management
  const { session, createSession, isGuest } = useGuestSession()
  const { currentBooking, updateBookingData } = useBookingStore()

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<AssessmentBookingSchema>({
    resolver: zodResolver(assessmentBookingSchema),
    defaultValues: {
      nurseGenderPreference: 'no-preference',
      paymentMethod: 'card'
    }
  })

  const watchedState = watch('state')
  const watchedDate = watch('date')

  // Generate available time slots for assessment
  const generateAssessmentTimeSlots = (date: string): TimeSlot[] => {
    const slots: TimeSlot[] = []
    
    // Regular assessment hours: 8 AM to 6 PM
    const startHour = 8
    const endHour = 18
    
    // Emergency assessments available 24/7
    const isEmergency = service.category === 'emergency'
    const finalEndHour = isEmergency ? 24 : endHour
    const finalStartHour = isEmergency ? 0 : startHour
    
    for (let hour = finalStartHour; hour < finalEndHour; hour++) {
      ['00', '30'].forEach(minute => {
        const time = `${hour.toString().padStart(2, '0')}:${minute}`
        const displayTime = hour === 0 ? '12:00 AM' : 
                           hour < 12 ? `${hour}:${minute} AM` :
                           hour === 12 ? `12:${minute} PM` :
                           `${hour - 12}:${minute} PM`
        
        slots.push({
          time: displayTime,
          available: Math.random() > 0.2, // 80% availability
          price: ASSESSMENT_PRICE // Fixed ₦5,000 for all assessments
        })
      })
    }
    
    return slots
  }

  // Handle date change and load assessment time slots
  const handleDateChange = async (date: string) => {
    setSelectedDate(date)
    setValue('date', date)
    
    if (date) {
      setIsLoadingSlots(true)
      // Simulate API call for available assessment slots
      setTimeout(() => {
        const slots = generateAssessmentTimeSlots(date)
        setAvailableTimeSlots(slots)
        setIsLoadingSlots(false)
      }, 1000)
    }
  }

  const onFormSubmit = async (data: AssessmentBookingSchema) => {
    try {
      // Create guest session if not exists and guest booking is allowed
      if (allowGuestBooking && !session) {
        createSession(
          data.patientPhone,
          data.patientEmail || undefined,
          data.patientName
        )
      }

      const formData: BookingFormData = {
        serviceId: service.id,
        date: data.date,
        timeSlot: data.timeSlot,
        duration: service.duration,
        patientName: data.patientName,
        patientAge: data.patientAge,
        patientGender: data.patientGender,
        patientPhone: data.patientPhone,
        patientEmail: data.patientEmail || undefined,
        medicalCondition: data.currentMedicalConditions,
        medications: data.currentMedications,
        allergies: data.knownAllergies,
        emergencyContact: {
          name: data.emergencyContactName,
          phone: data.emergencyContactPhone,
          relationship: data.emergencyContactRelationship
        },
        address: {
          street: data.street,
          area: data.area,
          city: data.city,
          state: data.state,
          landmark: data.landmark
        },
        specialRequirements: data.specialRequirements,
        nurseGenderPreference: data.nurseGenderPreference,
        paymentMethod: data.paymentMethod,
        totalAmount: ASSESSMENT_PRICE // Fixed ₦5,000 assessment fee
      }

      // Update booking store
      updateBookingData(formData)

      // Submit booking
      onSubmit(formData)

    } catch (error) {
      console.error('Error submitting booking:', error)
      toast({
        title: 'Booking Error',
        description: 'Failed to submit booking. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Format assessment price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box
          position="relative"
          bg="rgba(255, 255, 255, 0.9)"
          backdropFilter="blur(20px)"
          borderRadius="3xl"
          p={8}
          border="1px solid"
          borderColor="rgba(194, 24, 91, 0.2)"
          boxShadow="0 8px 32px rgba(194, 24, 91, 0.15)"
          _before={{
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "3xl",
            padding: "1px",
            background: "linear-gradient(135deg, rgba(194, 24, 91, 0.3), rgba(123, 31, 162, 0.3))",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
          }}
        >
          <VStack spacing={6} textAlign="center">
            <VStack spacing={3}>
              <Heading 
                size="xl" 
                bgGradient="linear(45deg, brand.600, purple.600)"
                bgClip="text"
                sx={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 4px rgba(194, 24, 91, 0.2))",
                }}
                fontWeight="800"
              >
                Book Your {service.name}
              </Heading>
              <Text
                color="gray.700"
                fontSize="lg"
                fontWeight="500"
                maxW="600px"
                lineHeight="1.6"
              >
                Schedule your professional healthcare assessment at home with our qualified healthcare professionals
              </Text>
              {allowGuestBooking && !isGuest && (
                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Quick Booking!</AlertTitle>
                    <AlertDescription fontSize="sm">
                      Book instantly with just your phone number. No account registration required!
                    </AlertDescription>
                  </Box>
                </Alert>
              )}
              {isGuest && session && (
                <Alert status="success" borderRadius="lg">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Guest Session Active</AlertTitle>
                    <AlertDescription fontSize="sm">
                      Booking as guest user. You can upgrade to a full account later to track all your bookings.
                    </AlertDescription>
                  </Box>
                </Alert>
              )}
            </VStack>
          </VStack>
        </Box>

        {/* Assessment Service Summary */}
        <Card 
          bg="rgba(255, 255, 255, 0.85)"
          backdropFilter="blur(15px)"
          borderColor="rgba(194, 24, 91, 0.2)"
          borderWidth="2px"
          borderRadius="2xl"
          boxShadow="0 4px 20px rgba(194, 24, 91, 0.08)"
        >
          <CardBody p={8}>
            <HStack justify="space-between" align="start">
              <HStack spacing={6} align="start">
                <Box
                  w="60px"
                  h="60px"
                  bgGradient="linear(45deg, brand.500, purple.500)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 4px 15px rgba(194, 24, 91, 0.3)"
                >
                  <Icon as={FaStethoscope} color="white" fontSize="2xl" />
                </Box>
                <VStack align="start" spacing={3}>
                  <Heading 
                    size="md" 
                    bgGradient="linear(45deg, brand.600, purple.600)"
                    bgClip="text"
                    sx={{
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                    fontWeight="700"
                  >
                    {service.name}
                  </Heading>
                  <Text color="gray.600" fontSize="sm" lineHeight="1.5">
                    {service.description}
                  </Text>
                  <HStack spacing={4} flexWrap="wrap">
                    <Badge 
                      bgGradient="linear(45deg, brand.500, purple.500)"
                      color="white"
                      fontSize="sm"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {service.duration} minutes
                    </Badge>
                    <Badge 
                      bg="green.500"
                      color="white"
                      fontSize="lg" 
                      px={4} 
                      py={1}
                      borderRadius="full"
                      fontWeight="600"
                    >
                      {formatPrice(ASSESSMENT_PRICE)}
                    </Badge>
                    {service.category === 'emergency' && (
                      <Badge 
                        bg="red.500"
                        color="white"
                        borderRadius="full"
                        px={3}
                        py={1}
                      >
                        24/7 Available
                      </Badge>
                    )}
                  </HStack>
                </VStack>
              </HStack>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onBack}
                borderColor="rgba(194, 24, 91, 0.3)"
                color="brand.600"
                _hover={{
                  borderColor: "brand.400",
                  bg: "rgba(194, 24, 91, 0.05)"
                }}
              >
                Change Assessment
              </Button>
            </HStack>
          </CardBody>
        </Card>

        {/* Assessment Information Notice */}
        <Alert status="info">
          <AlertIcon />
          <Box>
            <AlertTitle>About Your Assessment</AlertTitle>
            <AlertDescription>
              Our qualified healthcare professionals will conduct a comprehensive assessment in the comfort of your home. 
              All assessments are priced at {formatPrice(ASSESSMENT_PRICE)} regardless of the type or duration.
            </AlertDescription>
          </Box>
        </Alert>

        {/* Booking Form */}
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <VStack spacing={8}>
            {/* Patient Information */}
            <Card 
              w="full"
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(194, 24, 91, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(194, 24, 91, 0.08)"
            >
              <CardBody p={8}>
                <VStack spacing={8} align="stretch">
                  <HStack spacing={4}>
                    <Box
                      w="40px"
                      h="40px"
                      bgGradient="linear(45deg, brand.500, purple.500)"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="0 4px 15px rgba(194, 24, 91, 0.3)"
                    >
                      <Icon as={FaStethoscope} color="white" fontSize="lg" />
                    </Box>
                    <Heading 
                      size="md"
                      bgGradient="linear(45deg, brand.600, purple.600)"
                      bgClip="text"
                      sx={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                      fontWeight="700"
                    >
                      Patient Information
                    </Heading>
                  </HStack>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={!!errors.patientName}>
                      <FormLabel>Full Name *</FormLabel>
                      <Input {...register('patientName')} placeholder="Enter patient's full name" />
                      <FormErrorMessage>{errors.patientName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.patientAge}>
                      <FormLabel>Age *</FormLabel>
                      <Input 
                        type="number" 
                        {...register('patientAge', { valueAsNumber: true })} 
                        placeholder="Age" 
                      />
                      <FormErrorMessage>{errors.patientAge?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.patientGender}>
                      <FormLabel>Gender *</FormLabel>
                      <Select {...register('patientGender')} placeholder="Select gender">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Select>
                      <FormErrorMessage>{errors.patientGender?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.patientPhone}>
                      <FormLabel>Phone Number *</FormLabel>
                      <Input 
                        {...register('patientPhone')} 
                        placeholder="+2348012345678" 
                        type="tel"
                      />
                      <FormErrorMessage>{errors.patientPhone?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.patientEmail}>
                      <FormLabel>Email Address</FormLabel>
                      <Input 
                        {...register('patientEmail')} 
                        placeholder="email@example.com" 
                        type="email"
                      />
                      <FormErrorMessage>{errors.patientEmail?.message}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {/* Assessment Scheduling */}
            <Card 
              w="full"
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(123, 31, 162, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(123, 31, 162, 0.08)"
            >
              <CardBody p={8}>
                <VStack spacing={8} align="stretch">
                  <HStack spacing={4}>
                    <Box
                      w="40px"
                      h="40px"
                      bgGradient="linear(45deg, purple.500, brand.500)"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="0 4px 15px rgba(123, 31, 162, 0.3)"
                    >
                      <Icon as={FaCalendarAlt} color="white" fontSize="lg" />
                    </Box>
                    <Heading 
                      size="md"
                      bgGradient="linear(45deg, purple.600, brand.600)"
                      bgClip="text"
                      sx={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                      fontWeight="700"
                    >
                      Schedule Assessment
                    </Heading>
                  </HStack>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={!!errors.date}>
                      <FormLabel>Preferred Date *</FormLabel>
                      <Input 
                        type="date" 
                        min={getMinDate()}
                        onChange={(e) => handleDateChange(e.target.value)}
                      />
                      <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.timeSlot}>
                      <FormLabel>Preferred Time *</FormLabel>
                      <Select 
                        {...register('timeSlot')} 
                        placeholder={isLoadingSlots ? "Loading available times..." : "Select time"}
                        disabled={!selectedDate || isLoadingSlots}
                      >
                        {availableTimeSlots.map((slot) => (
                          <option 
                            key={slot.time} 
                            value={slot.time}
                            disabled={!slot.available}
                          >
                            {slot.time} {!slot.available && '(Unavailable)'}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>{errors.timeSlot?.message}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>

                  {selectedDate && availableTimeSlots.length === 0 && !isLoadingSlots && (
                    <Alert status="warning">
                      <AlertIcon />
                      <AlertTitle>No available assessment slots!</AlertTitle>
                      <AlertDescription>
                        Please select a different date or contact us for emergency assessments.
                      </AlertDescription>
                    </Alert>
                  )}

                  {service.category === 'emergency' && (
                    <Alert status="info">
                      <AlertIcon />
                      <AlertTitle>Emergency Assessment Available 24/7</AlertTitle>
                      <AlertDescription>
                        Emergency health assessments are available around the clock for urgent, non-life-threatening situations.
                      </AlertDescription>
                    </Alert>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Location for Home Assessment */}
            <Card 
              w="full"
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(34, 197, 94, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(34, 197, 94, 0.08)"
            >
              <CardBody p={8}>
                <VStack spacing={8} align="stretch">
                  <HStack spacing={4}>
                    <Box
                      w="40px"
                      h="40px"
                      bgGradient="linear(45deg, green.500, emerald.500)"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="0 4px 15px rgba(34, 197, 94, 0.3)"
                    >
                      <Icon as={FaMapMarkerAlt} color="white" fontSize="lg" />
                    </Box>
                    <Heading 
                      size="md"
                      bgGradient="linear(45deg, green.600, emerald.600)"
                      bgClip="text"
                      sx={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                      fontWeight="700"
                    >
                      Assessment Location
                    </Heading>
                  </HStack>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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

                    <FormControl isInvalid={!!errors.area}>
                      <FormLabel>Area/District *</FormLabel>
                      <Input {...register('area')} placeholder="Enter your area or district" />
                      <FormErrorMessage>{errors.area?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.landmark}>
                      <FormLabel>Landmark</FormLabel>
                      <Input {...register('landmark')} placeholder="Nearby landmark (optional)" />
                      <FormErrorMessage>{errors.landmark?.message}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>

                  <FormControl isInvalid={!!errors.street}>
                    <FormLabel>Street Address *</FormLabel>
                    <Textarea 
                      {...register('street')} 
                      placeholder="Enter your detailed street address for the home assessment"
                      rows={3}
                    />
                    <FormErrorMessage>{errors.street?.message}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Emergency Contact */}
            <Card 
              w="full"
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(251, 146, 60, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(251, 146, 60, 0.08)"
            >
              <CardBody p={8}>
                <VStack spacing={8} align="stretch">
                  <HStack spacing={4}>
                    <Box
                      w="40px"
                      h="40px"
                      bgGradient="linear(45deg, orange.500, yellow.500)"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="0 4px 15px rgba(251, 146, 60, 0.3)"
                    >
                      <Icon as={FaPhone} color="white" fontSize="lg" />
                    </Box>
                    <Heading 
                      size="md"
                      bgGradient="linear(45deg, orange.600, yellow.600)"
                      bgClip="text"
                      sx={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                      fontWeight="700"
                    >
                      Emergency Contact
                    </Heading>
                  </HStack>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl isInvalid={!!errors.emergencyContactName}>
                      <FormLabel>Contact Name *</FormLabel>
                      <Input {...register('emergencyContactName')} placeholder="Full name" />
                      <FormErrorMessage>{errors.emergencyContactName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.emergencyContactPhone}>
                      <FormLabel>Contact Phone *</FormLabel>
                      <Input 
                        {...register('emergencyContactPhone')} 
                        placeholder="+2348012345678" 
                        type="tel"
                      />
                      <FormErrorMessage>{errors.emergencyContactPhone?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.emergencyContactRelationship}>
                      <FormLabel>Relationship *</FormLabel>
                      <Select {...register('emergencyContactRelationship')} placeholder="Select relationship">
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="child">Child</option>
                        <option value="sibling">Sibling</option>
                        <option value="friend">Friend</option>
                        <option value="colleague">Colleague</option>
                        <option value="other">Other</option>
                      </Select>
                      <FormErrorMessage>{errors.emergencyContactRelationship?.message}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {/* Medical Information for Assessment */}
            <Card 
              w="full"
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(220, 38, 127, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(220, 38, 127, 0.08)"
            >
              <CardBody p={8}>
                <VStack spacing={8} align="stretch">
                  <HStack spacing={4}>
                    <Box
                      w="40px"
                      h="40px"
                      bgGradient="linear(45deg, red.500, pink.500)"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="0 4px 15px rgba(220, 38, 127, 0.3)"
                    >
                      <Icon as={FaStethoscope} color="white" fontSize="lg" />
                    </Box>
                    <Heading 
                      size="md"
                      bgGradient="linear(45deg, red.600, pink.600)"
                      bgClip="text"
                      sx={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                      fontWeight="700"
                    >
                      Medical Information for Assessment
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    This information helps our healthcare professionals provide a more accurate assessment
                  </Text>

                  <SimpleGrid columns={{ base: 1 }} spacing={4}>
                    <FormControl>
                      <FormLabel>Current Medical Conditions</FormLabel>
                      <Textarea 
                        {...register('currentMedicalConditions')} 
                        placeholder="List any current medical conditions, chronic illnesses, or health concerns"
                        rows={3}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Current Medications</FormLabel>
                      <Textarea 
                        {...register('currentMedications')} 
                        placeholder="List all medications, supplements, and vitamins currently being taken"
                        rows={2}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Known Allergies</FormLabel>
                      <Textarea 
                        {...register('knownAllergies')} 
                        placeholder="List any known allergies (medications, foods, environmental, etc.)"
                        rows={2}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Health Concerns for Assessment</FormLabel>
                      <Textarea 
                        {...register('healthconcerns')} 
                        placeholder="Describe specific health concerns or symptoms you'd like assessed"
                        rows={3}
                      />
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {/* Assessment Preferences */}
            <Card 
              w="full"
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(59, 130, 246, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(59, 130, 246, 0.08)"
            >
              <CardBody p={8}>
                <VStack spacing={8} align="stretch">
                  <HStack spacing={4}>
                    <Box
                      w="40px"
                      h="40px"
                      bgGradient="linear(45deg, blue.500, cyan.500)"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="0 4px 15px rgba(59, 130, 246, 0.3)"
                    >
                      <Icon as={FaClock} color="white" fontSize="lg" />
                    </Box>
                    <Heading 
                      size="md"
                      bgGradient="linear(45deg, blue.600, cyan.600)"
                      bgClip="text"
                      sx={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                      fontWeight="700"
                    >
                      Assessment Preferences
                    </Heading>
                  </HStack>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={!!errors.nurseGenderPreference}>
                      <FormLabel>Healthcare Professional Gender Preference</FormLabel>
                      <Select {...register('nurseGenderPreference')}>
                        <option value="no-preference">No Preference</option>
                        <option value="female">Female Professional</option>
                        <option value="male">Male Professional</option>
                      </Select>
                      <FormErrorMessage>{errors.nurseGenderPreference?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.paymentMethod}>
                      <FormLabel>Payment Method *</FormLabel>
                      <Select {...register('paymentMethod')}>
                        <option value="card">Card Payment (Flutterwave)</option>
                        <option value="bank-transfer">Bank Transfer</option>
                        <option value="ussd">USSD Banking</option>
                        <option value="cash">Cash Payment (Pay after assessment)</option>
                      </Select>
                      <FormErrorMessage>{errors.paymentMethod?.message}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>

                  <FormControl>
                    <FormLabel>Special Requirements</FormLabel>
                    <Textarea 
                      {...register('specialRequirements')} 
                      placeholder="Any special requirements, accessibility needs, or instructions for the healthcare professional"
                      rows={3}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Assessment Fee Summary */}
            <Card 
              w="full" 
              bg="rgba(34, 197, 94, 0.05)" 
              border="2px" 
              borderColor="rgba(34, 197, 94, 0.3)"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(34, 197, 94, 0.1)"
            >
              <CardBody p={8}>
                <HStack justify="space-between" align="center">
                  <HStack spacing={4}>
                    <Box
                      w="50px"
                      h="50px"
                      bgGradient="linear(45deg, green.500, emerald.500)"
                      borderRadius="xl"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="0 4px 15px rgba(34, 197, 94, 0.3)"
                    >
                      <Icon as={FaStethoscope} color="white" fontSize="xl" />
                    </Box>
                    <VStack align="start" spacing={1}>
                      <Text 
                        fontWeight="bold" 
                        color="gray.800"
                        fontSize="lg"
                      >
                        Assessment Fee
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {service.name} - {service.duration} minute assessment
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Fixed price for all healthcare assessments
                      </Text>
                    </VStack>
                  </HStack>
                  <Badge
                    bgGradient="linear(45deg, green.500, emerald.500)"
                    color="white"
                    fontSize="2xl" 
                    fontWeight="bold"
                    px={6}
                    py={3}
                    borderRadius="full"
                  >
                    {formatPrice(ASSESSMENT_PRICE)}
                  </Badge>
                </HStack>
              </CardBody>
            </Card>

            {/* Submit Buttons */}
            <HStack spacing={4} w="full" justify="space-between">
              <Button
                variant="outline"
                onClick={onBack}
                size="lg"
                px={8}
                py={6}
                borderColor="rgba(194, 24, 91, 0.3)"
                color="brand.600"
                borderRadius="xl"
                _hover={{
                  borderColor: "brand.400",
                  bg: "rgba(194, 24, 91, 0.05)",
                  transform: "translateY(-1px)"
                }}
                transition="all 0.2s ease-in-out"
              >
                Back to Assessments
              </Button>

              <Button
                type="submit"
                bgGradient="linear(45deg, brand.500, purple.500)"
                color="white"
                size="lg"
                px={8}
                py={8}
                borderRadius="2xl"
                fontSize="lg"
                fontWeight="700"
                boxShadow="0 8px 25px rgba(194, 24, 91, 0.25)"
                isLoading={isSubmitting}
                loadingText="Booking Assessment..."
                _hover={{
                  bgGradient: "linear(45deg, brand.600, purple.600)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 35px rgba(194, 24, 91, 0.35)"
                }}
                _active={{
                  transform: "translateY(0)",
                  boxShadow: "0 6px 20px rgba(194, 24, 91, 0.3)"
                }}
                _loading={{
                  bgGradient: "linear(45deg, brand.400, purple.400)",
                  _hover: { bgGradient: "linear(45deg, brand.400, purple.400)" }
                }}
                transition="all 0.2s ease-in-out"
              >
                Book Assessment - {formatPrice(ASSESSMENT_PRICE)}
              </Button>
            </HStack>

            {/* Terms Notice */}
            <Box textAlign="center" pt={4}>
              <Text fontSize="xs" color="gray.500">
                By booking this assessment, you agree to our{' '}
                <Text as="span" color="primary.500" textDecoration="underline" cursor="pointer">
                  Terms of Service
                </Text>
                {' '}and{' '}
                <Text as="span" color="primary.500" textDecoration="underline" cursor="pointer">
                  Privacy Policy
                </Text>. Assessment fee is {formatPrice(ASSESSMENT_PRICE)} for all services.
              </Text>
            </Box>
          </VStack>
        </form>
      </VStack>
    </Container>
  )
}

export default BookingForm