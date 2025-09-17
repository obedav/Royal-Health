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
  Fade,
  ScaleFade,
  useBreakpointValue,
  Tooltip,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
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
  paymentResult: PaymentResult | null
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

// Animation keyframes
const pulseRing = keyframes`
  0% {
    transform: scale(0.33);
  }
  40%, 50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1.33);
  }
`

const bounceIn = keyframes`
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`

const slideInFromLeft = keyframes`
  0% {
    transform: translateX(-100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`

const slideInFromRight = keyframes`
  0% {
    transform: translateX(100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  selectedService,
  selectedSchedule,
  patientInfo,
  paymentResult,
}) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const navigate = useNavigate()
  const isMobile = useBreakpointValue({ base: true, md: false })

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
    status: paymentResult ? (paymentResult.method === 'cash' ? 'pending' : 'confirmed') : 'pending',
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

ASSESSMENT DETAILS:
Assessment Type: ${selectedService.name}
Date: ${new Date(selectedSchedule.date).toLocaleDateString('en-NG')}
Time: ${selectedSchedule.timeSlot.time}
Duration: ${selectedService.duration} minutes
Patient: ${patientInfo.firstName} ${patientInfo.lastName}
Healthcare Professional: ${assessmentDetails.assignedProfessional.name}

PAYMENT INFORMATION:
Assessment Fee: ${formatPrice(ASSESSMENT_PRICE)}
${paymentResult ?
  `Payment Method: ${paymentResult.method.toUpperCase()}
Transaction ID: ${paymentResult.transactionId}
Payment Status: ${paymentResult.status.toUpperCase()}` :
  `Payment: To be discussed during consultation
