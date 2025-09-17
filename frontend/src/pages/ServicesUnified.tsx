import React, { useState, useCallback, useEffect, Suspense } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Center,
  useToast,
  Fade,
  ScaleFade,
} from '@chakra-ui/react'
import {
  FaUserNurse,
  FaHeartbeat,
  FaWheelchair,
  FaStethoscope,
  FaSyringe,
  FaAmbulance,
  FaClock,
  FaTag,
  FaChevronRight,
  FaCheckCircle,
  FaPhone,
  FaWhatsapp,
  FaCalendarAlt,
  FaArrowRight,
  FaClipboardCheck,
  FaBaby,
  FaHome,
  FaHospital,
  FaPills,
  FaBandAid,
  FaGraduationCap,
  FaPlane,
  FaShoppingCart,
  FaTruck,
  FaUsers,
  FaBuilding,
  FaHeart,
  FaBrain,
  FaEye,
  FaHandsHelping,
  FaMoon,
  FaUserFriends,
  FaUserMd,
  FaBookmark,
  FaExclamationTriangle,
  FaChevronDown,
} from 'react-icons/fa'
import {
  MdHealthAndSafety,
  MdElderlyWoman,
  MdPsychology,
  MdLocalPharmacy,
  MdEventNote,
} from 'react-icons/md'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { HEALTHCARE_SERVICES, BookingService } from '../utils/constants'
import ErrorBoundary from '../components/common/ErrorBoundary'
import LoadingSkeleton from '../components/common/LoadingSkeleton'
import ServiceImage from '../components/common/ServiceImage'

// Lazy load the consultation form
const SimpleConsultationForm = React.lazy(() =>
  import('../components/forms/SimpleConsultationForm')
)

// Enhanced service categories with better organization
const serviceCategories = {
  homecare: {
    title: 'Home Care Services',
    description: 'Professional healthcare services delivered in the comfort of your home',
    icon: FaHome,
    color: 'brand',
    services: [
      {
        id: 'home-nursing',
        name: 'Home Nursing Care',
        description: 'Comprehensive nursing care including vital signs monitoring, chronic illness management, and daily health assessments.',
        icon: FaUserNurse,
        image: '/images/care-img.jpeg',
        features: [
          'Vital signs monitoring',
          'Chronic illness management (diabetes, hypertension)',
          'Daily health assessment',
          'Medication reminders and support',
          'Hygiene assistance (bathing, grooming)',
          'General nursing support and documentation',
        ],
        popular: true,
        duration: '2-4 hours',
        category: 'nursing' as const,
      },
      {
        id: 'mother-baby-care',
        name: 'Mother & Baby Care',
        description: 'Specialized postnatal and postpartum care for mothers and newborns.',
        icon: FaBaby,
        image: '/images/m-care.png',
        features: [
          'Postnatal checkups for mother and baby',
          'Breastfeeding support and education',
          'Newborn care (bathing, cord care, diaper change)',
          'Postpartum emotional support',
          'Nutrition and recovery guidance',
          'Overnight baby care',
        ],
        duration: '4-8 hours',
        category: 'nursing' as const,
      },
      {
        id: 'wound-dressing',
        name: 'Wound Dressing',
        description: 'Professional wound care and dressing services with healing monitoring.',
        icon: FaBandAid,
        image: '/images/wound-img.png',
        features: [
          'Professional wound cleaning and dressing',
          'Monitoring healing process',
          'Pressure sore care',
          'Diabetic foot care',
          'Post-surgical wound care',
          'Dressing supplies delivery',
        ],
        duration: '30-60 minutes',
        category: 'nursing' as const,
      },
    ],
  },
  assessments: {
    title: 'Health Assessments',
    description: 'Professional health consultations and assessments at your location',
    icon: FaStethoscope,
    color: 'purple',
    services: HEALTHCARE_SERVICES.map(service => ({
      ...service,
      // Image will be handled by ServiceImage component with proper fallbacks
    })),
  },
  specialized: {
    title: 'Specialized Care',
    description: 'Expert care for specific health conditions and rehabilitation needs',
    icon: FaStethoscope,
    color: 'green',
    services: [
      {
        id: 'physiotherapy',
        name: 'Physiotherapy & Mobility Support',
        description: 'Professional physiotherapy sessions and mobility assistance at home.',
        icon: FaWheelchair,
        image: '/images/care-img.jpeg',
        features: [
          'Physiotherapy sessions at home',
          'Range-of-motion exercises',
          'Support with walking aids (wheelchair, walker, cane)',
          'Fall prevention strategies',
          'Stroke or injury recovery plans',
          'Muscle strengthening and pain management',
        ],
        duration: '1-2 hours',
        category: 'therapy' as const,
      },
      {
        id: 'dementia-care',
        name: 'Dementia Care',
        description: 'Specialized care and support for individuals living with dementia.',
        icon: FaBrain,
        image: '/images/about-img.jpeg',
        features: [
          'Structured daily routines',
          'Safety supervision and fall prevention',
          'Memory support activities',
          'Behavioral management',
          'Personal hygiene and feeding',
          'Emotional support for family',
        ],
        duration: '4-8 hours',
        category: 'nursing' as const,
      },
    ],
  },
}

