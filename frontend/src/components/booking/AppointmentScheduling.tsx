// src/components/booking/AppointmentScheduling.tsx
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Button,
  Icon,
  Badge,
  Flex,
  useColorModeValue,
  Select,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaStethoscope,
  FaClipboardList,
  FaUserMd,
} from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { BookingService } from '../../types/booking.types'
import { ASSESSMENT_PRICE } from '../../constants/assessments'

interface SchedulingProps {
  selectedService: BookingService
  onScheduleSelect: (scheduleData: ScheduleData) => void
  selectedSchedule?: ScheduleData
}

export interface ScheduleData {
  date: string
  timeSlot: TimeSlot
  address: Address
  specialRequirements?: string
}

interface TimeSlot {
  id: string
  time: string
  duration: number
  available: boolean
  price: number // Always ASSESSMENT_PRICE (5000)
  isEmergency?: boolean
}

interface Address {
  street: string
  city: string
  state: string
  landmark?: string
  phoneNumber: string
}

const AppointmentScheduling: React.FC<SchedulingProps> = ({
  selectedService,
  onScheduleSelect,
  selectedSchedule,
}) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // State management
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: 'lagos', // Default to Lagos
    phoneNumber: '',
  })
  const [specialRequirements, setSpecialRequirements] = useState('')

  // Generate next 14 days for date selection
  const generateAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Skip if it's too late today (after 6 PM) unless emergency assessment
      if (i === 0 && today.getHours() >= 18 && selectedService.category !== 'emergency') continue
      
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-NG', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        isToday: i === 0,
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      })
    }
    return dates
  }

  // Generate assessment time slots based on service type - FIXED VERSION
  const generateAssessmentTimeSlots = (date: string): TimeSlot[] => {
    let baseSlots = []

    if (selectedService.category === 'emergency') {
      // Emergency assessments available 24/7 - generate all slots without duplicates
      for (let i = 0; i < 24; i += 2) {
        const hour = i.toString().padStart(2, '0')
        const label = i === 0 ? '12:00 AM' : 
                     i < 12 ? `${i}:00 AM` :
                     i === 12 ? '12:00 PM' :
                     `${i - 12}:00 PM`
        baseSlots.push({
          time: `${hour}:00`,
          label: label
        })
      }
    } else {
      // Regular assessment slots for non-emergency services
      baseSlots = [
        { time: '08:00', label: '8:00 AM' },
        { time: '09:30', label: '9:30 AM' },
        { time: '11:00', label: '11:00 AM' },
        { time: '12:30', label: '12:30 PM' },
        { time: '14:00', label: '2:00 PM' },
        { time: '15:30', label: '3:30 PM' },
        { time: '17:00', label: '5:00 PM' },
      ]
    }

    // Convert to TimeSlot objects with unique IDs
    return baseSlots.map((slot, index) => ({
      id: `${date}-${slot.time}-${index}`, // Added index to ensure uniqueness
      time: slot.label,
      duration: selectedService.duration,
      available: Math.random() > 0.2, // 80% availability for assessments
      price: ASSESSMENT_PRICE, // Fixed ₦5,000 for all assessments
      isEmergency: selectedService.category === 'emergency' && (parseInt(slot.time.split(':')[0]) < 8 || parseInt(slot.time.split(':')[0]) > 18)
    }))
  }

  // Nigerian states
  const nigerianStates = [
    { value: 'lagos', label: 'Lagos' },
    { value: 'abuja', label: 'Abuja (FCT)' },
    { value: 'kano', label: 'Kano' },
    { value: 'rivers', label: 'Rivers' },
    { value: 'oyo', label: 'Oyo' },
    { value: 'kaduna', label: 'Kaduna' },
    { value: 'ogun', label: 'Ogun' },
    { value: 'ondo', label: 'Ondo' },
    { value: 'osun', label: 'Osun' },
    { value: 'delta', label: 'Delta' },
    { value: 'anambra', label: 'Anambra' },
    { value: 'imo', label: 'Imo' },
    { value: 'enugu', label: 'Enugu' },
    { value: 'edo', label: 'Edo' },
    { value: 'plateau', label: 'Plateau' },
    { value: 'cross-river', label: 'Cross River' },
    { value: 'akwa-ibom', label: 'Akwa Ibom' }
  ]

  const availableDates = generateAvailableDates()
  const timeSlots = selectedDate ? generateAssessmentTimeSlots(selectedDate) : []

  // Update schedule when all required fields are filled
  useEffect(() => {
    if (selectedDate && selectedTimeSlot && address.street && address.phoneNumber) {
      const scheduleData: ScheduleData = {
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        address,
        specialRequirements: specialRequirements || undefined
      }
      onScheduleSelect(scheduleData)
    }
  }, [selectedDate, selectedTimeSlot, address.street, address.city, address.state, address.phoneNumber, address.landmark, specialRequirements])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

  const isFormComplete = selectedDate && selectedTimeSlot && address.street && address.phoneNumber

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box
          position="relative"
          bg="rgba(255, 255, 255, 0.9)"
          backdropFilter="blur(15px)"
          borderRadius="3xl"
          p={8}
          border="1px solid"
          borderColor="rgba(194, 24, 91, 0.2)"
          boxShadow="0 8px 32px rgba(194, 24, 91, 0.15)"
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
                }}
                fontWeight="800"
              >
                Schedule Your {selectedService.name}
              </Heading>
              <Text 
                color="gray.700" 
                fontSize="lg"
                fontWeight="500"
                maxW="600px"
                lineHeight="1.6"
              >
                Book a professional healthcare assessment in the comfort of your home with our qualified healthcare professionals
              </Text>
            </VStack>
          
          {/* Assessment Service Summary */}
          <Box 
            bg="rgba(194, 24, 91, 0.05)" 
            borderRadius="2xl" 
            p={6} 
            w="full" 
            maxW="700px"
            border="2px solid"
            borderColor="rgba(194, 24, 91, 0.1)"
            boxShadow="0 4px 20px rgba(194, 24, 91, 0.08)"
          >
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
              <VStack align="start" spacing={3} flex="1">
                <Text 
                  fontWeight="700" 
                  color="gray.800"
                  fontSize="lg"
                >
                  {selectedService.name}
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
                    {selectedService.duration} minutes
                  </Badge>
                  <Badge 
                    bg="green.500"
                    color="white"
                    fontSize="md" 
                    px={4} 
                    py={1}
                    borderRadius="full"
                    fontWeight="600"
                  >
                    {formatPrice(ASSESSMENT_PRICE)}
                  </Badge>
                  {selectedService.category === 'emergency' && (
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
                <Text fontSize="sm" color="gray.600" lineHeight="1.5">
                  Professional health assessment • A qualified healthcare professional will be assigned based on your location
                </Text>
              </VStack>
            </HStack>
          </Box>
          </VStack>
        </Box>

        {/* Professional Assignment Notice */}
        <Card 
          bg="rgba(123, 31, 162, 0.05)" 
          borderColor="rgba(123, 31, 162, 0.2)" 
          borderWidth="2px"
          borderRadius="2xl"
          boxShadow="0 4px 20px rgba(123, 31, 162, 0.08)"
        >
          <CardBody p={6}>
            <HStack spacing={4} align="start">
              <Box
                w="50px"
                h="50px"
                bgGradient="linear(45deg, purple.500, brand.500)"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 4px 15px rgba(123, 31, 162, 0.3)"
              >
                <Icon as={FaUserMd} color="white" fontSize="xl" />
              </Box>
              <VStack align="start" spacing={2} flex="1">
                <Text 
                  fontWeight="700" 
                  color="gray.800" 
                  fontSize="md"
                >
                  Qualified Healthcare Professional Assignment
                </Text>
                <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                  A qualified healthcare professional will be automatically assigned to your assessment 
                  based on your location, assessment type, and availability. All our professionals are 
                  licensed, experienced, and specialized in health assessments.
                </Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Step 1: Select Date */}
        <Card 
          bg="rgba(255, 255, 255, 0.9)"
          borderColor="rgba(194, 24, 91, 0.2)"
          borderWidth="2px"
          borderRadius="2xl"
          boxShadow="0 4px 20px rgba(194, 24, 91, 0.08)"
          backdropFilter="blur(10px)"
        >
          <CardBody p={8}>
            <VStack spacing={6} align="start">
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
                  <Icon as={FaCalendarAlt} color="white" fontSize="lg" />
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
                  1. Select Assessment Date
                </Heading>
              </HStack>
              
              <SimpleGrid columns={{ base: 2, md: 4, lg: 7 }} spacing={3} w="full">
                {availableDates.map((date) => (
                  <Button
                    key={date.value}
                    variant={selectedDate === date.value ? 'solid' : 'outline'}
                    bg={selectedDate === date.value ? 'linear-gradient(45deg, #c2185b, #7b1fa2)' : 'transparent'}
                    color={selectedDate === date.value ? 'white' : 'gray.700'}
                    borderColor={selectedDate === date.value ? 'transparent' : 'rgba(194, 24, 91, 0.3)'}
                    borderWidth="2px"
                    size="md"
                    onClick={() => setSelectedDate(date.value)}
                    flexDirection="column"
                    h="auto"
                    py={4}
                    px={3}
                    borderRadius="xl"
                    isDisabled={date.isWeekend && selectedService.category !== 'emergency'}
                    _hover={{
                      borderColor: 'brand.400',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(194, 24, 91, 0.25)',
                    }}
                    _disabled={{
                      opacity: 0.5,
                      cursor: 'not-allowed',
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    <Text fontSize="xs" opacity={date.isToday ? 1 : 0.7}>
                      {date.isToday ? 'Today' : date.label.split(' ')[0]}
                    </Text>
                    <Text fontWeight="bold">
                      {date.label.split(' ').slice(1).join(' ')}
                    </Text>
                    {date.isWeekend && selectedService.category !== 'emergency' && (
                      <Text fontSize="xs" color="red.500">Weekend</Text>
                    )}
                  </Button>
                ))}
              </SimpleGrid>
              
              {selectedService.category !== 'emergency' && (
                <Text fontSize="xs" color="gray.500">
                  * Weekend assessments available for emergency services only
                </Text>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Step 2: Select Time */}
        {selectedDate && (
          <Card 
            bg="rgba(255, 255, 255, 0.9)"
            borderColor="rgba(123, 31, 162, 0.2)"
            borderWidth="2px"
            borderRadius="2xl"
            boxShadow="0 4px 20px rgba(123, 31, 162, 0.08)"
            backdropFilter="blur(10px)"
          >
            <CardBody p={8}>
              <VStack spacing={6} align="start">
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
                    <Icon as={FaClock} color="white" fontSize="lg" />
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
                    2. Select Assessment Time
                  </Heading>
                </HStack>
                
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={3} w="full">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedTimeSlot?.id === slot.id ? 'solid' : 'outline'}
                      bg={selectedTimeSlot?.id === slot.id ? 'linear-gradient(45deg, #7b1fa2, #c2185b)' : 'transparent'}
                      color={selectedTimeSlot?.id === slot.id ? 'white' : 'gray.700'}
                      borderColor={selectedTimeSlot?.id === slot.id ? 'transparent' : 'rgba(123, 31, 162, 0.3)'}
                      borderWidth="2px"
                      size="md"
                      onClick={() => setSelectedTimeSlot(slot)}
                      isDisabled={!slot.available}
                      flexDirection="column"
                      h="auto"
                      py={4}
                      px={3}
                      borderRadius="xl"
                      _hover={{
                        borderColor: 'purple.400',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(123, 31, 162, 0.25)',
                      }}
                      _disabled={{
                        opacity: 0.5,
                        cursor: 'not-allowed',
                      }}
                      transition="all 0.2s ease-in-out"
                    >
                      <Text fontWeight="bold">{slot.time}</Text>
                      <Text fontSize="xs">
                        {slot.available ? 'Available' : 'Unavailable'}
                      </Text>
                      {slot.isEmergency && (
                        <Badge colorScheme="red" fontSize="xs">Emergency Hours</Badge>
                      )}
                    </Button>
                  ))}
                </SimpleGrid>
                
                {timeSlots.length === 0 && (
                  <Alert status="info">
                    <AlertIcon />
                    <AlertTitle>No assessment slots available!</AlertTitle>
                    <AlertDescription>Please select a different date.</AlertDescription>
                  </Alert>
                )}

                {selectedService.category === 'emergency' && (
                  <Alert status="info">
                    <AlertIcon />
                    <AlertTitle>Emergency Assessment Available 24/7</AlertTitle>
                    <AlertDescription>
                      Emergency health assessments can be scheduled at any time for urgent, non-life-threatening situations.
                    </AlertDescription>
                  </Alert>
                )}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Step 3: Assessment Location Details */}
        {selectedDate && selectedTimeSlot && (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody p={6}>
              <VStack spacing={4} align="start">
                <HStack spacing={2}>
                  <Icon as={FaMapMarkerAlt} color="primary.500" />
                  <Heading size="md">3. Assessment Location</Heading>
                </HStack>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Street Address</FormLabel>
                    <Input
                      value={address.street}
                      onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
                      placeholder="Enter your detailed street address"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Phone Number</FormLabel>
                    <Input
                      value={address.phoneNumber}
                      onChange={(e) => setAddress(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="+234 801 234 5678"
                      type="tel"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">State</FormLabel>
                    <Select
                      value={address.state}
                      onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                    >
                      {nigerianStates.map(state => (
                        <option key={state.value} value={state.value}>{state.label}</option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel fontSize="sm">City/LGA</FormLabel>
                    <Input
                      value={address.city}
                      onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter city or local government area"
                    />
                  </FormControl>
                  
                  <FormControl gridColumn={{ md: 'span 2' }}>
                    <FormLabel fontSize="sm">Landmark (Optional)</FormLabel>
                    <Input
                      value={address.landmark}
                      onChange={(e) => setAddress(prev => ({ ...prev, landmark: e.target.value }))}
                      placeholder="Nearest landmark for easy location"
                    />
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Step 4: Special Requirements for Assessment */}
        {selectedDate && selectedTimeSlot && address.street && address.phoneNumber && (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody p={6}>
              <VStack spacing={4} align="start">
                <HStack spacing={2}>
                  <Icon as={FaInfoCircle} color="primary.500" />
                  <Heading size="md">4. Special Requirements (Optional)</Heading>
                </HStack>
                
                <FormControl w="full">
                  <FormLabel fontSize="sm">
                    Any specific requirements for your health assessment?
                  </FormLabel>
                  <Textarea
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    placeholder="e.g., Patient has mobility issues, needs wheelchair access, specific health concerns to focus on, preferred language, etc."
                    rows={4}
                  />
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    This helps our healthcare professional prepare for your assessment and provide better care.
                  </Text>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Assessment Summary */}
        {isFormComplete && (
          <Alert status="success">
            <AlertIcon />
            <Box>
              <AlertTitle>Assessment Appointment Ready!</AlertTitle>
              <AlertDescription>
                <VStack spacing={1} align="start" mt={2}>
                  <Text fontSize="sm">
                    <strong>Assessment:</strong> {selectedService.name}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Date & Time:</strong> {new Date(selectedDate).toLocaleDateString('en-NG', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {selectedTimeSlot.time}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Duration:</strong> {selectedService.duration} minutes
                  </Text>
                  <Text fontSize="sm">
                    <strong>Location:</strong> {address.street}, {address.city}, {nigerianStates.find(s => s.value === address.state)?.label}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Healthcare Professional:</strong> Will be assigned based on your location and assessment type
                  </Text>
                  <Text fontSize="sm" color="green.600" fontWeight="600">
                    <strong>Assessment Fee:</strong> {formatPrice(ASSESSMENT_PRICE)}
                  </Text>
                </VStack>
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Assessment Information Panel */}
        <Card bg="blue.50" borderColor="blue.200" borderWidth="1px">
          <CardBody p={6}>
            <VStack spacing={4} align="start">
              <HStack spacing={2}>
                <Icon as={FaClipboardList} color="blue.500" />
                <Heading size="md" color="blue.700">What to Expect During Your Assessment</Heading>
              </HStack>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" fontWeight="600" color="blue.700">Assessment Includes:</Text>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="blue.600">• Comprehensive health evaluation</Text>
                    <Text fontSize="sm" color="blue.600">• Vital signs monitoring</Text>
                    <Text fontSize="sm" color="blue.600">• Medical history review</Text>
                    <Text fontSize="sm" color="blue.600">• Health screening and examination</Text>
                    <Text fontSize="sm" color="blue.600">• Written assessment report</Text>
                    <Text fontSize="sm" color="blue.600">• Personalized health recommendations</Text>
                  </VStack>
                </VStack>
                
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" fontWeight="600" color="blue.700">Please Prepare:</Text>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="blue.600">• List of current medications</Text>
                    <Text fontSize="sm" color="blue.600">• Previous medical records (if available)</Text>
                    <Text fontSize="sm" color="blue.600">• Insurance information or ID</Text>
                    <Text fontSize="sm" color="blue.600">• Comfortable, loose clothing</Text>
                    <Text fontSize="sm" color="blue.600">• Specific health concerns or questions</Text>
                    <Text fontSize="sm" color="blue.600">• Quiet, well-lit space for assessment</Text>
                  </VStack>
                </VStack>
              </SimpleGrid>
              
              <Alert status="info" size="sm">
                <AlertIcon />
                <Text fontSize="sm">
                  <strong>Professional Assignment:</strong> Our qualified healthcare professionals are licensed, 
                  experienced, and specialized in health assessments. You'll receive professional details 
                  24 hours before your appointment.
                </Text>
              </Alert>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  )
}

export default AppointmentScheduling