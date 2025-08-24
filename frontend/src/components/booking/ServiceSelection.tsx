// src/components/booking/ServiceSelection.tsx - Enhanced with vibrant colors
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Button,
  Icon,
  Card,
  CardBody,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { 
  FaUserNurse, 
  FaHeartbeat, 
  FaWheelchair, 
  FaStethoscope,
  FaSyringe,
  FaHome,
  FaAmbulance,
  FaClock,
  FaTag,
  FaExternalLinkAlt,
  FaClipboardCheck,
  FaBaby
} from 'react-icons/fa'
import { MdHealthAndSafety, MdElderlyWoman, MdPsychology } from 'react-icons/md'
import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import type { BookingService } from '../../types/booking.types'

// Import assessment data from constants - FIXED IMPORT
import { healthcareAssessments } from '../../constants/assessments'

interface ServiceSelectionProps {
  onServiceSelect: (service: BookingService) => void
  selectedService?: BookingService
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ 
  onServiceSelect, 
  selectedService 
}) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Convert healthcareAssessments to BookingService format
  const services: BookingService[] = healthcareAssessments.map(service => ({
    id: service.id,
    name: service.name,
    description: service.shortDescription || service.description,
    price: service.price,
    duration: service.duration,
    category: service.category as BookingService['category'],
    icon: service.icon,
    popular: service.popular,
    requirements: service.requirements
  }))

  // Check for pre-selected service from URL
  useEffect(() => {
    const serviceParam = searchParams.get('service')
    if (serviceParam && !selectedService) {
      const preSelectedService = services.find(s => s.id === serviceParam)
      if (preSelectedService) {
        onServiceSelect(preSelectedService)
      }
    }
  }, [searchParams, selectedService, onServiceSelect, services])

  const getServiceIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'FaUserNurse': FaUserNurse,
      'MdElderlyWoman': MdElderlyWoman,
      'MdHealthAndSafety': MdHealthAndSafety,
      'FaHeartbeat': FaHeartbeat,
      'FaStethoscope': FaStethoscope,
      'FaWheelchair': FaWheelchair,
      'FaSyringe': FaSyringe,
      'FaAmbulance': FaAmbulance,
      'MdPsychology': MdPsychology,
      'FaBaby': FaBaby,
      'FaClipboardCheck': FaClipboardCheck
    }
    return iconMap[iconName] || FaHome
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'blue',
      specialized: 'purple',
      routine: 'green',
      emergency: 'red'
    }
    return colors[category as keyof typeof colors] || 'gray'
  }

  return (
    <Box 
      bgGradient="linear(135deg, gray.50, brand.25, purple.25)" 
      minH="calc(100vh - 80px)" 
      py={12} 
      w="100%"
      position="relative"
      overflow="hidden"
    >
      {/* Enhanced Background Decorative Elements */}
      <Box
        position="absolute"
        top="10%"
        right="5%"
        w="150px"
        h="150px"
        borderRadius="full"
        bgGradient="linear(45deg, brand.200, purple.200)"
        opacity="0.3"
        filter="blur(60px)"
        animation="float 8s ease-in-out infinite"
      />
      <Box
        position="absolute"
        bottom="15%"
        left="8%"
        w="120px"
        h="120px"
        borderRadius="full"
        bgGradient="linear(45deg, purple.200, brand.200)"
        opacity="0.2"
        filter="blur(50px)"
        animation="float 10s ease-in-out infinite reverse"
      />

      {/* CSS Animation */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>

      <Container maxW="1200px" centerContent position="relative" zIndex={1}>
        <VStack spacing={12} align="center" w="full">
          {/* Enhanced Header */}
          <VStack spacing={8} textAlign="center" maxW="800px" px={4}>
            <Heading 
              size="2xl" 
              fontWeight="900"
              lineHeight="1.2"
            >
              <Text
                as="span"
                bgGradient="linear(45deg, brand.500, purple.500)"
                bgClip="text"
                sx={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Choose Your Health
              </Text>
              <br />
              <Text as="span" color="gray.700">
                Assessment
              </Text>
            </Heading>
            <Text 
              color="gray.600" 
              fontSize="xl" 
              fontWeight="500"
              lineHeight="1.6"
              maxW="700px"
            >
              Select the type of comprehensive health assessment you need. 
              All assessments are conducted by qualified healthcare professionals in your home.
            </Text>
            
            {/* Enhanced Assessment Value Highlight */}
            <Box 
              bgGradient="linear(135deg, brand.50, purple.50)"
              border="3px solid" 
              borderColor="brand.200" 
              borderRadius="2xl" 
              p={6} 
              maxW="600px"
              boxShadow="0 8px 25px rgba(194, 24, 91, 0.15)"
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                borderTopRadius: '2xl',
                bgGradient: 'linear(90deg, brand.500, purple.500)'
              }}
            >
              <VStack spacing={3}>
                <Text 
                  fontSize="md" 
                  fontWeight="800" 
                  bgGradient="linear(45deg, brand.600, purple.600)"
                  bgClip="text"
                  sx={{
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  COMPREHENSIVE HEALTH ASSESSMENTS
                </Text>
                <Text 
                  fontSize="lg" 
                  fontWeight="700" 
                  color="gray.700"
                  textAlign="center"
                  lineHeight="1.4"
                >
                  Professional Evaluation • Detailed Report • Home Comfort
                </Text>
                <Text 
                  fontSize="sm" 
                  color="gray.600" 
                  textAlign="center"
                  fontWeight="500"
                >
                  Fixed pricing for all assessment types • Payment details shown at checkout
                </Text>
              </VStack>
            </Box>
            
            {/* Enhanced Link to detailed services page */}
            <Text fontSize="md" color="gray.500" fontWeight="500">
              Need more details? {' '}
              <Link 
                color="brand.500" 
                fontWeight="700"
                onClick={() => navigate('/services')}
                cursor="pointer"
                _hover={{ 
                  color: "brand.600",
                  textDecoration: "none",
                  transform: "translateY(-1px)"
                }}
                transition="all 0.2s ease-in-out"
              >
                View detailed assessment information
                <Icon as={FaExternalLinkAlt} ml={2} fontSize="sm" />
              </Link>
            </Text>
          </VStack>

          {/* Enhanced Pre-selection Notice */}
          {selectedService && (
            <Box
              bgGradient="linear(135deg, brand.50, purple.50)"
              border="2px solid"
              borderColor="brand.300"
              borderRadius="2xl"
              p={6}
              w="full"
              maxW="700px"
              boxShadow="0 6px 20px rgba(194, 24, 91, 0.1)"
            >
              <Text 
                fontSize="md" 
                color="brand.700" 
                textAlign="center"
                fontWeight="600"
                lineHeight="1.5"
              >
                <Text as="span" fontWeight="800" color="brand.800">
                  {selectedService.name}
                </Text> is pre-selected. 
                You can change your selection below or continue with this assessment.
              </Text>
            </Box>
          )}

          {/* Enhanced Assessment Services Grid */}
          <Box w="full" px={4}>
            <SimpleGrid 
              columns={{ base: 1, md: 2, xl: 3 }} 
              spacing={8}
              w="full"
              maxW="1200px"
              mx="auto"
            >
            {services.map((service) => {
              const isSelected = selectedService?.id === service.id
              const IconComponent = getServiceIcon(service.icon)

              return (
                <Card
                  key={service.id}
                  bg={cardBg}
                  borderColor={isSelected ? 'brand.400' : borderColor}
                  borderWidth="3px"
                  borderRadius="2xl"
                  cursor="pointer"
                  transition="all 0.3s ease-in-out"
                  _hover={{
                    transform: 'translateY(-8px)',
                    boxShadow: isSelected 
                      ? '0 20px 40px rgba(194, 24, 91, 0.25)' 
                      : '0 15px 35px rgba(0, 0, 0, 0.15)',
                    borderColor: isSelected ? 'brand.500' : 'brand.300'
                  }}
                  onClick={() => onServiceSelect(service)}
                  position="relative"
                  overflow="hidden"
                  maxW="400px"
                  mx="auto"
                  boxShadow={isSelected ? '0 15px 35px rgba(194, 24, 91, 0.2)' : 'md'}
                >
                  {/* Enhanced Popular Badge */}
                  {service.popular && (
                    <Badge
                      bgGradient="linear(45deg, brand.500, purple.500)"
                      color="white"
                      position="absolute"
                      top={4}
                      right={4}
                      borderRadius="full"
                      px={4}
                      py={2}
                      fontSize="xs"
                      fontWeight="800"
                      boxShadow="0 4px 12px rgba(194, 24, 91, 0.3)"
                      zIndex={2}
                    >
                      Popular
                    </Badge>
                  )}

                  {/* Selection Indicator */}
                  {isSelected && (
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      height="6px"
                      bgGradient="linear(90deg, brand.500, purple.500)"
                      borderTopRadius="2xl"
                      zIndex={1}
                    />
                  )}

                  <CardBody p={8} display="flex" flexDirection="column" h="full">
                    <VStack spacing={6} align="center" flex={1}>
                      {/* Enhanced Assessment Icon & Category */}
                      <VStack spacing={3}>
                        <Box
                          w={16}
                          h={16}
                          bgGradient={isSelected 
                            ? "linear(45deg, brand.100, purple.100)"
                            : "linear(45deg, gray.100, gray.50)"
                          }
                          borderRadius="2xl"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          boxShadow="lg"
                          border="2px solid"
                          borderColor={isSelected ? "brand.200" : "gray.200"}
                          transition="all 0.3s ease-in-out"
                        >
                          <Icon 
                            as={IconComponent} 
                            color={isSelected ? "brand.600" : "gray.600"} 
                            fontSize="3xl" 
                          />
                        </Box>
                        <Badge 
                          colorScheme={getCategoryColor(service.category)}
                          variant="subtle"
                          textTransform="capitalize"
                          px={3}
                          py={2}
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="700"
                          border="1px solid"
                          borderColor={`${getCategoryColor(service.category)}.200`}
                        >
                          {service.category} Assessment
                        </Badge>
                      </VStack>

                      {/* Enhanced Assessment Details */}
                      <VStack spacing={3} align="center" flex={1} justify="center">
                        <Heading 
                          size="md" 
                          color={isSelected ? "brand.700" : "gray.800"} 
                          lineHeight="1.3" 
                          textAlign="center"
                          fontWeight="800"
                          transition="color 0.3s ease-in-out"
                        >
                          {service.name}
                        </Heading>
                        <Text 
                          color="gray.600" 
                          fontSize="sm" 
                          lineHeight="1.5" 
                          textAlign="center"
                          fontWeight="500"
                        >
                          {service.description}
                        </Text>
                      </VStack>

                      {/* Enhanced Assessment Duration */}
                      <VStack spacing={4} w="full">
                        <VStack spacing={2}>
                          <HStack spacing={2}>
                            <Icon 
                              as={FaClock} 
                              color={isSelected ? "brand.500" : "gray.500"} 
                              fontSize="md" 
                            />
                            <Text 
                              fontSize="sm" 
                              color={isSelected ? "brand.600" : "gray.500"}
                              fontWeight="700"
                            >
                              Assessment Duration
                            </Text>
                          </HStack>
                          <Text 
                            fontSize="lg" 
                            fontWeight="800" 
                            color={isSelected ? "brand.700" : "gray.700"}
                          >
                            {formatDuration(service.duration)}
                          </Text>
                        </VStack>

                        {/* Enhanced Requirements */}
                        {service.requirements && (
                          <Text 
                            fontSize="xs" 
                            color="gray.500" 
                            textAlign="center"
                            fontWeight="600"
                            bg="gray.50"
                            px={3}
                            py={2}
                            borderRadius="lg"
                            border="1px solid"
                            borderColor="gray.200"
                          >
                            Required: {service.requirements.slice(0, 2).join(', ')}
                            {service.requirements.length > 2 && '...'}
                          </Text>
                        )}

                        {/* Enhanced Select Assessment Button */}
                        <Button
                          w="full"
                          variant={isSelected ? "solid" : "outline"}
                          colorScheme={isSelected ? "brand" : "gray"}
                          size="lg"
                          onClick={(e) => {
                            e.stopPropagation()
                            onServiceSelect(service)
                          }}
                          fontWeight="800"
                          fontSize="md"
                          borderRadius="xl"
                          borderWidth="2px"
                          py={6}
                          bgGradient={isSelected ? "linear(45deg, brand.500, purple.500)" : undefined}
                          _hover={isSelected ? {
                            bgGradient: "linear(45deg, brand.600, purple.600)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 20px rgba(194, 24, 91, 0.3)"
                          } : {
                            bg: "brand.50",
                            borderColor: "brand.300",
                            color: "brand.600",
                            transform: "translateY(-2px)"
                          }}
                          transition="all 0.2s ease-in-out"
                        >
                          {isSelected ? 'Selected ✓' : 'Select Assessment'}
                        </Button>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              )
            })}
            </SimpleGrid>
          </Box>

          {/* Enhanced Assessment Information */}
          <Box maxW="900px" w="full" px={4}>
            <Box
              bgGradient="linear(135deg, blue.50, blue.25)"
              border="3px solid"
              borderColor="blue.200"
              borderRadius="3xl"
              p={8}
              boxShadow="0 15px 40px rgba(59, 130, 246, 0.15)"
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                borderTopRadius: '3xl',
                bgGradient: 'linear(90deg, blue.500, blue.600)'
              }}
            >
              <VStack spacing={6}>
                <Heading 
                  size="lg" 
                  fontWeight="900"
                  textAlign="center"
                  bgGradient="linear(45deg, blue.700, blue.500)"
                  bgClip="text"
                  sx={{
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  What to Expect from Your Assessment
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
                  {[
                    {
                      icon: FaStethoscope,
                      title: 'Professional Evaluation',
                      description: 'Comprehensive health assessment by qualified healthcare professionals'
                    },
                    {
                      icon: FaClipboardCheck,
                      title: 'Detailed Report',
                      description: 'Written assessment report with findings and recommendations within 24 hours'
                    },
                    {
                      icon: FaHome,
                      title: 'Home Comfort',
                      description: 'All assessments conducted in the privacy and comfort of your own home'
                    }
                  ].map((item, index) => (
                    <VStack 
                      key={index} 
                      spacing={4} 
                      textAlign="center"
                      bg="white"
                      p={6}
                      borderRadius="2xl"
                      border="2px solid"
                      borderColor="blue.200"
                      boxShadow="0 6px 20px rgba(59, 130, 246, 0.1)"
                      _hover={{
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)'
                      }}
                      transition="all 0.3s ease-in-out"
                    >
                      <Box
                        w={12}
                        h={12}
                        bgGradient="linear(45deg, blue.100, blue.200)"
                        borderRadius="xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={item.icon} color="blue.600" fontSize="2xl" />
                      </Box>
                      <Text 
                        fontSize="md" 
                        fontWeight="800" 
                        color="blue.800"
                      >
                        {item.title}
                      </Text>
                      <Text 
                        fontSize="sm" 
                        color="blue.600" 
                        lineHeight="1.5"
                        fontWeight="500"
                      >
                        {item.description}
                      </Text>
                    </VStack>
                  ))}
                </SimpleGrid>
              </VStack>
            </Box>
          </Box>

          {/* Enhanced Emergency Notice */}
          <Box maxW="900px" w="full" px={4}>
            <Box
              bg="red.50"
              border="3px solid"
              borderColor="red.300"
              borderRadius="3xl"
              p={6}
              boxShadow="0 8px 25px rgba(239, 68, 68, 0.15)"
            >
              <HStack spacing={4} align="start">
                <Box
                  w={12}
                  h={12}
                  bgGradient="linear(45deg, red.100, red.200)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Icon as={FaAmbulance} color="red.600" fontSize="2xl" />
                </Box>
                <VStack spacing={2} align="start" flex={1}>
                  <Text 
                    fontWeight="800" 
                    color="red.700" 
                    fontSize="lg"
                  >
                    Medical Emergency?
                  </Text>
                  <Text 
                    fontSize="md" 
                    color="red.600" 
                    lineHeight="1.5"
                    fontWeight="600"
                  >
                    For life-threatening emergencies, call{' '}
                    <Text as="span" fontWeight="800" color="red.800">
                      199 (Nigeria Emergency)
                    </Text>{' '}
                    or go to the nearest hospital. Our assessment services are for non-emergency health evaluations.
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default ServiceSelection