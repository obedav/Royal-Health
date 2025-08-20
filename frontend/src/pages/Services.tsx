// src/pages/Services.tsx
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
  FaUserMd
} from 'react-icons/fa'
import { MdHealthAndSafety, MdElderlyWoman, MdPsychology, MdLocalPharmacy, MdEventNote } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const Services: React.FC = () => {
  const navigate = useNavigate()
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // Service categories with their respective services
  const serviceCategories = {
    homecare: {
      title: "Home Care Services",
      description: "Professional healthcare services delivered in the comfort of your home",
      icon: FaHome,
      color: "blue",
      services: [
        {
          id: "home-nursing",
          name: "Home Nursing Care",
          description: "Comprehensive nursing care including vital signs monitoring, chronic illness management, and daily health assessments.",
          icon: FaUserNurse,
          features: [
            "Vital signs monitoring",
            "Chronic illness management (diabetes, hypertension)",
            "Daily health assessment",
            "Medication reminders and support",
            "Hygiene assistance (bathing, grooming)",
            "General nursing support and documentation"
          ],
          popular: true
        },
        {
          id: "mother-baby-care",
          name: "Mother & Baby Care",
          description: "Specialized postnatal and postpartum care for mothers and newborns.",
          icon: FaBaby,
          features: [
            "Postnatal checkups for mother and baby",
            "Breastfeeding support and education",
            "Newborn care (bathing, cord care, diaper change)",
            "Postpartum emotional support",
            "Nutrition and recovery guidance",
            "Overnight baby care"
          ]
        },
        {
          id: "wound-dressing",
          name: "Wound Dressing",
          description: "Professional wound care and dressing services with healing monitoring.",
          icon: FaBandAid,
          features: [
            "Professional wound cleaning and dressing",
            "Monitoring healing process",
            "Pressure sore care",
            "Diabetic foot care",
            "Post-surgical wound care",
            "Dressing supplies delivery"
          ]
        },
        {
          id: "medication-management",
          name: "Medication Management",
          description: "Comprehensive medication organization, administration, and monitoring services.",
          icon: FaPills,
          features: [
            "Sorting and organizing medication by time/dose",
            "Setting up pillboxes or reminder systems",
            "Educating client/family on drug use and side effects",
            "Monitoring medication adherence",
            "Intramuscular, intravenous, subcutaneous administration"
          ]
        }
      ]
    },
    specialized: {
      title: "Specialized Care",
      description: "Expert care for specific health conditions and rehabilitation needs",
      icon: FaStethoscope,
      color: "purple",
      services: [
        {
          id: "physiotherapy",
          name: "Physiotherapy & Mobility Support",
          description: "Professional physiotherapy sessions and mobility assistance at home.",
          icon: FaWheelchair,
          features: [
            "Physiotherapy sessions at home",
            "Range-of-motion exercises",
            "Support with walking aids (wheelchair, walker, cane)",
            "Fall prevention strategies",
            "Stroke or injury recovery plans",
            "Muscle strengthening and pain management"
          ]
        },
        {
          id: "dementia-care",
          name: "Dementia Care",
          description: "Specialized care and support for individuals living with dementia.",
          icon: FaBrain,
          features: [
            "Structured daily routines",
            "Safety supervision and fall prevention",
            "Memory support activities",
            "Behavioral management",
            "Personal hygiene and feeding",
            "Emotional support for family"
          ]
        },
        {
          id: "stroke-management",
          name: "Stroke Management Care",
          description: "Comprehensive stroke recovery and rehabilitation support.",
          icon: FaHeartbeat,
          features: [
            "Monitoring and rehabilitation support",
            "Physiotherapy coordination",
            "Nutrition and feeding help",
            "Medication and BP management",
            "Speech therapy coordination",
            "Emotional support and motivation"
          ]
        },
        {
          id: "palliative-care",
          name: "Palliative & Hospice Care",
          description: "Compassionate end-of-life care focused on comfort and dignity.",
          icon: FaHeart,
          features: [
            "Pain and symptom management",
            "Emotional and spiritual support",
            "Support for terminal illness clients",
            "Family counselling and guidance",
            "Comfort-focused care plan",
            "End-of-life care support"
          ]
        }
      ]
    },
    corporate: {
      title: "Corporate & Event Services",
      description: "Health services for businesses, schools, and special events",
      icon: FaBuilding,
      color: "green",
      services: [
        {
          id: "school-health",
          name: "School Health Services",
          description: "Comprehensive health programs for educational institutions.",
          icon: FaGraduationCap,
          features: [
            "Routine health screenings (eye check, BMI, dental)",
            "Health talks and seminars",
            "Deworming and vaccination coordination",
            "Management of minor illnesses and injuries",
            "Health records maintenance",
            "Mental health and hygiene education"
          ]
        },
        {
          id: "nurse-on-duty",
          name: "Nurse on Duty for Events",
          description: "Professional nursing support for events and gatherings.",
          icon: MdEventNote,
          features: [
            "On-site first aid support",
            "Emergency response planning",
            "Health monitoring for VIPs or elderly guests",
            "Medication administration (if needed)",
            "COVID-19 screening (if required)",
            "Medical report for incident (if any)"
          ]
        },
        {
          id: "corporate-screening",
          name: "Corporate Health Screening",
          description: "Comprehensive health screening services for businesses.",
          icon: FaClipboardCheck,
          features: [
            "Pre-employment health screening",
            "Routine staff health checks",
            "Vision, hearing, BP, BMI, blood sugar tests",
            "Comprehensive lab testing as required",
            "Official fitness certificate",
            "Domestic staff medical clearance"
          ]
        },
        {
          id: "medical-outreaches",
          name: "Medical Outreaches",
          description: "Community health education and free health screening programs.",
          icon: FaUsers,
          features: [
            "Community health education",
            "Free or subsidized health checks",
            "Blood pressure, blood sugar, BMI screening",
            "HIV counselling and testing",
            "Maternal and child health education",
            "Partnerships with churches, schools, estates"
          ]
        }
      ]
    },
    support: {
      title: "Support Services",
      description: "Additional healthcare support and convenience services",
      icon: FaHandsHelping,
      color: "orange",
      services: [
        {
          id: "hospital-companionship",
          name: "Hospital Companionship",
          description: "Bedside support and companionship for hospitalized patients.",
          icon: FaHospital,
          features: [
            "Bedside support for admitted patients",
            "Emotional comfort and monitoring",
            "Feeding and hygiene support",
            "Communication with medical team",
            "Medication and appointment reminders",
            "Support for families living far from hospital"
          ]
        },
        {
          id: "travel-nurse",
          name: "Travel Nurse Services",
          description: "Professional nursing escort for local and international travel.",
          icon: FaPlane,
          features: [
            "Escort for clients travelling locally or abroad",
            "In-transit care (vital signs, medication, support)",
            "Holiday care assistance",
            "Medical condition management during travel",
            "Travel clearance documentation"
          ]
        },
        {
          id: "medication-delivery",
          name: "Medication Pickup & Delivery",
          description: "Convenient medication pickup and home delivery services.",
          icon: FaTruck,
          features: [
            "Pickup of prescriptions from hospital/pharmacy",
            "Scheduled delivery to home",
            "Ensuring correct medications as prescribed",
            "Medication information sheet",
            "Safe and confidential handling"
          ]
        },
        {
          id: "health-products",
          name: "Home Health Products",
          description: "Sales of medical equipment and health products for home use.",
          icon: FaShoppingCart,
          features: [
            "BP monitors, glucometers, thermometers",
            "Adult diapers and pads",
            "First aid kits",
            "Mobility aids (walkers, wheelchairs)",
            "Wound care materials",
            "Home safety equipment for elderly"
          ]
        }
      ]
    }
  }

  const getCareTypes = () => [
    {
      id: "visiting-care",
      name: "Visiting Care",
      description: "1-4 hour visits for specific care needs",
      icon: FaClock,
      duration: "1-4 hours"
    },
    {
      id: "overnight-care", 
      name: "Overnight Care",
      description: "Evening to morning care and supervision",
      icon: FaMoon,
      duration: "8-12 hours"
    },
    {
      id: "respite-care",
      name: "Respite & Holiday Care", 
      description: "Temporary care to relieve primary caregivers",
      icon: FaUserFriends,
      duration: "Flexible"
    },
    {
      id: "regular-visits",
      name: "Regular Home Visits",
      description: "Weekly or biweekly scheduled care visits",
      icon: FaCalendarAlt,
      duration: "Ongoing"
    }
  ]

  const handleBookService = (serviceId: string) => {
    navigate(`/booking?service=${serviceId}`)
  }

  const handleQuickBook = () => {
    navigate('/booking')
  }

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={10} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb spacing="8px" separator={<FaChevronRight color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/')} color="primary.500" cursor="pointer">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="gray.600">Our Services</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header Section */}
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Heading size="2xl" color="gray.800">
              Royal Health Services
            </Heading>
            <Text color="gray.600" fontSize="xl" lineHeight="1.6">
              Comprehensive healthcare services delivered to your home by qualified professionals. 
              From routine care to specialized treatments, we bring quality healthcare to you.
            </Text>
            
            {/* Service Value Highlight */}
            <Box 
              bg="primary.50" 
              border="2px solid" 
              borderColor="primary.200" 
              borderRadius="xl" 
              p={6} 
              maxW="600px"
            >
              <VStack spacing={2}>
                <Text fontSize="sm" color="primary.600" fontWeight="600">
                  PROFESSIONAL HEALTHCARE AT HOME
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="primary.500">
                  Qualified Professionals • Comprehensive Care • Your Comfort
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Available 24/7 for emergencies • Flexible scheduling for all services
                </Text>
              </VStack>
            </Box>
            
            {/* Quick Action */}
            <Button
              size="lg"
              colorScheme="primary"
              rightIcon={<FaCalendarAlt />}
              onClick={handleQuickBook}
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="bold"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg'
              }}
            >
              Book Service Now
            </Button>

            {/* Stats */}
            <HStack spacing={8} pt={4}>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">500+</Text>
                <Text fontSize="sm" color="gray.600">Satisfied Clients</Text>
              </VStack>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">25+</Text>
                <Text fontSize="sm" color="gray.600">Service Types</Text>
              </VStack>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">24/7</Text>
                <Text fontSize="sm" color="gray.600">Emergency Available</Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Service Categories Tabs */}
          <Tabs variant="enclosed" colorScheme="primary">
            <TabList flexWrap="wrap" justifyContent="center">
              {Object.entries(serviceCategories).map(([key, category]) => (
                <Tab key={key} fontWeight="medium" px={6}>
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
                  <VStack spacing={8}>
                    {/* Category Header */}
                    <VStack spacing={4} textAlign="center">
                      <Box
                        w={20}
                        h={20}
                        bg={`${category.color}.50`}
                        borderRadius="2xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={category.icon} color={`${category.color}.500`} fontSize="3xl" />
                      </Box>
                      <VStack spacing={2}>
                        <Heading size="lg" color="gray.800">
                          {category.title}
                        </Heading>
                        <Text color="gray.600" maxW="600px">
                          {category.description}
                        </Text>
                      </VStack>
                    </VStack>

                    {/* Services Grid */}
                    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6} w="full">
                      {category.services.map((service) => (
                        <Card
                          key={service.id}
                          bg={cardBg}
                          borderColor={borderColor}
                          borderWidth="1px"
                          borderRadius="xl"
                          overflow="hidden"
                          transition="all 0.3s"
                          _hover={{
                            transform: 'translateY(-4px)',
                            boxShadow: 'xl',
                            borderColor: 'primary.300'
                          }}
                          position="relative"
                          h="full"
                        >
                          {service.popular && (
                            <Badge
                              colorScheme="primary"
                              position="absolute"
                              top={4}
                              right={4}
                              borderRadius="full"
                              px={3}
                              py={1}
                              fontSize="xs"
                              fontWeight="bold"
                              zIndex={1}
                            >
                              Popular
                            </Badge>
                          )}

                          <CardBody p={6} display="flex" flexDirection="column" h="full">
                            <VStack spacing={4} align="start" flex={1}>
                              {/* Icon & Service Name */}
                              <Flex justify="space-between" align="start" w="full">
                                <Box
                                  w={14}
                                  h={14}
                                  bg="primary.50"
                                  borderRadius="xl"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Icon as={service.icon} color="primary.500" fontSize="xl" />
                                </Box>
                              </Flex>

                              {/* Service Details */}
                              <VStack spacing={3} align="start" flex={1}>
                                <Heading size="md" color="gray.800" lineHeight="1.3">
                                  {service.name}
                                </Heading>
                                <Text color="gray.600" fontSize="sm" lineHeight="1.5">
                                  {service.description}
                                </Text>

                                {/* Service Features */}
                                <VStack spacing={2} align="start" w="full">
                                  <Text fontSize="sm" fontWeight="600" color="gray.700">
                                    Includes:
                                  </Text>
                                  {service.features.slice(0, 3).map((feature, index) => (
                                    <HStack key={index} spacing={2}>
                                      <Icon as={FaCheckCircle} color="green.500" fontSize="sm" />
                                      <Text fontSize="xs" color="gray.600">{feature}</Text>
                                    </HStack>
                                  ))}
                                  {service.features.length > 3 && (
                                    <Text fontSize="xs" color="primary.500" fontWeight="500">
                                      +{service.features.length - 3} more services included
                                    </Text>
                                  )}
                                </VStack>
                              </VStack>

                              <Divider />

                              {/* Book Service Button */}
                              <Button
                                w="full"
                                colorScheme="primary"
                                size="md"
                                onClick={() => handleBookService(service.id)}
                                fontWeight="bold"
                                rightIcon={<FaArrowRight />}
                                _hover={{
                                  transform: 'translateY(-1px)'
                                }}
                              >
                                Book Service
                              </Button>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>

          {/* Care Duration Options */}
          <Box
            bg="white"
            borderRadius="2xl"
            p={8}
            border="1px"
            borderColor="gray.200"
          >
            <VStack spacing={6}>
              <VStack spacing={3} textAlign="center">
                <Heading size="lg" color="gray.800">
                  Flexible Care Options
                </Heading>
                <Text color="gray.600" maxW="600px">
                  Choose the care schedule that works best for you and your loved ones
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={6} w="full">
                {getCareTypes().map((careType) => (
                  <Card
                    key={careType.id}
                    bg="gray.50"
                    borderRadius="xl"
                    p={6}
                    textAlign="center"
                    _hover={{ bg: "primary.50", transform: "translateY(-2px)" }}
                    transition="all 0.3s"
                    cursor="pointer"
                    onClick={() => handleBookService(careType.id)}
                  >
                    <VStack spacing={4}>
                      <Box
                        w={12}
                        h={12}
                        bg="primary.100"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={careType.icon} color="primary.600" fontSize="xl" />
                      </Box>
                      <VStack spacing={2}>
                        <Text fontWeight="bold" color="gray.800">
                          {careType.name}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {careType.description}
                        </Text>
                        <Badge colorScheme="primary" variant="subtle">
                          {careType.duration}
                        </Badge>
                      </VStack>
                    </VStack>
                  </Card>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Contact Section */}
          <Box
            bg="primary.50"
            borderRadius="2xl"
            p={8}
            textAlign="center"
          >
            <VStack spacing={6}>
              <VStack spacing={3}>
                <Heading size="lg" color="gray.800">
                  Need Help Choosing the Right Service?
                </Heading>
                <Text color="gray.600" maxW="600px">
                  Our healthcare consultants are available 24/7 to help you select the right service 
                  for your specific needs. Get personalized recommendations today.
                </Text>
              </VStack>
              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button
                  leftIcon={<FaPhone />}
                  colorScheme="primary"
                  variant="solid"
                  size="lg"
                >
                  Call +234 801 234 5678
                </Button>
                <Button
                  leftIcon={<FaWhatsapp />}
                  colorScheme="green"
                  variant="outline"
                  size="lg"
                >
                  WhatsApp Us
                </Button>
                <Button
                  leftIcon={<FaCalendarAlt />}
                  colorScheme="purple"
                  variant="outline"
                  size="lg"
                  onClick={handleQuickBook}
                >
                  Quick Booking
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* How It Works */}
          <Box
            bg="white"
            borderRadius="2xl"
            p={8}
            border="1px"
            borderColor="gray.200"
          >
            <VStack spacing={6}>
              <Heading size="lg" color="gray.800" textAlign="center">
                How Our Healthcare Services Work
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                {[
                  {
                    step: '1',
                    title: 'Book Your Service',
                    description: 'Choose your service type and preferred schedule online or by phone',
                    icon: FaCalendarAlt,
                    color: 'blue'
                  },
                  {
                    step: '2',
                    title: 'Professional Assignment',
                    description: 'We match you with a qualified healthcare professional',
                    icon: FaUserMd,
                    color: 'green'
                  },
                  {
                    step: '3',
                    title: 'Service Delivery',
                    description: 'Professional arrives at your location to provide quality care',
                    icon: FaHome,
                    color: 'purple'
                  },
                  {
                    step: '4',
                    title: 'Ongoing Support',
                    description: 'Continuous monitoring and support with detailed care reports',
                    icon: FaClipboardCheck,
                    color: 'orange'
                  }
                ].map((item, index) => (
                  <VStack key={index} spacing={4} textAlign="center">
                    <Box
                      w={16}
                      h={16}
                      bg={`${item.color}.50`}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      position="relative"
                    >
                      <Icon as={item.icon} color={`${item.color}.500`} fontSize="2xl" />
                      <Badge
                        position="absolute"
                        top="-8px"
                        right="-8px"
                        colorScheme={item.color}
                        borderRadius="full"
                        w={8}
                        h={8}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        {item.step}
                      </Badge>
                    </Box>
                    <VStack spacing={2}>
                      <Text fontWeight="600" color="gray.800">
                        {item.title}
                      </Text>
                      <Text fontSize="sm" color="gray.600" textAlign="center">
                        {item.description}
                      </Text>
                    </VStack>
                  </VStack>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Emergency Notice */}
          <Box
            bg="red.50"
            border="1px"
            borderColor="red.200"
            borderRadius="xl"
            p={6}
          >
            <HStack spacing={4} align="start">
              <Icon as={FaAmbulance} color="red.500" fontSize="2xl" mt={1} />
              <VStack spacing={2} align="start">
                <Text fontWeight="bold" color="red.700" fontSize="lg">
                  Medical Emergency?
                </Text>
                <Text fontSize="sm" color="red.600" lineHeight="1.5">
                  For life-threatening emergencies, please call <strong>199 (Nigeria Emergency)</strong> or 
                  go to the nearest hospital immediately. Our services are for non-emergency healthcare needs.
                </Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default Services