// Enhanced service interface
interface EnhancedService extends BookingService {
  image?: string
  features?: string[]
  popular?: boolean
}

const ServicesUnified: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedService, setSelectedService] = useState<EnhancedService | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // Simulate loading and error handling
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Check for URL parameters
    const serviceParam = searchParams.get('service')
    const categoryParam = searchParams.get('category')

    if (categoryParam) {
      // Navigate to specific category
      const categoryIndex = Object.keys(serviceCategories).findIndex(key => key === categoryParam)
      if (categoryIndex !== -1) {
        setActiveTab(categoryIndex)
      }
    } else if (serviceParam) {
      // Auto-select service category if specified
      const categoryIndex = Object.keys(serviceCategories).findIndex(key =>
        serviceCategories[key as keyof typeof serviceCategories].services.some(
          service => service.id === serviceParam
        )
      )
      if (categoryIndex !== -1) {
        setActiveTab(categoryIndex)
      }
    }

    return () => clearTimeout(timer)
  }, [searchParams])

  const handleServiceSelect = useCallback((service: EnhancedService) => {
    setSelectedService(service)

    // For assessment services, open consultation modal
    if (service.category === 'general' || service.category === 'specialized' ||
        service.category === 'emergency' || service.category === 'routine') {
      onOpen()
    } else {
      // For other services, redirect to booking
      navigate(`/booking?service=${service.id}`)
    }
  }, [navigate, onOpen])

  const handleQuickConsultation = useCallback(() => {
    setSelectedService(null)
    onOpen()
  }, [onOpen])

  const getCategoryInfo = (category: string) => {
    return serviceCategories[category as keyof typeof serviceCategories] || serviceCategories.homecare
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType> = {
      FaHeartbeat,
      FaStethoscope,
      FaAmbulance,
      FaCalendarCheck: FaCalendarAlt,
      FaUserAlt: FaUserNurse,
      FaChartLine: FaClipboardCheck,
      FaBandAid,
      FaBrain,
      FaBaby,
      FaChild: FaBaby,
      FaUserNurse,
      FaWheelchair,
    }
    return iconMap[iconName] || FaHeartbeat
  }

  // Error boundary fallback
  if (error) {
    return (
      <Container maxW="2xl" py={20}>
        <Center>
          <Alert status="error" borderRadius="xl" p={8}>
            <AlertIcon />
            <Box>
              <AlertTitle>Something went wrong!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <Button mt={4} colorScheme="red" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </Box>
          </Alert>
        </Center>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="7xl" py={8}>
          <VStack spacing={8}>
            <LoadingSkeleton height="200px" />
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
              {[...Array(6)].map((_, i) => (
                <LoadingSkeleton key={i} height="300px" />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    )
  }

  return (
    <ErrorBoundary>
      <Box minH="100vh">
        {/* Hero Section */}
        <Box
          minH="35vh"
          bg="brand.600"
          sx={{
            backgroundImage: "url('/images/img2.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: 'linear-gradient(135deg, rgba(194, 24, 91, 0.2), rgba(139, 69, 19, 0.1))',
            zIndex: 1,
          }}
        >
          <Container maxW="7xl" position="relative" zIndex={2} py={2}>
            <VStack spacing={4} align="stretch">
              {/* Breadcrumb */}
              <Breadcrumb spacing="8px" separator={<FaChevronRight color="white" />}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => navigate('/')}
                    color="white"
                    cursor="pointer"
                    _hover={{ color: 'brand.200', textDecoration: 'none' }}
                    fontWeight="600"
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink color="brand.100" fontWeight="600">
                    Our Services
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>

              {/* Header Section */}
              <Fade in>
                <VStack spacing={4} textAlign="center" maxW="800px" mx="auto" py={2}>
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
                    <Heading size="3xl" fontWeight="900" position="relative" zIndex={2}>
                      <Text
                        as="span"
                        bgGradient="linear(45deg, brand.600, purple.600)"
                        bgClip="text"
                        sx={{
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          filter: 'drop-shadow(0 2px 4px rgba(194, 24, 91, 0.3))',
                        }}
                      >
                        Royal Health
                      </Text>{' '}
                      <Text
                        as="span"
                        bgGradient="linear(45deg, brand.700, purple.700)"
                        bgClip="text"
                        sx={{
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          filter: 'drop-shadow(0 2px 4px rgba(123, 31, 162, 0.3))',
                        }}
                      >
                        Services
                      </Text>
                    </Heading>
                  </Box>

                  <Text
                    color="white"
                    fontSize="xl"
                    lineHeight="1.6"
                    textShadow="1px 1px 2px rgba(0,0,0,0.5)"
                  >
                    Professional healthcare services delivered to your home. From consultations to specialized care, we bring quality healthcare to you.
                  </Text>

                  {/* Quick Action Buttons */}
                  <HStack spacing={4} flexWrap="wrap" justify="center" pt={4}>
                    <Button
                      size="lg"
                      bg="white"
                      color="brand.600"
                      rightIcon={<FaCalendarAlt />}
                      onClick={handleQuickConsultation}
                      px={8}
                      py={6}
                      fontSize="lg"
                      fontWeight="700"
                      borderRadius="xl"
                      boxShadow="0 4px 14px rgba(0,0,0,0.3)"
                      _hover={{
                        bg: 'brand.50',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
                      }}
                      transition="all 0.2s ease-in-out"
                    >
                      Book Consultation
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      borderColor="white"
                      color="white"
                      rightIcon={<FaPhone />}
                      px={8}
                      py={6}
                      fontSize="lg"
                      fontWeight="700"
                      borderRadius="xl"
                      _hover={{
                        bg: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                      }}
                      transition="all 0.2s ease-in-out"
                    >
                      Call Now
                    </Button>
                  </HStack>

                  {/* Stats */}
                  <HStack spacing={8} pt={4}>
                    {[
                      { number: '500+', label: 'Happy Clients' },
                      { number: '50+', label: 'Services' },
                      { number: '24/7', label: 'Available' },
                    ].map((stat, index) => (
                      <VStack key={index} spacing={1}>
                        <Text
                          fontSize="2xl"
                          fontWeight="900"
                          color="white"
                          textShadow="1px 1px 2px rgba(0,0,0,0.5)"
                        >
                          {stat.number}
                        </Text>
                        <Text fontSize="sm" color="white" fontWeight="600" opacity={0.9}>
                          {stat.label}
                        </Text>
                      </VStack>
                    ))}
                  </HStack>
                </VStack>
              </Fade>
            </VStack>
          </Container>
        </Box>

        {/* Main Content */}
        <Box bg="gray.50" py={12}>
          <Container maxW="7xl">
            <VStack spacing={8} align="stretch">
              {/* Service Categories Navigation */}
              <Box bg="white" borderRadius="2xl" p={4} boxShadow="lg">
                {/* Mobile Dropdown */}
                <Box display={{ base: 'block', md: 'none' }} mb={4}>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<FaChevronDown />}
                      w="full"
                      bgGradient="linear(45deg, brand.500, purple.500)"
                      color="white"
                      size="lg"
                      fontWeight="600"
                      _hover={{
                        bgGradient: 'linear(45deg, brand.600, purple.600)',
                      }}
                    >
                      <HStack spacing={2}>
                        <Icon as={Object.values(serviceCategories)[activeTab]?.icon} />
                        <Text>{Object.values(serviceCategories)[activeTab]?.title}</Text>
                      </HStack>
                    </MenuButton>
                    <MenuList>
                      {Object.entries(serviceCategories).map(([key, category], index) => (
                        <MenuItem
                          key={key}
                          onClick={() => setActiveTab(index)}
                          icon={<Icon as={category.icon} />}
                          fontWeight="500"
                        >
                          {category.title}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </Box>

                {/* Desktop Tabs */}
                <Box display={{ base: 'none', md: 'block' }}>
                  <Tabs
                    variant="enclosed"
                    colorScheme="brand"
                    index={activeTab}
                    onChange={setActiveTab}
                    isLazy
                  >
                    <TabList flexWrap="wrap" justifyContent="center">
                      {Object.entries(serviceCategories).map(([key, category]) => (
                        <Tab
                          key={key}
                          fontWeight="600"
                          px={6}
                          py={3}
                          borderRadius="lg"
                          _selected={{
                            bgGradient: 'linear(45deg, brand.500, purple.500)',
                            color: 'white',
                            borderColor: 'transparent',
                          }}
                          _hover={{
                            bg: 'brand.50',
                            color: 'brand.600',
                          }}
                          transition="all 0.2s ease-in-out"
                        >
                          <HStack spacing={2}>
                            <Icon as={category.icon} />
                            <Text>{category.title}</Text>
                          </HStack>
                        </Tab>
                      ))}
                    </TabList>

                    <TabPanels>
                      {Object.entries(serviceCategories).map(([key, category]) => (
                        <TabPanel key={key} px={0}>
                          <ScaleFade in initialScale={0.9}>
                            <VStack spacing={8}>
                            {/* Category Header */}
                            <VStack spacing={4} textAlign="center">
                              <Box
                                w={20}
                                h={20}
                                bgGradient={`linear(45deg, ${category.color}.100, ${category.color}.200)`}
                                borderRadius="2xl"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                border="3px solid"
                                borderColor={`${category.color}.300`}
                              >
                                <Icon as={category.icon} color={`${category.color}.600`} fontSize="3xl" />
                              </Box>
                              <VStack spacing={2}>
                                <Heading size="lg" color="gray.800" fontWeight="700">
                                  {category.title}
                                </Heading>
                                <Text color="gray.600" maxW="600px" fontWeight="500">
                                  {category.description}
                                </Text>
                              </VStack>
                            </VStack>

                            {/* Services Grid */}
                            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={8} w="full">
                              {category.services.map((service) => (
                                <Card
                                  key={service.id}
                                  bg={cardBg}
                                  borderColor={borderColor}
                                  borderWidth="2px"
                                  borderRadius="2xl"
                                  overflow="hidden"
                                  transition="all 0.3s"
                                  _hover={{
                                    transform: 'translateY(-6px)',
                                    boxShadow: '0 15px 35px rgba(194, 24, 91, 0.15)',
                                    borderColor: 'brand.300',
                                  }}
                                  position="relative"
                                  h="full"
                                >
                                  {/* Service Image with fallback handling */}
                                  <Box position="relative">
                                    <ServiceImage
                                      serviceId={service.id}
                                      category={service.category}
                                      src={service.image}
                                      w="full"
                                      h="280px"
                                      borderTopRadius="2xl"
                                      alt={`${service.name} service image`}
                                    />
                                    {service.popular && (
                                      <Badge
                                        position="absolute"
                                        top={3}
                                        right={3}
                                        bg="brand.500"
                                        color="white"
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        zIndex={2}
                                      >
                                        Popular
                                      </Badge>
                                    )}
                                  </Box>

                                  <CardBody p={8} display="flex" flexDirection="column" h="full">
                                    <VStack spacing={4} align="start" flex={1}>
                                      {/* Header */}
                                      <Flex justify="space-between" align="start" w="full">
                                        <Box
                                          w={12}
                                          h={12}
                                          bgGradient={`linear(45deg, ${category.color}.50, ${category.color}.100)`}
                                          borderRadius="xl"
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                          border="2px solid"
                                          borderColor={`${category.color}.200`}
                                        >
                                          <Icon
                                            as={getIconComponent(service.icon)}
                                            color={`${category.color}.600`}
                                            fontSize="lg"
                                          />
                                        </Box>
                                      </Flex>

                                      {/* Service Details */}
                                      <VStack spacing={3} align="start" flex={1}>
                                        <Heading size="md" color="gray.800" lineHeight="1.3" fontWeight="700">
                                          {service.name}
                                        </Heading>
                                        <Text color="gray.600" fontSize="sm" lineHeight="1.5" fontWeight="500">
                                          {service.description}
                                        </Text>

                                        {/* Features */}
                                        {service.features && service.features.length > 0 && (
                                          <VStack spacing={2} align="start" w="full">
                                            <Text fontSize="sm" fontWeight="700" color={`${category.color}.600`}>
                                              Includes:
                                            </Text>
                                            {service.features.slice(0, 3).map((feature, index) => (
                                              <HStack key={index} spacing={2}>
                                                <Icon as={FaCheckCircle} color="green.500" fontSize="sm" />
                                                <Text fontSize="xs" color="gray.600" fontWeight="500">
                                                  {feature}
                                                </Text>
                                              </HStack>
                                            ))}
                                            {service.features.length > 3 && (
                                              <Text fontSize="xs" color={`${category.color}.600`} fontWeight="600">
                                                +{service.features.length - 3} more included
                                              </Text>
                                            )}
                                          </VStack>
                                        )}

                                        {/* Duration */}
                                        {service.duration && (
                                          <HStack spacing={2} flexWrap="wrap">
                                            <Badge
                                              bg="gray.100"
                                              color="gray.600"
                                              fontSize="xs"
                                              px={2}
                                              py={1}
                                              borderRadius="full"
                                            >
                                              <Icon as={FaClock} mr={1} />
                                              {service.duration}
                                            </Badge>
                                          </HStack>
                                        )}
                                      </VStack>

                                      <Divider borderColor={`${category.color}.100`} />

                                      {/* Action Button */}
                                      <Button
                                        w="full"
                                        bgGradient={`linear(45deg, ${category.color}.500, ${category.color}.600)`}
                                        color="white"
                                        size="md"
                                        onClick={() => handleServiceSelect(service)}
                                        fontWeight="700"
                                        rightIcon={<FaArrowRight />}
                                        borderRadius="lg"
                                        _hover={{
                                          bgGradient: `linear(45deg, ${category.color}.600, ${category.color}.700)`,
                                          transform: 'translateY(-1px)',
                                          boxShadow: '0 4px 12px rgba(194, 24, 91, 0.25)',
                                        }}
                                        transition="all 0.2s ease-in-out"
                                      >
                                        {key === 'assessments' ? 'Book Consultation' : 'Book Service'}
                                      </Button>
                                    </VStack>
                                  </CardBody>
                                </Card>
                              ))}
                            </SimpleGrid>
                          </VStack>
                          </ScaleFade>
                        </TabPanel>
                      ))}
                    </TabPanels>
                  </Tabs>
                </Box>

                {/* Mobile Content */}
                <Box display={{ base: 'block', md: 'none' }}>
                  <ScaleFade in initialScale={0.9}>
                    <VStack spacing={8}>
                      {/* Category Header */}
                      <VStack spacing={4} textAlign="center">
                        <Box
                          w={20}
                          h={20}
                          bgGradient={`linear(45deg, ${Object.values(serviceCategories)[activeTab]?.color}.100, ${Object.values(serviceCategories)[activeTab]?.color}.200)`}
                          borderRadius="2xl"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          border="3px solid"
                          borderColor={`${Object.values(serviceCategories)[activeTab]?.color}.300`}
                        >
                          <Icon as={Object.values(serviceCategories)[activeTab]?.icon} color={`${Object.values(serviceCategories)[activeTab]?.color}.600`} fontSize="3xl" />
                        </Box>
                        <VStack spacing={2}>
                          <Heading size="lg" color="gray.800" fontWeight="700">
                            {Object.values(serviceCategories)[activeTab]?.title}
                          </Heading>
                          <Text color="gray.600" maxW="600px" fontWeight="500">
                            {Object.values(serviceCategories)[activeTab]?.description}
                          </Text>
                        </VStack>
                      </VStack>

                      {/* Services Grid */}
                      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={8} w="full">
                        {Object.values(serviceCategories)[activeTab]?.services.map((service) => (
                          <Card
                            key={service.id}
                            bg={cardBg}
                            borderColor={borderColor}
                            borderWidth="2px"
                            borderRadius="2xl"
                            overflow="hidden"
                            transition="all 0.3s"
                            _hover={{
                              transform: 'translateY(-6px)',
                              boxShadow: '0 15px 35px rgba(194, 24, 91, 0.15)',
                              borderColor: 'brand.300',
                            }}
                            position="relative"
                            h="full"
                          >
                            {/* Service content same as desktop */}
                            <CardBody p={8} display="flex" flexDirection="column" h="full">
                              <VStack spacing={4} align="start" flex={1}>
                                {/* Header */}
                                <Flex justify="space-between" align="start" w="full">
                                  <Box
                                    w={12}
                                    h={12}
                                    bgGradient={`linear(45deg, ${Object.values(serviceCategories)[activeTab]?.color}.50, ${Object.values(serviceCategories)[activeTab]?.color}.100)`}
                                    borderRadius="xl"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    border="2px solid"
                                    borderColor={`${Object.values(serviceCategories)[activeTab]?.color}.200`}
                                  >
                                    <Icon
                                      as={getIconComponent(service.icon)}
                                      color={`${Object.values(serviceCategories)[activeTab]?.color}.600`}
                                      fontSize="lg"
                                    />
                                  </Box>
                                </Flex>

                                {/* Service Details */}
                                <VStack spacing={3} align="start" flex={1}>
                                  <Heading size="md" color="gray.800" lineHeight="1.3" fontWeight="700">
                                    {service.name}
                                  </Heading>
                                  <Text color="gray.600" fontSize="sm" lineHeight="1.5" fontWeight="500">
                                    {service.description}
                                  </Text>

                                  {/* Duration */}
                                  {service.duration && (
                                    <HStack spacing={2} flexWrap="wrap">
                                      <Badge
                                        bg="gray.100"
                                        color="gray.600"
                                        fontSize="xs"
                                        px={2}
                                        py={1}
                                        borderRadius="full"
                                      >
                                        <Icon as={FaClock} mr={1} />
                                        {service.duration}
                                      </Badge>
                                    </HStack>
                                  )}
                                </VStack>

                                <Divider borderColor={`${Object.values(serviceCategories)[activeTab]?.color}.100`} />

                                {/* Action Button */}
                                <Button
                                  w="full"
                                  bgGradient={`linear(45deg, ${Object.values(serviceCategories)[activeTab]?.color}.500, ${Object.values(serviceCategories)[activeTab]?.color}.600)`}
                                  color="white"
                                  size="md"
                                  onClick={() => handleServiceSelect(service)}
                                  fontWeight="700"
                                  rightIcon={<FaArrowRight />}
                                  borderRadius="lg"
                                  _hover={{
                                    bgGradient: `linear(45deg, ${Object.values(serviceCategories)[activeTab]?.color}.600, ${Object.values(serviceCategories)[activeTab]?.color}.700)`,
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(194, 24, 91, 0.25)',
                                  }}
                                  transition="all 0.2s ease-in-out"
                                >
                                  {activeTab === 1 ? 'Book Consultation' : 'Book Service'}
                                </Button>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </SimpleGrid>
                    </VStack>
                  </ScaleFade>
                </Box>
              </Box>

              {/* Emergency Notice */}
              <Alert status="warning" borderRadius="xl" p={6}>
                <AlertIcon />
                <Box>
                  <AlertTitle fontSize="lg" mb={2}>
                    Medical Emergency?
                  </AlertTitle>
                  <AlertDescription fontSize="sm" lineHeight="1.6">
                    For life-threatening emergencies, please go to the nearest hospital immediately or call emergency services. Our services are for non-emergency healthcare needs.
                  </AlertDescription>
                </Box>
              </Alert>

              {/* Contact Section */}
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
                      Our healthcare consultants are available 24/7 to help you select the right service for your needs.
                    </Text>
                  </VStack>
                  <HStack spacing={4} flexWrap="wrap" justify="center">
                    <Button
                      leftIcon={<FaPhone />}
                      bgGradient="linear(45deg, brand.500, purple.500)"
                      color="white"
                      size="lg"
                      fontWeight="700"
                      borderRadius="xl"
                      _hover={{
                        bgGradient: 'linear(45deg, brand.600, purple.600)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(194, 24, 91, 0.25)',
                      }}
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
                        bg: 'green.50',
                        transform: 'translateY(-2px)',
                      }}
                    >
                      WhatsApp Us
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Container>
        </Box>

        {/* Consultation Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
          <ModalContent maxH="90vh">
            <ModalCloseButton />
            <ModalBody p={0}>
              <Suspense
                fallback={
                  <Center h="400px">
                    <VStack spacing={4}>
                      <Spinner size="lg" color="brand.500" />
                      <Text color="gray.600">Loading consultation form...</Text>
                    </VStack>
                  </Center>
                }
              >
                <SimpleConsultationForm
                  selectedService={selectedService}
                  onClose={onClose}
                />
              </Suspense>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </ErrorBoundary>
  )
}

export default ServicesUnified