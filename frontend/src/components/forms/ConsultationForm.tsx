import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Button,
  Icon,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Flex,
} from '@chakra-ui/react'
import {
  FaChevronRight,
  FaHeartbeat,
  FaStethoscope,
  FaAmbulance,
  FaCalendarCheck,
  FaUserAlt,
  FaChartLine,
  FaBandAid,
  FaBrain,
  FaBaby,
  FaChild,
  FaArrowRight,
  FaClock,
  FaCheckCircle,
  FaPhone,
  FaWhatsapp,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { HEALTHCARE_SERVICES, formatAssessmentPrice, BookingService } from '../../utils/constants'

interface ConsultationFormProps {
  onServiceSelect: (service: BookingService) => void
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ onServiceSelect }) => {
  const navigate = useNavigate()
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // Group services by category
  const servicesByCategory = HEALTHCARE_SERVICES.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, BookingService[]>)

  const getIconComponent = (iconName: string) => {
    const iconMap = {
      FaHeartbeat,
      FaStethoscope,
      FaAmbulance,
      FaCalendarCheck,
      FaUserAlt,
      FaChartLine,
      FaBandAid,
      FaBrain,
      FaBaby,
      FaChild,
    }
    return iconMap[iconName as keyof typeof iconMap] || FaHeartbeat
  }

  const getCategoryInfo = (category: string) => {
    const categoryMap = {
      general: {
        title: 'General Assessments',
        description: 'Comprehensive health evaluations for overall wellness',
        color: 'brand',
        icon: FaHeartbeat,
      },
      specialized: {
        title: 'Specialized Assessments',
        description: 'Targeted assessments for specific health conditions and needs',
        color: 'purple',
        icon: FaStethoscope,
      },
      emergency: {
        title: 'Emergency Assessments',
        description: 'Urgent health evaluations available 24/7',
        color: 'red',
        icon: FaAmbulance,
      },
      routine: {
        title: 'Routine Check-ups',
        description: 'Regular preventive health monitoring and wellness checks',
        color: 'green',
        icon: FaCalendarCheck,
      },
    }
    return categoryMap[category as keyof typeof categoryMap] || categoryMap.general
  }

  return (
    <Box minH="100vh">
      {/* Hero Section */}
      <Box
        minH="35vh"
        bg="brand.600"
        sx={{
          backgroundImage: "url('/images/img2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: "linear-gradient(135deg, rgba(194, 24, 91, 0.2), rgba(139, 69, 19, 0.1))",
          zIndex: 1,
        }}
      >
        <Container maxW="7xl" position="relative" zIndex={2} py={2}>
          <VStack spacing={4} align="stretch">
            {/* Breadcrumb */}
            <Breadcrumb
              spacing="8px"
              separator={<FaChevronRight color="white" />}
            >
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigate("/")}
                  color="white"
                  cursor="pointer"
                  _hover={{ color: "brand.200", textDecoration: "none" }}
                  fontWeight="600"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigate("/services")}
                  color="white"
                  cursor="pointer"
                  _hover={{ color: "brand.200", textDecoration: "none" }}
                  fontWeight="600"
                >
                  Services
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink color="brand.100" fontWeight="600">
                  Health Consultation
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            {/* Header Section */}
            <VStack
              spacing={4}
              textAlign="center"
              maxW="800px"
              mx="auto"
              py={2}
            >
              <Box
                position="relative"
                display="inline-block"
                bg="rgba(255, 255, 255, 0.15)"
                backdropFilter="blur(20px)"
                borderRadius="3xl"
                px={10}
                py={6}
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.3)"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)"
              >
                <Heading
                  size="3xl"
                  fontWeight="900"
                  position="relative"
                  zIndex={2}
                >
                  <Text
                    as="span"
                    bgGradient="linear(45deg, brand.600, purple.600)"
                    bgClip="text"
                    sx={{
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 2px 4px rgba(194, 24, 91, 0.3))",
                    }}
                  >
                    Health
                  </Text>{" "}
                  <Text
                    as="span"
                    bgGradient="linear(45deg, brand.700, purple.700)"
                    bgClip="text"
                    sx={{
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 2px 4px rgba(123, 31, 162, 0.3))",
                    }}
                  >
                    Consultation
                  </Text>
                </Heading>
              </Box>
              <Text
                color="white"
                fontSize="xl"
                lineHeight="1.6"
                textShadow="1px 1px 2px rgba(0,0,0,0.5)"
              >
                Choose from our comprehensive range of professional health assessments.
                All consultations are conducted by qualified healthcare professionals at your location.
              </Text>

              {/* Pricing Highlight */}
              <Box
                bg="rgba(255, 255, 255, 0.15)"
                backdropFilter="blur(10px)"
                border="2px solid rgba(255, 255, 255, 0.3)"
                borderRadius="2xl"
                p={6}
                maxW="600px"
                position="relative"
              >
                <VStack spacing={3}>
                  <Badge
                    bg="rgba(255, 255, 255, 0.9)"
                    color="brand.600"
                    px={4}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Fixed Assessment Fee
                  </Badge>
                  <Text
                    fontSize="2xl"
                    fontWeight="800"
                    color="white"
                    textAlign="center"
                    textShadow="1px 1px 2px rgba(0,0,0,0.5)"
                  >
                    {formatAssessmentPrice()} per consultation
                  </Text>
                  <Text
                    fontSize="sm"
                    color="white"
                    textAlign="center"
                    fontWeight="500"
                    opacity={0.9}
                  >
                    All assessments • Home visits • Professional reports
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Box bg="gray.50" py={12}>
        <Container maxW="7xl">
          <VStack spacing={12} align="stretch">
            {/* Assessment Categories */}
            {Object.entries(servicesByCategory).map(([category, services]) => {
              const categoryInfo = getCategoryInfo(category)

              return (
                <Box key={category}>
                  {/* Category Header */}
                  <VStack spacing={4} textAlign="center" mb={8}>
                    <Box
                      w={20}
                      h={20}
                      bgGradient={`linear(45deg, ${categoryInfo.color}.100, ${categoryInfo.color}.200)`}
                      borderRadius="2xl"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      border="3px solid"
                      borderColor={`${categoryInfo.color}.300`}
                    >
                      <Icon
                        as={categoryInfo.icon}
                        color={`${categoryInfo.color}.600`}
                        fontSize="3xl"
                      />
                    </Box>
                    <VStack spacing={2}>
                      <Heading size="lg" color="gray.800" fontWeight="700">
                        {categoryInfo.title}
                      </Heading>
                      <Text color="gray.600" maxW="600px" fontWeight="500">
                        {categoryInfo.description}
                      </Text>
                    </VStack>
                  </VStack>

                  {/* Services Grid */}
                  <SimpleGrid
                    columns={{ base: 1, md: 2, xl: 3 }}
                    spacing={6}
                    mb={8}
                  >
                    {services.map((service) => (
                      <Card
                        key={service.id}
                        bg={cardBg}
                        borderColor={borderColor}
                        borderWidth="2px"
                        borderRadius="2xl"
                        overflow="hidden"
                        transition="all 0.3s"
                        _hover={{
                          transform: "translateY(-6px)",
                          boxShadow: "0 15px 35px rgba(194, 24, 91, 0.15)",
                          borderColor: "brand.300",
                        }}
                        position="relative"
                        h="full"
                      >
                        <CardBody p={6} display="flex" flexDirection="column" h="full">
                          <VStack spacing={4} align="start" flex={1}>
                            {/* Header with Icon and Badge */}
                            <Flex justify="space-between" align="start" w="full">
                              <Box
                                w={14}
                                h={14}
                                bgGradient={`linear(45deg, ${categoryInfo.color}.50, ${categoryInfo.color}.100)`}
                                borderRadius="xl"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                border="2px solid"
                                borderColor={`${categoryInfo.color}.200`}
                              >
                                <Icon
                                  as={getIconComponent(service.icon)}
                                  color={`${categoryInfo.color}.600`}
                                  fontSize="xl"
                                />
                              </Box>
                              {service.popular && (
                                <Badge
                                  bg="brand.500"
                                  color="white"
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                  fontSize="xs"
                                  fontWeight="bold"
                                >
                                  Popular
                                </Badge>
                              )}
                            </Flex>

                            {/* Service Details */}
                            <VStack spacing={3} align="start" flex={1}>
                              <Heading
                                size="md"
                                color="gray.800"
                                lineHeight="1.3"
                                fontWeight="700"
                              >
                                {service.name}
                              </Heading>
                              <Text
                                color="gray.600"
                                fontSize="sm"
                                lineHeight="1.5"
                                fontWeight="500"
                              >
                                {service.description}
                              </Text>

                              {/* Duration and Availability */}
                              <HStack spacing={2} flexWrap="wrap">
                                <Badge
                                  bgGradient={`linear(45deg, ${categoryInfo.color}.500, ${categoryInfo.color}.600)`}
                                  color="white"
                                  fontSize="xs"
                                  px={2}
                                  py={1}
                                  borderRadius="full"
                                  leftIcon={<FaClock />}
                                >
                                  {service.duration} min
                                </Badge>
                                {service.availability && (
                                  <Badge
                                    bg="green.500"
                                    color="white"
                                    fontSize="xs"
                                    px={2}
                                    py={1}
                                    borderRadius="full"
                                  >
                                    {service.availability}
                                  </Badge>
                                )}
                              </HStack>

                              {/* Features */}
                              {service.features && service.features.length > 0 && (
                                <VStack spacing={2} align="start" w="full">
                                  <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    color={`${categoryInfo.color}.600`}
                                  >
                                    Includes:
                                  </Text>
                                  {service.features.slice(0, 3).map((feature, index) => (
                                    <HStack key={index} spacing={2}>
                                      <Icon
                                        as={FaCheckCircle}
                                        color="green.500"
                                        fontSize="sm"
                                        flexShrink={0}
                                      />
                                      <Text
                                        fontSize="xs"
                                        color="gray.600"
                                        fontWeight="500"
                                        lineHeight="1.4"
                                      >
                                        {feature}
                                      </Text>
                                    </HStack>
                                  ))}
                                  {service.features.length > 3 && (
                                    <Text
                                      fontSize="xs"
                                      color={`${categoryInfo.color}.600`}
                                      fontWeight="600"
                                    >
                                      +{service.features.length - 3} more services included
                                    </Text>
                                  )}
                                </VStack>
                              )}
                            </VStack>

                            <Divider borderColor={`${categoryInfo.color}.100`} />

                            {/* Price and Book Button */}
                            <VStack spacing={3} w="full">
                              <HStack justify="space-between" w="full">
                                <Text fontSize="sm" color="gray.600" fontWeight="500">
                                  Assessment Fee:
                                </Text>
                                <Badge
                                  bg="green.500"
                                  color="white"
                                  fontSize="lg"
                                  fontWeight="bold"
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                >
                                  {formatAssessmentPrice()}
                                </Badge>
                              </HStack>

                              <Button
                                w="full"
                                bgGradient={`linear(45deg, ${categoryInfo.color}.500, ${categoryInfo.color}.600)`}
                                color="white"
                                size="md"
                                onClick={() => onServiceSelect(service)}
                                fontWeight="700"
                                rightIcon={<FaArrowRight />}
                                borderRadius="lg"
                                _hover={{
                                  bgGradient: `linear(45deg, ${categoryInfo.color}.600, ${categoryInfo.color}.700)`,
                                  transform: "translateY(-1px)",
                                  boxShadow: `0 4px 12px rgba(194, 24, 91, 0.25)`,
                                }}
                                _active={{
                                  transform: "translateY(0)",
                                }}
                                transition="all 0.2s ease-in-out"
                              >
                                Book Assessment
                              </Button>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>

                  <Divider borderColor="gray.300" />
                </Box>
              )
            })}

            {/* Help Section */}
            <Box
              bgGradient="linear(135deg, brand.50, purple.50)"
              borderRadius="2xl"
              p={8}
              textAlign="center"
              border="2px solid"
              borderColor="brand.200"
            >
              <VStack spacing={6}>
                <VStack spacing={3}>
                  <Heading size="lg" color="gray.800" fontWeight="700">
                    Need Help Choosing?
                  </Heading>
                  <Text color="gray.600" maxW="600px" fontWeight="500">
                    Our healthcare consultants are available to help you select the right assessment
                    for your specific health needs. Get personalized recommendations.
                  </Text>
                </VStack>
                <HStack spacing={4} flexWrap="wrap" justify="center">
                  <Button
                    leftIcon={<FaPhone />}
                    bgGradient="linear(45deg, brand.500, purple.500)"
                    color="white"
                    variant="solid"
                    size="lg"
                    fontWeight="700"
                    borderRadius="xl"
                    _hover={{
                      bgGradient: "linear(45deg, brand.600, purple.600)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(194, 24, 91, 0.25)",
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    Call +234 706 332 5184
                  </Button>
                  <Button
                    leftIcon={<FaWhatsapp />}
                    colorScheme="green"
                    variant="outline"
                    size="lg"
                    fontWeight="600"
                    borderRadius="xl"
                    borderWidth="2px"
                    _hover={{
                      bg: "green.50",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    WhatsApp Us
                  </Button>
                </HStack>
              </VStack>
            </Box>

            {/* Assessment Information */}
            <Alert status="info" borderRadius="xl" p={6}>
              <AlertIcon />
              <Box>
                <AlertTitle fontSize="lg" mb={2}>About Our Health Assessments</AlertTitle>
                <AlertDescription fontSize="sm" lineHeight="1.6">
                  All our health assessments are conducted by qualified and experienced healthcare professionals.
                  The fixed fee of {formatAssessmentPrice()} covers the entire consultation, travel to your location,
                  professional assessment, and a detailed health report with recommendations.
                </AlertDescription>
              </Box>
            </Alert>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

export default ConsultationForm