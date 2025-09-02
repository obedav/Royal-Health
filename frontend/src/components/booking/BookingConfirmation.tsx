// src/components/booking/BookingConfirmation.tsx
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  Button,
  Icon,
  Badge,
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react'
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaClock,
  FaUserNurse,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaSms,
  FaWhatsapp,
  FaPrint,
  FaDownload,
  FaHome,
  FaReceipt,
  FaStethoscope,
  FaClipboardList,
  FaCalendarPlus,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { BookingService } from '../../types/booking.types'
import { ScheduleData } from './AppointmentScheduling'
import { PatientInformation } from './PatientInformationForm'
import { PaymentResult } from './PaymentIntegration'
import { ASSESSMENT_PRICE } from '../../constants/assessments'

interface BookingConfirmationProps {
  selectedService: BookingService
  selectedSchedule: ScheduleData
  patientInfo: PatientInformation
  paymentResult: PaymentResult
}

export interface AssessmentBookingDetails {
  bookingId: string
  confirmationCode: string
  status: 'confirmed' | 'pending' | 'cancelled'
  createdAt: string
  estimatedArrival: string
  assessmentInstructions: string[]
  emergencyContact: string
  cancellationPolicy: string
  assessmentDuration: number
  followUpInfo: string
  assignedProfessional: {
    name: string
    rating: number
    experience: number
    specialization: string
  }
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  selectedService,
  selectedSchedule,
  patientInfo,
  paymentResult,
}) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const navigate = useNavigate()

  // Generate mock healthcare professional data since it's not in ScheduleData
  const generateMockProfessional = () => {
    const professionals = [
      { name: 'Dr. Adaora Okonkwo', rating: 4.9, experience: 8, specialization: 'General Health Assessment' },
      { name: 'Nurse Joy Abiola', rating: 4.8, experience: 6, specialization: 'Preventive Care' },
      { name: 'Dr. Emeka Nwosu', rating: 4.9, experience: 12, specialization: 'Chronic Care Management' },
      { name: 'Nurse Sarah Ibrahim', rating: 4.7, experience: 5, specialization: 'Home Healthcare' },
      { name: 'Dr. Folake Adebayo', rating: 4.8, experience: 10, specialization: 'Family Medicine' },
    ]
    
    // Use a deterministic selection based on date and service to ensure consistency
    const index = (new Date(selectedSchedule.date).getDay() + selectedService.name.length) % professionals.length
    return professionals[index]
  }

  const mockProfessional = generateMockProfessional()

  // Generate assessment booking details
  const assessmentDetails: AssessmentBookingDetails = {
    bookingId: `RHC-${Date.now().toString().slice(-6)}`,
    confirmationCode: `ASS${mockProfessional.name.split(' ')[1].slice(0, 3).toUpperCase()}${Date.now().toString().slice(-4)}`,
    status: paymentResult.method === 'cash' ? 'pending' : 'confirmed',
    createdAt: new Date().toISOString(),
    estimatedArrival: calculateEstimatedArrival(),
    assessmentInstructions: generateAssessmentPreparationInstructions(),
    emergencyContact: '+234 901 234 5678',
    cancellationPolicy: 'Free cancellation up to 4 hours before assessment appointment',
    assessmentDuration: selectedService.duration,
    followUpInfo: 'Assessment report will be provided within 24 hours after completion',
    assignedProfessional: mockProfessional
  }

  function calculateEstimatedArrival(): string {
    // Parse the time from the time slot (e.g., "8:00 AM" -> Date object)
    const timeString = selectedSchedule.timeSlot.time
    const appointmentDate = new Date(selectedSchedule.date)
    
    // Simple time parsing - you might want to use a more robust solution
    const timeParts = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (timeParts) {
      let hours = parseInt(timeParts[1])
      const minutes = parseInt(timeParts[2])
      const period = timeParts[3].toUpperCase()
      
      if (period === 'PM' && hours !== 12) hours += 12
      if (period === 'AM' && hours === 12) hours = 0
      
      appointmentDate.setHours(hours, minutes, 0, 0)
    }
    
    const arrivalTime = new Date(appointmentDate.getTime() - 15 * 60000) // 15 minutes before
    return arrivalTime.toLocaleTimeString('en-NG', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  function generateAssessmentPreparationInstructions(): string[] {
    const baseInstructions = [
      'Ensure patient is available and well-rested for the assessment',
      'Have a quiet, comfortable space prepared for the evaluation',
      'Prepare good lighting for medical examination',
      'Have all medical documents and records easily accessible'
    ]

    const serviceSpecificInstructions: Record<string, string[]> = {
      'general-health-assessment': [
        'Have current medications list ready',
        'Wear comfortable, loose-fitting clothing',
        'Prepare any previous medical test results',
        'List any health concerns or symptoms to discuss'
      ],
      'elderly-care-assessment': [
        'Have complete medical history documents available',
        'Prepare comfortable seating with back support',
        'Ensure wheelchair accessibility if needed',
        'Have family member present for support if desired'
      ],
      'chronic-condition-assessment': [
        'Have recent blood work and test results ready',
        'Prepare detailed symptom diary or health tracking records',
        'List all current medications with dosages',
        'Note any recent changes in health status'
      ],
      'post-surgery-assessment': [
        'Have surgery discharge notes and instructions ready',
        'Prepare the surgical site for examination (clean, accessible)',
        'List any concerns about healing or recovery',
        'Have pain medication information available'
      ],
      'mental-health-screening': [
        'Ensure a private, quiet environment for discussion',
        'Prepare to discuss current stress levels and concerns',
        'Have list of any mood-related medications ready',
        'Consider having a trusted person nearby for support'
      ],
      'maternal-health-assessment': [
        'Have pregnancy records and antenatal care card ready',
        'Wear comfortable, easily adjustable clothing',
        'Prepare any ultrasound results or medical records',
        'Have prenatal vitamin information available'
      ],
      'pediatric-assessment': [
        'Have child\'s vaccination records and growth chart ready',
        'Prepare favorite toys or comfort items for the child',
        'Ensure child is well-fed and comfortable before assessment',
        'Have both parents present if possible'
      ],
      'emergency-assessment': [
        'Stay calm and follow healthcare professional instructions',
        'Have emergency contacts readily available',
        'Prepare clear description of symptoms and timeline',
        'Keep emergency medications easily accessible'
      ],
      'routine-checkup': [
        'Fast for 8-12 hours if blood work might be needed',
        'Prepare list of any health concerns or questions',
        'Have insurance information and ID ready',
        'Bring any vitamins or supplements currently taking'
      ]
    }

    return [
      ...baseInstructions,
      ...(serviceSpecificInstructions[selectedService.id] || [])
    ]
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  const handleDownloadReceipt = () => {
    // Generate assessment receipt for download
    const receiptData = {
      bookingId: assessmentDetails.bookingId,
      assessmentType: selectedService.name,
      date: selectedSchedule.date,
      time: selectedSchedule.timeSlot.time,
      assessmentFee: ASSESSMENT_PRICE,
      patient: `${patientInfo.firstName} ${patientInfo.lastName}`,
      healthcareProfessional: assessmentDetails.assignedProfessional.name
    }
    
    const receiptText = `
ROYAL HEALTH CONSULT - ASSESSMENT RECEIPT
=========================================
Booking ID: ${assessmentDetails.bookingId}
Confirmation Code: ${assessmentDetails.confirmationCode}

ASSESSMENT DETAILS:
Assessment Type: ${selectedService.name}
Date: ${new Date(selectedSchedule.date).toLocaleDateString('en-NG')}
Time: ${selectedSchedule.timeSlot.time}
Duration: ${selectedService.duration} minutes
Patient: ${patientInfo.firstName} ${patientInfo.lastName}
Healthcare Professional: ${assessmentDetails.assignedProfessional.name}

PAYMENT INFORMATION:
Assessment Fee: ${formatPrice(ASSESSMENT_PRICE)}
Payment Method: ${paymentResult.method.toUpperCase()}
Transaction ID: ${paymentResult.transactionId}
Payment Status: ${paymentResult.status.toUpperCase()}

LOCATION:
Address: ${selectedSchedule.address.street}, ${selectedSchedule.address.state}
Contact: ${patientInfo.phone}

IMPORTANT NOTES:
- ${assessmentDetails.cancellationPolicy}
- Assessment report provided within 24 hours
- Follow-up recommendations will be included
- Emergency contact: ${assessmentDetails.emergencyContact}

Thank you for choosing Royal Health Consult!
For support: +234 901 234 5678
Email: support@royalhealthconsult.ng
    `.trim()

    const blob = new Blob([receiptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `RHC-Assessment-Receipt-${assessmentDetails.bookingId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleGoHome = () => {
    navigate('/')
  }

  const handleViewDashboard = () => {
    navigate('/dashboard')
  }

  const handleBookAnother = () => {
    navigate('/booking')
  }

  const handleAddToCalendar = () => {
    // Create calendar event details
    const appointmentDate = new Date(selectedSchedule.date)
    const timeParts = selectedSchedule.timeSlot.time.match(/(\d+):(\d+)\s*(AM|PM)/i)
    
    if (timeParts) {
      let hours = parseInt(timeParts[1])
      const minutes = parseInt(timeParts[2])
      const period = timeParts[3].toUpperCase()
      
      if (period === 'PM' && hours !== 12) hours += 12
      if (period === 'AM' && hours === 12) hours = 0
      
      appointmentDate.setHours(hours, minutes, 0, 0)
    }
    
    const endDate = new Date(appointmentDate.getTime() + selectedService.duration * 60000)
    
    // Create calendar URL
    const eventDetails = {
      title: `Health Assessment - ${selectedService.name}`,
      start: appointmentDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''),
      end: endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''),
      description: `Health Assessment with ${assessmentDetails.assignedProfessional.name}\\n\\nService: ${selectedService.name}\\nConfirmation Code: ${assessmentDetails.confirmationCode}\\nLocation: ${selectedSchedule.address.street}, ${selectedSchedule.address.city}\\n\\nContact: ${assessmentDetails.emergencyContact}`,
      location: `${selectedSchedule.address.street}, ${selectedSchedule.address.city}, ${selectedSchedule.address.state}`
    }
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`
    
    window.open(googleCalendarUrl, '_blank')
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Success Header */}
        <Box
          position="relative"
          bg="rgba(255, 255, 255, 0.9)"
          backdropFilter="blur(20px)"
          borderRadius="3xl"
          p={10}
          border="1px solid"
          borderColor="rgba(34, 197, 94, 0.2)"
          boxShadow="0 8px 32px rgba(34, 197, 94, 0.15)"
          _before={{
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "3xl",
            padding: "1px",
            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(16, 185, 129, 0.3))",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
          }}
        >
          <VStack spacing={8} textAlign="center">
            <Box
              w={24}
              h={24}
              bgGradient="linear(45deg, green.500, emerald.500)"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 8px 25px rgba(34, 197, 94, 0.4)"
              position="relative"
              _before={{
                content: '""',
                position: "absolute",
                w: 28,
                h: 28,
                bgGradient: "linear(45deg, green.300, emerald.300)",
                borderRadius: "full",
                opacity: 0.3,
                zIndex: -1,
              }}
            >
              <Icon as={FaCheckCircle} color="white" fontSize="4xl" />
            </Box>
            
            <VStack spacing={4}>
              <Heading 
                size="2xl" 
                bgGradient="linear(45deg, green.600, emerald.600)"
                bgClip="text"
                sx={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 4px rgba(34, 197, 94, 0.2))",
                }}
                fontWeight="900"
              >
                {paymentResult.method === 'cash' ? 'Health Assessment Scheduled!' : 'Health Assessment Confirmed!'}
              </Heading>
              <Text 
                color="gray.700" 
                fontSize="lg"
                fontWeight="500"
                maxW="600px"
                lineHeight="1.6"
              >
                {paymentResult.method === 'cash' 
                  ? 'Your health assessment is scheduled with our qualified healthcare professionals. Payment will be collected after the assessment.'
                  : 'Your payment has been processed successfully and your assessment appointment is confirmed with our qualified healthcare professionals.'
                }
              </Text>
            </VStack>

            {/* Enhanced Confirmation Code */}
            <Card 
              bg="rgba(34, 197, 94, 0.08)" 
              borderColor="rgba(34, 197, 94, 0.3)" 
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(34, 197, 94, 0.1)"
            >
              <CardBody p={8} textAlign="center">
                <VStack spacing={4}>
                  <HStack spacing={3}>
                    <Box
                      w="30px"
                      h="30px"
                      bgGradient="linear(45deg, green.500, emerald.500)"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={FaReceipt} color="white" fontSize="sm" />
                    </Box>
                    <Text 
                      fontSize="sm" 
                      bgGradient="linear(45deg, green.600, emerald.600)"
                      bgClip="text"
                      sx={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                      fontWeight="700"
                    >
                      ASSESSMENT CONFIRMATION CODE
                    </Text>
                  </HStack>
                  <Badge
                    bgGradient="linear(45deg, green.500, emerald.500)"
                    color="white"
                    fontSize="2xl" 
                    fontWeight="bold"
                    letterSpacing="wider"
                    px={6}
                    py={3}
                    borderRadius="xl"
                  >
                    {assessmentDetails.confirmationCode}
                  </Badge>
                  <Text fontSize="xs" color="gray.600" fontWeight="500">
                    Please save this code for your records and reference
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Assessment Details */}
          <VStack spacing={6} align="stretch">
            <Card 
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(194, 24, 91, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(194, 24, 91, 0.08)"
            >
              <CardBody p={8}>
                <VStack spacing={8} align="start">
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
                      Assessment Details
                    </Heading>
                  </HStack>
                  
                  <VStack spacing={4} w="full">
                    <HStack spacing={4} w="full" align="start">
                      <Icon as={FaClipboardList} color="primary.500" fontSize="lg" mt={1} />
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="600">Assessment Type</Text>
                        <Text color="gray.600">{selectedService.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {selectedService.description}
                        </Text>
                      </VStack>
                    </HStack>

                    <Divider />

                    <HStack spacing={4} w="full" align="start">
                      <Icon as={FaCalendarAlt} color="primary.500" fontSize="lg" mt={1} />
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="600">Date & Time</Text>
                        <Text color="gray.600">
                          {new Date(selectedSchedule.date).toLocaleDateString('en-NG', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Text>
                        <Text color="gray.600">
                          {selectedSchedule.timeSlot.time} • {assessmentDetails.assessmentDuration} minute assessment
                        </Text>
                      </VStack>
                    </HStack>

                    <Divider />

                    <HStack spacing={4} w="full" align="start">
                      <Icon as={FaUserNurse} color="blue.500" fontSize="lg" mt={1} />
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="600">Healthcare Professional</Text>
                        <Text color="gray.600">{assessmentDetails.assignedProfessional.name}</Text>
                        <HStack spacing={2}>
                          <Badge colorScheme="green" size="sm">
                            ⭐ {assessmentDetails.assignedProfessional.rating}
                          </Badge>
                          <Badge colorScheme="blue" size="sm">
                            {assessmentDetails.assignedProfessional.experience}y exp.
                          </Badge>
                          <Badge colorScheme="purple" size="sm">
                            Verified
                          </Badge>
                        </HStack>
                        <Text fontSize="xs" color="gray.500">
                          {assessmentDetails.assignedProfessional.specialization}
                        </Text>
                      </VStack>
                    </HStack>

                    <Divider />

                    <HStack spacing={4} w="full" align="start">
                      <Icon as={FaMapMarkerAlt} color="red.500" fontSize="lg" mt={1} />
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="600">Assessment Location</Text>
                        <Text color="gray.600">
                          {selectedSchedule.address.street}
                        </Text>
                        <Text color="gray.600">
                          {selectedSchedule.address.city}, {selectedSchedule.address.state}
                        </Text>
                        {selectedSchedule.address.landmark && (
                          <Text fontSize="sm" color="gray.500">
                            Near: {selectedSchedule.address.landmark}
                          </Text>
                        )}
                      </VStack>
                    </HStack>

                    <Divider />

                    <HStack spacing={4} w="full" align="start">
                      <Icon as={FaClock} color="orange.500" fontSize="lg" mt={1} />
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="600">Estimated Arrival</Text>
                        <Text color="gray.600">
                          {assessmentDetails.estimatedArrival} (15 minutes before assessment)
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Healthcare professional will call 30 minutes before arrival
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Payment Summary */}
            <Card 
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(34, 197, 94, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(34, 197, 94, 0.08)"
            >
              <CardBody p={8}>
                <VStack spacing={6} align="start">
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
                      <Icon as={FaReceipt} color="white" fontSize="lg" />
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
                      Payment Summary
                    </Heading>
                  </HStack>
                  
                  <VStack spacing={2} w="full">
                    <HStack justify="space-between" w="full">
                      <Text>Assessment Type</Text>
                      <Text>{selectedService.name}</Text>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <Text>Assessment Fee</Text>
                      <Text fontWeight="600">{formatPrice(ASSESSMENT_PRICE)}</Text>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <Text>Payment Method</Text>
                      <Badge colorScheme={paymentResult.method === 'cash' ? 'orange' : 'green'}>
                        {paymentResult.method.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <Text>Transaction ID</Text>
                      <Text fontSize="sm" color="gray.600">
                        {paymentResult.transactionId}
                      </Text>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <Text>Status</Text>
                      <Badge colorScheme={paymentResult.status === 'success' ? 'green' : 'yellow'}>
                        {paymentResult.status.toUpperCase()}
                      </Badge>
                    </HStack>

                    <Divider />

                    <Alert status="info" size="sm">
                      <AlertIcon />
                      <Box fontSize="sm">
                        <AlertTitle>Fixed Assessment Fee!</AlertTitle>
                        <AlertDescription>
                          All health assessments are priced at {formatPrice(ASSESSMENT_PRICE)} regardless of type or duration.
                        </AlertDescription>
                      </Box>
                    </Alert>
                  </VStack>

                  <HStack spacing={3} w="full">
                    <Button
                      leftIcon={<FaPrint />}
                      size="sm"
                      bgGradient="linear(45deg, green.500, emerald.500)"
                      color="white"
                      onClick={handlePrintReceipt}
                      flex={1}
                      _hover={{
                        bgGradient: "linear(45deg, green.600, emerald.600)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)"
                      }}
                      _active={{
                        transform: "translateY(0px)"
                      }}
                      transition="all 0.2s"
                      borderRadius="lg"
                    >
                      Print
                    </Button>
                    <Button
                      leftIcon={<FaDownload />}
                      size="sm"
                      bgGradient="linear(45deg, green.500, emerald.500)"
                      color="white"
                      onClick={handleDownloadReceipt}
                      flex={1}
                      _hover={{
                        bgGradient: "linear(45deg, green.600, emerald.600)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)"
                      }}
                      _active={{
                        transform: "translateY(0px)"
                      }}
                      transition="all 0.2s"
                      borderRadius="lg"
                    >
                      Download
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>

          {/* Instructions & Next Steps */}
          <VStack spacing={6} align="stretch">
            {/* Preparation Instructions */}
            <Card 
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(194, 24, 91, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(194, 24, 91, 0.08)"
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
                      <Icon as={FaClipboardList} color="white" fontSize="lg" />
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
                      Assessment Preparation
                    </Heading>
                  </HStack>
                  
                  <VStack spacing={3} align="start" w="full">
                    {assessmentDetails.assessmentInstructions.map((instruction, index) => (
                      <HStack key={index} spacing={4} align="start">
                        <Box
                          w="6px"
                          h="6px"
                          bgGradient="linear(45deg, brand.500, purple.500)"
                          borderRadius="full"
                          mt={2}
                          flexShrink={0}
                          boxShadow="0 2px 4px rgba(194, 24, 91, 0.3)"
                        />
                        <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                          {instruction}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Contact Information */}
            <Card 
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(34, 197, 94, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(34, 197, 94, 0.08)"
            >
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack spacing={4}>
                    <Box
                      w="40px"
                      h="40px"
                      bgGradient="linear(45deg, blue.500, purple.500)"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="0 4px 15px rgba(59, 130, 246, 0.3)"
                    >
                      <Icon as={FaPhone} color="white" fontSize="lg" />
                    </Box>
                    <Heading 
                      size="md"
                      bgGradient="linear(45deg, blue.600, purple.600)"
                      bgClip="text"
                      sx={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                      fontWeight="700"
                    >
                      Contact & Support
                    </Heading>
                  </HStack>
                  
                  <VStack spacing={4} w="full">
                    <HStack spacing={4} w="full">
                      <Box
                        w="30px"
                        h="30px"
                        bgGradient="linear(45deg, blue.500, blue.600)"
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaPhone} color="white" fontSize="sm" />
                      </Box>
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="600" fontSize="sm">Emergency Hotline</Text>
                        <Text fontSize="sm" color="gray.600">{assessmentDetails.emergencyContact}</Text>
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={4} w="full">
                      <Box
                        w="30px"
                        h="30px"
                        bgGradient="linear(45deg, green.500, green.600)"
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaWhatsapp} color="white" fontSize="sm" />
                      </Box>
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="600" fontSize="sm">WhatsApp Support</Text>
                        <Text fontSize="sm" color="gray.600">+234 901 234 5678</Text>
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={4} w="full">
                      <Box
                        w="30px"
                        h="30px"
                        bgGradient="linear(45deg, purple.500, purple.600)"
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaEnvelope} color="white" fontSize="sm" />
                      </Box>
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="600" fontSize="sm">Email Support</Text>
                        <Text fontSize="sm" color="gray.600">support@royalhealthconsult.ng</Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Assessment Information */}
            <Alert 
              status="success"
              bg="rgba(34, 197, 94, 0.1)"
              borderColor="rgba(34, 197, 94, 0.3)"
              borderWidth="2px"
              borderRadius="xl"
              backdropFilter="blur(10px)"
              boxShadow="0 4px 15px rgba(34, 197, 94, 0.1)"
            >
              <AlertIcon color="green.600" />
              <Box>
                <AlertTitle 
                  bgGradient="linear(45deg, green.600, emerald.600)"
                  bgClip="text"
                  sx={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  fontWeight="700"
                >
                  What to Expect
                </AlertTitle>
                <AlertDescription fontSize="sm">
                  <VStack spacing={2} align="start" mt={3}>
                    <Text>• Professional health assessment in your home</Text>
                    <Text>• Comprehensive evaluation and health screening</Text>
                    <Text>• Written assessment report within 24 hours</Text>
                    <Text>• Personalized health recommendations</Text>
                    <Text>• Follow-up care guidance if needed</Text>
                  </VStack>
                </AlertDescription>
              </Box>
            </Alert>

            {/* Important Notes */}
            <Alert 
              status="info"
              bg="rgba(59, 130, 246, 0.1)"
              borderColor="rgba(59, 130, 246, 0.3)"
              borderWidth="2px"
              borderRadius="xl"
              backdropFilter="blur(10px)"
              boxShadow="0 4px 15px rgba(59, 130, 246, 0.1)"
            >
              <AlertIcon color="blue.600" />
              <Box>
                <AlertTitle 
                  bgGradient="linear(45deg, blue.600, purple.600)"
                  bgClip="text"
                  sx={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  fontWeight="700"
                >
                  Important Notes
                </AlertTitle>
                <AlertDescription fontSize="sm">
                  <VStack spacing={2} align="start" mt={3}>
                    <Text>• {assessmentDetails.cancellationPolicy}</Text>
                    <Text>• SMS reminders will be sent 24h and 2h before assessment</Text>
                    <Text>• Healthcare professional will call 30 minutes before arrival</Text>
                    <Text>• {assessmentDetails.followUpInfo}</Text>
                    {paymentResult.method === 'cash' && (
                      <Text>• Please have exact amount ready: {formatPrice(ASSESSMENT_PRICE)}</Text>
                    )}
                  </VStack>
                </AlertDescription>
              </Box>
            </Alert>

            {/* Action Buttons */}
            <VStack spacing={4}>
              <Button
                leftIcon={<FaHome />}
                bgGradient="linear(45deg, brand.500, purple.500)"
                color="white"
                size="lg"
                onClick={handleViewDashboard}
                w="full"
                _hover={{
                  bgGradient: "linear(45deg, brand.600, purple.600)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(194, 24, 91, 0.3)"
                }}
                _active={{
                  transform: "translateY(0px)"
                }}
                transition="all 0.3s"
                borderRadius="xl"
                h={12}
                fontWeight="600"
                fontSize="lg"
              >
                View Dashboard & Track Appointment
              </Button>

              <Button
                leftIcon={<FaCalendarPlus />}
                bgGradient="linear(45deg, purple.500, blue.500)"
                color="white"
                size="lg"
                onClick={handleAddToCalendar}
                w="full"
                _hover={{
                  bgGradient: "linear(45deg, purple.600, blue.600)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(147, 51, 234, 0.3)"
                }}
                _active={{
                  transform: "translateY(0px)"
                }}
                transition="all 0.3s"
                borderRadius="xl"
                h={12}
                fontWeight="600"
                fontSize="lg"
              >
                Add to Google Calendar
              </Button>
              
              <HStack spacing={4} w="full">
                <Button
                  bgGradient="linear(45deg, green.500, emerald.500)"
                  color="white"
                  onClick={handleBookAnother}
                  flex={1}
                  _hover={{
                    bgGradient: "linear(45deg, green.600, emerald.600)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)"
                  }}
                  _active={{
                    transform: "translateY(0px)"
                  }}
                  transition="all 0.2s"
                  borderRadius="lg"
                  h={10}
                  fontWeight="500"
                >
                  Book Another Assessment
                </Button>
                <Button
                  bgGradient="linear(45deg, blue.500, purple.500)"
                  color="white"
                  onClick={handleGoHome}
                  flex={1}
                  _hover={{
                    bgGradient: "linear(45deg, blue.600, purple.600)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)"
                  }}
                  _active={{
                    transform: "translateY(0px)"
                  }}
                  transition="all 0.2s"
                  borderRadius="lg"
                  h={10}
                  fontWeight="500"
                >
                  Back to Home
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </SimpleGrid>

        {/* SMS/Email Confirmation Notice */}
        <Alert 
          status="success"
          bg="rgba(34, 197, 94, 0.1)"
          borderColor="rgba(34, 197, 94, 0.3)"
          borderWidth="2px"
          borderRadius="xl"
          backdropFilter="blur(10px)"
          boxShadow="0 4px 15px rgba(34, 197, 94, 0.1)"
        >
          <AlertIcon color="green.600" />
          <Box>
            <AlertTitle 
              bgGradient="linear(45deg, green.600, emerald.600)"
              bgClip="text"
              sx={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              fontWeight="700"
            >
              Confirmation Sent!
            </AlertTitle>
            <AlertDescription>
              We've sent comprehensive assessment appointment details to {patientInfo.email} and {patientInfo.phone}. 
              {patientInfo.consentToSMSUpdates && ' You\'ll receive timely SMS reminders 24 hours and 2 hours before your assessment appointment.'}
            </AlertDescription>
          </Box>
        </Alert>
      </VStack>
    </Container>
  )
}

export default BookingConfirmation