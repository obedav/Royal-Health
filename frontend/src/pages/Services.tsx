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
} from "@chakra-ui/react";
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
} from "react-icons/fa";
import {
  MdHealthAndSafety,
  MdElderlyWoman,
  MdPsychology,
  MdLocalPharmacy,
  MdEventNote,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Services: React.FC = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Service categories with their respective services
  const serviceCategories = {
    homecare: {
      title: "Home Care Services",
      description:
        "Professional healthcare services delivered in the comfort of your home",
      icon: FaHome,
      color: "brand",
      services: [
        {
          id: "home-nursing",
          name: "Home Nursing Care",
          description:
            "Comprehensive nursing care including vital signs monitoring, chronic illness management, and daily health assessments.",
          icon: FaUserNurse,
          image: "/images/care-img.jpeg",
          features: [
            "Vital signs monitoring",
            "Chronic illness management (diabetes, hypertension)",
            "Daily health assessment",
            "Medication reminders and support",
            "Hygiene assistance (bathing, grooming)",
            "General nursing support and documentation",
          ],
          popular: true,
        },
        {
          id: "mother-baby-care",
          name: "Mother & Baby Care",
          description:
            "Specialized postnatal and postpartum care for mothers and newborns.",
          icon: FaBaby,
          image: "/images/m-care.png",
          features: [
            "Postnatal checkups for mother and baby",
            "Breastfeeding support and education",
            "Newborn care (bathing, cord care, diaper change)",
            "Postpartum emotional support",
            "Nutrition and recovery guidance",
            "Overnight baby care",
          ],
        },
        {
          id: "wound-dressing",
          name: "Wound Dressing",
          description:
            "Professional wound care and dressing services with healing monitoring.",
          icon: FaBandAid,
          image: "/images/wound-img.png",
          features: [
            "Professional wound cleaning and dressing",
            "Monitoring healing process",
            "Pressure sore care",
            "Diabetic foot care",
            "Post-surgical wound care",
            "Dressing supplies delivery",
          ],
        },
        {
          id: "medication-management",
          name: "Medication Management",
          description:
            "Comprehensive medication organization, administration, and monitoring services.",
          icon: FaPills,
          image:
            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          features: [
            "Sorting and organizing medication by time/dose",
            "Setting up pillboxes or reminder systems",
            "Educating client/family on drug use and side effects",
            "Monitoring medication adherence",
            "Intramuscular, intravenous, subcutaneous administration",
          ],
        },
      ],
    },
    specialized: {
      title: "Specialized Care",
      description:
        "Expert care for specific health conditions and rehabilitation needs",
      icon: FaStethoscope,
      color: "purple",
      services: [
        {
          id: "physiotherapy",
          name: "Physiotherapy & Mobility Support",
          description:
            "Professional physiotherapy sessions and mobility assistance at home.",
          icon: FaWheelchair,
          image: "/images/care-img.jpeg",
          features: [
            "Physiotherapy sessions at home",
            "Range-of-motion exercises",
            "Support with walking aids (wheelchair, walker, cane)",
            "Fall prevention strategies",
            "Stroke or injury recovery plans",
            "Muscle strengthening and pain management",
          ],
        },
        {
          id: "dementia-care",
          name: "Dementia Care",
          description:
            "Specialized care and support for individuals living with dementia.",
          icon: FaBrain,
          image: "/images/about-img.jpeg",
          features: [
            "Structured daily routines",
            "Safety supervision and fall prevention",
            "Memory support activities",
            "Behavioral management",
            "Personal hygiene and feeding",
            "Emotional support for family",
          ],
        },
        {
          id: "stroke-management",
          name: "Stroke Management Care",
          description:
            "Comprehensive stroke recovery and rehabilitation support.",
          icon: FaHeartbeat,
          image: "/images/services-bg-img.png",
          features: [
            "Monitoring and rehabilitation support",
            "Physiotherapy coordination",
            "Nutrition and feeding help",
            "Medication and BP management",
            "Speech therapy coordination",
            "Emotional support and motivation",
          ],
        },
        {
          id: "palliative-care",
          name: "Palliative & Hospice Care",
          description:
            "Compassionate end-of-life care focused on comfort and dignity.",
          icon: FaHeart,
          image: "/images/m-care.png",
          features: [
            "Pain and symptom management",
            "Emotional and spiritual support",
            "Support for terminal illness clients",
            "Family counselling and guidance",
            "Comfort-focused care plan",
            "End-of-life care support",
          ],
        },
      ],
    },
    corporate: {
      title: "Corporate & Event Services",
      description:
        "Health services for businesses, schools, and special events",
      icon: FaBuilding,
      color: "green",
      services: [
        {
          id: "school-health",
          name: "School Health Services",
          description:
            "Comprehensive health programs for educational institutions.",
          icon: FaGraduationCap,
          features: [
            "Routine health screenings (eye check, BMI, dental)",
            "Health talks and seminars",
            "Deworming and vaccination coordination",
            "Management of minor illnesses and injuries",
            "Health records maintenance",
            "Mental health and hygiene education",
          ],
        },
        {
          id: "nurse-on-duty",
          name: "Nurse on Duty for Events",
          description:
            "Professional nursing support for events and gatherings.",
          icon: MdEventNote,
          features: [
            "On-site first aid support",
            "Emergency response planning",
            "Health monitoring for VIPs or elderly guests",
            "Medication administration (if needed)",
            "COVID-19 screening (if required)",
            "Medical report for incident (if any)",
          ],
        },
        {
          id: "corporate-screening",
          name: "Corporate Health Screening",
          description:
            "Comprehensive health screening services for businesses.",
          icon: FaClipboardCheck,
          features: [
            "Pre-employment health screening",
            "Routine staff health checks",
            "Vision, hearing, BP, BMI, blood sugar tests",
            "Comprehensive lab testing as required",
            "Official fitness certificate",
            "Domestic staff medical clearance",
          ],
        },
        {
          id: "medical-outreaches",
          name: "Medical Outreaches",
          description:
            "Community health education and free health screening programs.",
          icon: FaUsers,
          features: [
            "Community health education",
            "Free or subsidized health checks",
            "Blood pressure, blood sugar, BMI screening",
            "HIV counselling and testing",
            "Maternal and child health education",
            "Partnerships with churches, schools, estates",
          ],
        },
      ],
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
          description:
            "Bedside support and companionship for hospitalized patients.",
          icon: FaHospital,
          features: [
            "Bedside support for admitted patients",
            "Emotional comfort and monitoring",
            "Feeding and hygiene support",
            "Communication with medical team",
            "Medication and appointment reminders",
            "Support for families living far from hospital",
          ],
        },
        {
          id: "travel-nurse",
          name: "Travel Nurse Services",
          description:
            "Professional nursing escort for local and international travel.",
          icon: FaPlane,
          features: [
            "Escort for clients travelling locally or abroad",
            "In-transit care (vital signs, medication, support)",
            "Holiday care assistance",
            "Medical condition management during travel",
            "Travel clearance documentation",
          ],
        },
        {
          id: "medication-delivery",
          name: "Medication Pickup & Delivery",
          description:
            "Convenient medication pickup and home delivery services.",
          icon: FaTruck,
          features: [
            "Pickup of prescriptions from hospital/pharmacy",
            "Scheduled delivery to home",
            "Ensuring correct medications as prescribed",
            "Medication information sheet",
            "Safe and confidential handling",
          ],
        },
        {
          id: "health-products",
          name: "Home Health Products",
          description:
            "Sales of medical equipment and health products for home use.",
          icon: FaShoppingCart,
          features: [
            "BP monitors, glucometers, thermometers",
            "Adult diapers and pads",
            "First aid kits",
            "Mobility aids (walkers, wheelchairs)",
            "Wound care materials",
            "Home safety equipment for elderly",
          ],
        },
      ],
    },
  };

  const getCareTypes = () => [
    {
      id: "visiting-care",
      name: "Visiting Care",
      description: "1-4 hour visits for specific care needs",
      icon: FaClock,
      duration: "1-4 hours",
    },
    {
      id: "overnight-care",
      name: "Overnight Care",
      description: "Evening to morning care and supervision",
      icon: FaMoon,
      duration: "8-12 hours",
    },
    {
      id: "respite-care",
      name: "Respite & Holiday Care",
      description: "Temporary care to relieve primary caregivers",
      icon: FaUserFriends,
      duration: "Flexible",
    },
    {
      id: "regular-visits",
      name: "Regular Home Visits",
      description: "Weekly or biweekly scheduled care visits",
      icon: FaCalendarAlt,
      duration: "Ongoing",
    },
  ];

  const handleBookService = (serviceId: string) => {
    navigate('/consultation');
  };

  const handleQuickBook = () => {
    navigate("/consultation");
  };

  return (
    <Box minH="100vh">
      {/* Hero Section with Background Image */}
      <Box
        minH="35vh"
        bg="brand.600" // Fallback color if image doesn't load
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
            {/* Breadcrumb - Enhanced */}
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
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink color="brand.100" fontWeight="600">
                  Our Services
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            {/* Header Section - Enhanced */}
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
                _before={{
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  borderRadius: "3xl",
                  padding: "1px",
                  background:
                    "linear-gradient(135deg, rgba(194, 24, 91, 0.3), rgba(123, 31, 162, 0.3))",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "xor",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                }}
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
                    Royal Health
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
                Comprehensive healthcare services delivered to your home by
                qualified professionals. From routine care to specialized
                treatments, we bring quality healthcare to you.
              </Text>

              {/* Service Value Highlight - Enhanced */}
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
                    Professional Healthcare at Home
                  </Badge>
                  <Text
                    fontSize="xl"
                    fontWeight="800"
                    color="white"
                    textAlign="center"
                    textShadow="1px 1px 2px rgba(0,0,0,0.5)"
                  >
                    Qualified Professionals • Comprehensive Care • Your Comfort
                  </Text>
                  <Text
                    fontSize="sm"
                    color="white"
                    textAlign="center"
                    fontWeight="500"
                    opacity={0.9}
                  >
                    Available 24/7 for emergencies • Flexible scheduling for all
                    services
                  </Text>
                </VStack>
              </Box>

              {/* Quick Action - Enhanced */}
              <Button
                size="lg"
                bg="white"
                color="brand.600"
                rightIcon={<FaCalendarAlt />}
                onClick={handleQuickBook}
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="700"
                borderRadius="xl"
                boxShadow="0 4px 14px rgba(0,0,0,0.3)"
                _hover={{
                  bg: "brand.50",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.2s ease-in-out"
              >
                Book Service Now
              </Button>

              {/* Stats - Enhanced */}
              <HStack spacing={8} pt={4}>
                {[
                  { number: "200+", label: "Satisfied Clients" },
                  { number: "25+", label: "Service Types" },
                  { number: "24/7", label: "Emergency Available" },
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
                    <Text
                      fontSize="sm"
                      color="white"
                      fontWeight="600"
                      opacity={0.9}
                    >
                      {stat.label}
                    </Text>
                  </VStack>
                ))}
              </HStack>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Main Content Section */}
      <Box bg="gray.50" py={4}>
        <Container maxW="7xl">
          <VStack spacing={6} align="stretch">
            {/* Service Categories Tabs - Enhanced */}
            <Tabs variant="enclosed" colorScheme="brand">
              <TabList
                flexWrap="wrap"
                justifyContent="center"
                bg="white"
                borderRadius="xl"
                p={2}
              >
                {Object.entries(serviceCategories).map(([key, category]) => (
                  <Tab
                    key={key}
                    fontWeight="600"
                    px={6}
                    py={3}
                    borderRadius="lg"
                    _selected={{
                      bgGradient: "linear(45deg, brand.500, purple.500)",
                      color: "white",
                      borderColor: "transparent",
                    }}
                    _hover={{
                      bg: "brand.50",
                      color: "brand.600",
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
                    <VStack spacing={8}>
                      {/* Category Header - Enhanced */}
                      <VStack spacing={4} textAlign="center">
                        <Box
                          w={20}
                          h={20}
                          bgGradient={`linear(45deg, ${category.color}.100, ${
                            category.color === "brand"
                              ? "purple"
                              : category.color
                          }.100)`}
                          borderRadius="2xl"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          border="3px solid"
                          borderColor={`${category.color}.200`}
                        >
                          <Icon
                            as={category.icon}
                            color={`${category.color}.600`}
                            fontSize="3xl"
                          />
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

                      {/* Services Grid - Enhanced */}
                      <SimpleGrid
                        columns={{ base: 1, md: 2, xl: 3 }}
                        spacing={6}
                        w="full"
                      >
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
                              transform: "translateY(-6px)",
                              boxShadow: "0 15px 35px rgba(194, 24, 91, 0.15)",
                              borderColor: "brand.300",
                            }}
                            position="relative"
                            h="full"
                          >
                            {/* Service Image */}
                            {service.image && (
                              <Box
                                w="full"
                                h="360px"
                                bgImage={`url(${service.image})`}
                                bgSize="cover"
                                bgPosition="center 30%"
                                position="relative"
                                _before={{
                                  content: '""',
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  bg: "linear-gradient(135deg, rgba(194, 24, 91, 0.15), rgba(123, 31, 162, 0.1))",
                                  zIndex: 1,
                                }}
                              >
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
                                    boxShadow="md"
                                  >
                                    Popular
                                  </Badge>
                                )}
                              </Box>
                            )}

                            <CardBody
                              p={6}
                              display="flex"
                              flexDirection="column"
                              h="full"
                            >
                              <VStack spacing={4} align="start" flex={1}>
                                {/* Icon & Service Name */}
                                <Flex
                                  justify="space-between"
                                  align="start"
                                  w="full"
                                >
                                  <Box
                                    w={14}
                                    h={14}
                                    bgGradient="linear(45deg, brand.50, purple.50)"
                                    borderRadius="xl"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    border="2px solid"
                                    borderColor="brand.200"
                                  >
                                    <Icon
                                      as={service.icon}
                                      color="brand.600"
                                      fontSize="xl"
                                    />
                                  </Box>
                                </Flex>

                                {/* Service Details - Enhanced */}
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

                                  {/* Service Features */}
                                  <VStack spacing={2} align="start" w="full">
                                    <Text
                                      fontSize="sm"
                                      fontWeight="700"
                                      color="brand.600"
                                    >
                                      Includes:
                                    </Text>
                                    {service.features
                                      .slice(0, 3)
                                      .map((feature, index) => (
                                        <HStack key={index} spacing={2}>
                                          <Icon
                                            as={FaCheckCircle}
                                            color="green.500"
                                            fontSize="sm"
                                          />
                                          <Text
                                            fontSize="xs"
                                            color="gray.600"
                                            fontWeight="500"
                                          >
                                            {feature}
                                          </Text>
                                        </HStack>
                                      ))}
                                    {service.features.length > 3 && (
                                      <Text
                                        fontSize="xs"
                                        color="brand.600"
                                        fontWeight="600"
                                      >
                                        +{service.features.length - 3} more
                                        services included
                                      </Text>
                                    )}
                                  </VStack>
                                </VStack>

                                <Divider borderColor="brand.100" />

                                {/* Book Service Button - Enhanced */}
                                <Button
                                  w="full"
                                  bgGradient="linear(45deg, brand.500, purple.500)"
                                  color="white"
                                  size="md"
                                  onClick={() => handleBookService(service.id)}
                                  fontWeight="700"
                                  rightIcon={<FaArrowRight />}
                                  borderRadius="lg"
                                  _hover={{
                                    bgGradient:
                                      "linear(45deg, brand.600, purple.600)",
                                    transform: "translateY(-1px)",
                                    boxShadow:
                                      "0 4px 12px rgba(194, 24, 91, 0.25)",
                                  }}
                                  _active={{
                                    transform: "translateY(0)",
                                  }}
                                  transition="all 0.2s ease-in-out"
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

            {/* Care Duration Options - Enhanced */}
            <Box
              bg="white"
              borderRadius="2xl"
              p={8}
              border="2px"
              borderColor="brand.100"
              boxShadow="0 4px 20px rgba(194, 24, 91, 0.05)"
            >
              <VStack spacing={6}>
                <VStack spacing={3} textAlign="center">
                  <Heading size="lg" color="gray.800" fontWeight="700">
                    Flexible Care Options
                  </Heading>
                  <Text color="gray.600" maxW="600px" fontWeight="500">
                    Choose the care schedule that works best for you and your
                    loved ones
                  </Text>
                </VStack>

                <SimpleGrid
                  columns={{ base: 1, md: 2, xl: 4 }}
                  spacing={6}
                  w="full"
                >
                  {getCareTypes().map((careType) => (
                    <Card
                      key={careType.id}
                      bg="gray.50"
                      borderRadius="xl"
                      p={6}
                      textAlign="center"
                      border="2px solid"
                      borderColor="transparent"
                      _hover={{
                        bg: "brand.50",
                        borderColor: "brand.200",
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 25px rgba(194, 24, 91, 0.1)",
                      }}
                      transition="all 0.3s"
                      cursor="pointer"
                      onClick={() => handleBookService(careType.id)}
                    >
                      <VStack spacing={4}>
                        <Box
                          w={12}
                          h={12}
                          bgGradient="linear(45deg, brand.100, purple.100)"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          border="2px solid"
                          borderColor="brand.200"
                        >
                          <Icon
                            as={careType.icon}
                            color="brand.600"
                            fontSize="xl"
                          />
                        </Box>
                        <VStack spacing={2}>
                          <Text fontWeight="700" color="gray.800">
                            {careType.name}
                          </Text>
                          <Text fontSize="sm" color="gray.600" fontWeight="500">
                            {careType.description}
                          </Text>
                          <Badge
                            bgGradient="linear(45deg, brand.500, purple.500)"
                            color="white"
                            variant="solid"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            fontWeight="600"
                          >
                            {careType.duration}
                          </Badge>
                        </VStack>
                      </VStack>
                    </Card>
                  ))}
                </SimpleGrid>
              </VStack>
            </Box>

            {/* Contact Section - Enhanced */}
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
                    Need Help Choosing the Right Service?
                  </Heading>
                  <Text color="gray.600" maxW="600px" fontWeight="500">
                    Our healthcare consultants are available 24/7 to help you
                    select the right service for your specific needs. Get
                    personalized recommendations today.
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
                  <Button
                    leftIcon={<FaCalendarAlt />}
                    color="purple.600"
                    borderColor="purple.500"
                    variant="outline"
                    size="lg"
                    fontWeight="600"
                    borderRadius="xl"
                    borderWidth="2px"
                    onClick={handleQuickBook}
                    _hover={{
                      bg: "purple.50",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    Quick Booking
                  </Button>
                </HStack>
              </VStack>
            </Box>

            {/* How It Works - Enhanced */}
            <Box
              bg="white"
              borderRadius="2xl"
              p={8}
              border="2px"
              borderColor="brand.100"
              boxShadow="0 4px 20px rgba(194, 24, 91, 0.05)"
            >
              <VStack spacing={6}>
                <Heading
                  size="lg"
                  color="gray.800"
                  textAlign="center"
                  fontWeight="700"
                >
                  How Our Healthcare Services Work
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                  {[
                    {
                      step: "1",
                      title: "Book Your Service",
                      description:
                        "Choose your service type and preferred schedule online or by phone",
                      icon: FaCalendarAlt,
                      color: "brand",
                    },
                    {
                      step: "2",
                      title: "Professional Assignment",
                      description:
                        "We match you with a qualified healthcare professional",
                      icon: FaUserMd,
                      color: "green",
                    },
                    {
                      step: "3",
                      title: "Service Delivery",
                      description:
                        "Professional arrives at your location to provide quality care",
                      icon: FaHome,
                      color: "purple",
                    },
                    {
                      step: "4",
                      title: "Ongoing Support",
                      description:
                        "Continuous monitoring and support with detailed care reports",
                      icon: FaClipboardCheck,
                      color: "orange",
                    },
                  ].map((item, index) => (
                    <VStack key={index} spacing={4} textAlign="center">
                      <Box
                        w={16}
                        h={16}
                        bgGradient={`linear(45deg, ${item.color}.100, ${item.color}.200)`}
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        border="3px solid"
                        borderColor={`${item.color}.300`}
                      >
                        <Icon
                          as={item.icon}
                          color={`${item.color}.600`}
                          fontSize="2xl"
                        />
                        <Badge
                          position="absolute"
                          top="-8px"
                          right="-8px"
                          bgGradient="linear(45deg, brand.500, purple.500)"
                          color="white"
                          borderRadius="full"
                          w={8}
                          h={8}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="sm"
                          fontWeight="800"
                          boxShadow="md"
                        >
                          {item.step}
                        </Badge>
                      </Box>
                      <VStack spacing={2}>
                        <Text fontWeight="700" color="gray.800">
                          {item.title}
                        </Text>
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          textAlign="center"
                          fontWeight="500"
                        >
                          {item.description}
                        </Text>
                      </VStack>
                    </VStack>
                  ))}
                </SimpleGrid>
              </VStack>
            </Box>

            {/* Emergency Notice - Enhanced */}
            <Box
              bg="red.50"
              border="2px solid"
              borderColor="red.300"
              borderRadius="xl"
              p={6}
              boxShadow="0 4px 15px rgba(220, 38, 38, 0.1)"
            >
              <HStack spacing={4} align="start">
                <Icon as={FaAmbulance} color="red.500" fontSize="2xl" mt={1} />
                <VStack spacing={2} align="start">
                  <Text fontWeight="800" color="red.700" fontSize="lg">
                    Medical Emergency?
                  </Text>
                  <Text
                    fontSize="sm"
                    color="red.600"
                    lineHeight="1.5"
                    fontWeight="500"
                  >
                    For life-threatening emergencies, please go to the nearest
                    hospital immediately. Our services are for non-emergency
                    healthcare needs.
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Services;