Payment will be arranged with the healthcare professional upon service delivery.`}

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

  /* const handleViewDashboard = () => {
    navigate('/dashboard')
  }
 */
  const handleBookAnother = () => {
    navigate('/consultation')
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
      description: `Health Assessment with ${assessmentDetails.assignedProfessional.name}\\n\\nService: ${selectedService.name}\\nBooking ID: ${assessmentDetails.bookingId}\\nLocation: ${selectedSchedule.address.street}, ${selectedSchedule.address.city}\\n\\nContact: ${assessmentDetails.emergencyContact}`,
      location: `${selectedSchedule.address.street}, ${selectedSchedule.address.city}, ${selectedSchedule.address.state}`
    }
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`
    
    window.open(googleCalendarUrl, '_blank')
  }

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, rgba(251, 251, 254, 1) 0%, rgba(243, 244, 255, 1) 50%, rgba(238, 242, 255, 1) 100%)">
      <Container maxW="6xl" py={{ base: 6, md: 12 }}>
        <VStack spacing={{ base: 6, md: 10 }} align="stretch">
          {/* Enhanced Success Header with Animations */}
          <Fade in={true} transition={{ enter: { duration: 0.8 } }}>
            <Box
              position="relative"
              bg="rgba(255, 255, 255, 0.95)"
              backdropFilter="blur(30px)"
              borderRadius="3xl"
              p={{ base: 6, md: 12 }}
              border="1px solid"
              borderColor="rgba(34, 197, 94, 0.2)"
              boxShadow="0 20px 60px rgba(34, 197, 94, 0.15), 0 8px 25px rgba(0, 0, 0, 0.05)"
              overflow="hidden"
              _before={{
                content: '""',
                position: "absolute",
                inset: 0,
                borderRadius: "3xl",
                padding: "2px",
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.4), rgba(16, 185, 129, 0.3), rgba(59, 130, 246, 0.2))",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "xor",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
              }}
              _after={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.03) 0%, transparent 70%)",
                borderRadius: "3xl",
                zIndex: 0,
              }}
            >
              <VStack spacing={{ base: 6, md: 10 }} textAlign="center" position="relative" zIndex={1}>
                {/* Animated Success Icon */}
                <ScaleFade in={true} initialScale={0.3} transition={{ enter: { duration: 1, delay: 0.3 } }}>
                  <Box position="relative">
                    {/* Pulsing ring animation */}
                    <Box
                      position="absolute"
                      w={32}
                      h={32}
                      borderRadius="full"
                      bg="rgba(34, 197, 94, 0.2)"
                      animation={`${pulseRing} 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite`}
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                    />
                    <Box
                      w={{ base: 20, md: 28 }}
                      h={{ base: 20, md: 28 }}
                      bgGradient="linear(45deg, green.500, emerald.500)"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="0 15px 40px rgba(34, 197, 94, 0.4), 0 5px 15px rgba(0, 0, 0, 0.1)"
                      position="relative"
                      animation={`${bounceIn} 1s ease-out 0.5s both`}
                      _before={{
                        content: '""',
                        position: "absolute",
                        w: { base: 24, md: 32 },
                        h: { base: 24, md: 32 },
                        bgGradient: "linear(45deg, green.300, emerald.300)",
                        borderRadius: "full",
                        opacity: 0.3,
                        zIndex: -1,
                      }}
                    >
                      <Icon as={FaCheckCircle} color="white" fontSize={{ base: "3xl", md: "5xl" }} />
                    </Box>
                  </Box>
                </ScaleFade>
            
                {/* Enhanced Title and Description */}
                <Fade in={true} transition={{ enter: { duration: 0.6, delay: 0.8 } }}>
                  <VStack spacing={{ base: 3, md: 6 }}>
                    <Heading
                      size={{ base: "xl", md: "3xl" }}
                      bgGradient="linear(45deg, green.600, emerald.600, blue.600)"
                      bgClip="text"
                      sx={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 2px 6px rgba(34, 197, 94, 0.3))",
                      }}
                      fontWeight="900"
                      textAlign="center"
                      lineHeight="1.2"
                    >
                      {paymentResult ? (paymentResult.method === 'cash' ? 'Health Assessment Scheduled!' : 'Health Assessment Confirmed!') : 'Health Assessment Scheduled!'}
                    </Heading>
                    <Text
                      color="gray.700"
                      fontSize={{ base: "md", md: "xl" }}
                      fontWeight="500"
                      maxW={{ base: "90%", md: "700px" }}
                      lineHeight="1.7"
                      textAlign="center"
                    >
                      {paymentResult ?
                        (paymentResult.method === 'cash'
                          ? 'Your health assessment is scheduled with our qualified healthcare professionals. Payment will be collected after the assessment.'
                          : 'Your payment has been processed successfully and your assessment appointment is confirmed with our qualified healthcare professionals.'
                        ) :
                        'Your health assessment is scheduled with our qualified healthcare professionals. Payment details will be discussed during the consultation.'
                      }
                    </Text>
                  </VStack>
                </Fade>

              </VStack>
            </Box>
          </Fade>

      {/* Enhanced Content Grid with Staggered Animations */}
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={{ base: 6, md: 10 }} w="full">
        {/* Left Column - Assessment Details */}
        <Box animation={`${slideInFromLeft} 0.8s ease-out 1.5s both`}>
          <VStack spacing={{ base: 4, md: 8 }} align="stretch">
            <Card
              bg="rgba(255, 255, 255, 0.95)"
              backdropFilter="blur(25px)"
              borderColor="rgba(194, 24, 91, 0.2)"
              borderWidth="2px"
              borderRadius="3xl"
              boxShadow="0 10px 35px rgba(194, 24, 91, 0.12), 0 4px 15px rgba(0, 0, 0, 0.05)"
              overflow="hidden"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 20px 50px rgba(194, 24, 91, 0.18), 0 8px 25px rgba(0, 0, 0, 0.08)",
              }}
              transition="all 0.3s ease-in-out"
            >
              <CardBody p={{ base: 6, md: 10 }}>
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
                    
                    {paymentResult ? (
                      <>
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
                      </>
                    ) : (
                      <VStack spacing={2} w="full" p={4} bg="blue.50" borderRadius="lg" border="2px solid" borderColor="blue.200">
                        <Text fontSize="sm" fontWeight="600" color="blue.700" textAlign="center">
                          Payment Discussion Scheduled
                        </Text>
                        <Text fontSize="xs" color="blue.600" textAlign="center" lineHeight="1.4">
                          Payment details will be discussed with the healthcare professional during your consultation.
                          Multiple payment options will be available.
                        </Text>
                      </VStack>
                    )}

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
        </Box>

        {/* Right Column - Instructions & Next Steps */}
        <Box animation={`${slideInFromRight} 0.8s ease-out 1.8s both`}>
          <VStack spacing={{ base: 4, md: 8 }} align="stretch">
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
                    {paymentResult && paymentResult.method === 'cash' && (
                      <Text>• Please have exact amount ready: {formatPrice(ASSESSMENT_PRICE)}</Text>
                    )}
                    {!paymentResult && (
                      <Text>• Payment will be discussed and arranged during your consultation</Text>
                    )}
                  </VStack>
                </AlertDescription>
              </Box>
            </Alert>

            {/* Enhanced Action Buttons */}
            <VStack spacing={{ base: 3, md: 6 }}>
            {/*   <Button
                leftIcon={<FaHome />}
                bgGradient="linear(45deg, brand.500, purple.500)"
                color="white"
                size={{ base: "md", md: "lg" }}
                onClick={handleViewDashboard}
                w="full"
                _hover={{
                  bgGradient: "linear(45deg, brand.600, purple.600)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 35px rgba(194, 24, 91, 0.35)"
                }}
                _active={{
                  transform: "translateY(-1px)"
                }}
                transition="all 0.3s ease-in-out"
                borderRadius="2xl"
                h={{ base: 10, md: 14 }}
                fontWeight="700"
                fontSize={{ base: "md", md: "lg" }}
                boxShadow="0 6px 20px rgba(194, 24, 91, 0.2)"
              >
                View Dashboard & Track Appointment
              </Button> */}

              <Button
                leftIcon={<FaCalendarPlus />}
                bgGradient="linear(45deg, purple.500, blue.500)"
                color="white"
                size={{ base: "md", md: "lg" }}
                onClick={handleAddToCalendar}
                w="full"
                _hover={{
                  bgGradient: "linear(45deg, purple.600, blue.600)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 35px rgba(147, 51, 234, 0.35)"
                }}
                _active={{
                  transform: "translateY(-1px)"
                }}
                transition="all 0.3s ease-in-out"
                borderRadius="2xl"
                h={{ base: 10, md: 14 }}
                fontWeight="700"
                fontSize={{ base: "md", md: "lg" }}
                boxShadow="0 6px 20px rgba(147, 51, 234, 0.2)"
              >
                Add to Google Calendar
              </Button>

              <Flex
                direction={{ base: "column", sm: "row" }}
                gap={{ base: 3, sm: 4 }}
                w="full"
              >
                <Button
                  bg="green.500"
                  color="white"
                  onClick={handleBookAnother}
                  flex={1}
                  size={{ base: "md", md: "lg" }}
                  _hover={{
                    bg: "green.600",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(34, 197, 94, 0.4)"
                  }}
                  _active={{
                    transform: "translateY(0px)"
                  }}
                  transition="all 0.3s ease-in-out"
                  borderRadius="xl"
                  borderWidth="2px"
                  borderColor="green.300"
                  h={{ base: 12, md: 14 }}
                  fontWeight="800"
                  fontSize={{ base: "md", md: "lg" }}
                  boxShadow="0 6px 20px rgba(34, 197, 94, 0.3)"
                  minW={{ base: "auto", sm: "180px" }}
                  px={{ base: 4, md: 6 }}
                  textShadow="0 2px 4px rgba(0, 0, 0, 0.5)"
                  whiteSpace="nowrap"
                  overflow="visible"
                  sx={{
                    textTransform: "none",
                    letterSpacing: "0.5px"
                  }}
                >
                  Book Another Assessment
                </Button>
                <Button
                  bg="blue.500"
                  color="white"
                  onClick={handleGoHome}
                  flex={1}
                  size={{ base: "md", md: "lg" }}
                  _hover={{
                    bg: "blue.600",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)"
                  }}
                  _active={{
                    transform: "translateY(0px)"
                  }}
                  transition="all 0.3s ease-in-out"
                  borderRadius="xl"
                  borderWidth="2px"
                  borderColor="blue.300"
                  h={{ base: 12, md: 14 }}
                  fontWeight="800"
                  fontSize={{ base: "md", md: "lg" }}
                  boxShadow="0 6px 20px rgba(59, 130, 246, 0.3)"
                  minW={{ base: "auto", sm: "140px" }}
                  px={{ base: 4, md: 6 }}
                  textShadow="0 2px 4px rgba(0, 0, 0, 0.5)"
                  whiteSpace="nowrap"
                  overflow="visible"
                  sx={{
                    textTransform: "none",
                    letterSpacing: "0.5px"
                  }}
                >
                  Back to Home
                </Button>
              </Flex>
            </VStack>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Enhanced Final Confirmation Notice */}
      <Fade in={true} transition={{ enter: { duration: 0.6, delay: 2.5 } }}>
        <Alert
          status="success"
          bg="rgba(34, 197, 94, 0.08)"
          borderColor="rgba(34, 197, 94, 0.3)"
          borderWidth="2px"
          borderRadius="2xl"
          backdropFilter="blur(15px)"
          boxShadow="0 8px 25px rgba(34, 197, 94, 0.12), 0 3px 10px rgba(0, 0, 0, 0.05)"
          p={{ base: 4, md: 6 }}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "0 12px 35px rgba(34, 197, 94, 0.18), 0 5px 15px rgba(0, 0, 0, 0.08)",
          }}
          transition="all 0.3s ease-in-out"
        >
          <AlertIcon color="green.600" fontSize={{ base: "xl", md: "2xl" }} />
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
              fontSize={{ base: "md", md: "lg" }}
            >
              Confirmation Sent!
            </AlertTitle>
            <AlertDescription fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
              We've sent comprehensive assessment appointment details to{" "}
              <Text as="span" fontWeight="600" color="green.700">
                {patientInfo.email}
              </Text>{" "}
              and{" "}
              <Text as="span" fontWeight="600" color="green.700">
                {patientInfo.phone}
              </Text>
              .
              {patientInfo.consentToSMSUpdates && (
                <Text mt={2}>
                  📱 You'll receive timely SMS reminders 24 hours and 2 hours before your assessment appointment.
                </Text>
              )}
            </AlertDescription>
          </Box>
        </Alert>
      </Fade>
    </VStack>
  </Container>
</Box>
  )
}

export default BookingConfirmation