// src/pages/About.tsx - Comprehensive About Page with Enhanced Colors
import React from 'react';
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
  Badge,
  Icon,
  Button,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  Divider,
  List,
  ListItem,
  ListIcon,
  Flex,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import {
  FaHeart,
  FaUserMd,
  FaHome,
  FaShieldAlt,
  FaPhone,
  FaCheck,
  FaAward,
  FaUsers,
  FaStethoscope,
  FaGraduationCap,
  FaLightbulb,
  FaStar,
  FaEye,
  FaWhatsapp,
  FaEnvelope,
  FaClipboardList,
  FaCalendarAlt,
  FaBaby,
  FaPills,
  FaBandAid,
  FaHeartbeat,
  FaHandsHelping,
  FaUserNurse,
  FaBuilding,
  FaUserFriends
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const sectionBg = useColorModeValue('gray.50', 'gray.800');
  
  const stats = [
    { label: 'Happy Clients', value: '200+', icon: FaUsers, color: 'brand' },
    { label: 'Healthcare Professionals', value: '50+', icon: FaUserMd, color: 'green' },
    { label: 'Years of Experience', value: '5+', icon: FaAward, color: 'purple' },
    { label: 'Success Rate', value: '98%', icon: FaStar, color: 'orange' }
  ];

  const services = [
    {
      title: 'Home Nursing',
      description: 'Professional nursing care in the comfort of your home',
      icon: FaUserNurse,
      color: 'brand'
    },
    {
      title: 'Postnatal & Mother-Baby Care',
      description: 'Specialized care for new mothers and their babies',
      icon: FaBaby,
      color: 'purple'
    },
    {
      title: 'Medication Management',
      description: 'Safe and proper administration of medications',
      icon: FaPills,
      color: 'green'
    },
    {
      title: 'Wound Dressing',
      description: 'Expert wound care and dressing services',
      icon: FaBandAid,
      color: 'red'
    },
    {
      title: 'Health Screenings',
      description: 'Comprehensive health assessments and monitoring',
      icon: FaHeartbeat,
      color: 'purple'
    },
    {
      title: 'Physiotherapy',
      description: 'Rehabilitation and physical therapy services',
      icon: FaHandsHelping,
      color: 'orange'
    },
    {
      title: 'Caregiver Support',
      description: 'Training and support for family caregivers',
      icon: FaUserFriends,
      color: 'teal'
    }
  ];

  const values = [
    {
      title: 'Professionalism',
      description: 'We consistently deliver ethical and reliable nursing care with the highest standards.',
      icon: FaAward,
      color: 'brand'
    },
    {
      title: 'Integrity',
      description: 'We practice honesty and transparency in all our interactions with clients and families.',
      icon: FaShieldAlt,
      color: 'green'
    },
    {
      title: 'Compassionate Care',
      description: 'We care genuinely for every client, treating them with empathy and understanding.',
      icon: FaHeart,
      color: 'red'
    },
    {
      title: 'Knowledge',
      description: 'We are committed to continuous improvement and learning to better serve our clients.',
      icon: FaGraduationCap,
      color: 'purple'
    },
    {
      title: 'Understanding',
      description: 'We take the time to truly listen and respond to the unique needs of our clients.',
      icon: FaLightbulb,
      color: 'yellow'
    },
    {
      title: 'Service Excellence',
      description: 'We are in business to exceed your expectations and deliver outstanding care.',
      icon: FaStar,
      color: 'orange'
    }
  ];

  const careLocations = [
    { name: 'Your Home', icon: FaHome, description: 'Comfort and familiarity of your own space' },
    { name: 'Workplace', icon: FaBuilding, description: 'On-site care for working professionals' },
    { name: 'Community Centers', icon: FaUsers, description: 'Community-based healthcare services' }
  ];

  const process = [
    {
      step: '01',
      title: 'Initial Contact',
      description: 'Reach out to us through phone, WhatsApp, or email to schedule your assessment.',
      icon: FaPhone
    },
    {
      step: '02',
      title: 'Professional Assessment',
      description: 'Our trained professionals conduct a comprehensive evaluation of your healthcare needs.',
      icon: FaUserMd
    },
    {
      step: '03',
      title: 'Personalized Report',
      description: 'Receive a detailed Client Assessment Report with tailored recommendations.',
      icon: FaClipboardList
    },
    {
      step: '04',
      title: 'Service Begins',
      description: 'Choose your preferred package and begin receiving professional healthcare at home.',
      icon: FaHome
    }
  ];

  return (
    <Box bg={bg} minH="100vh">
      {/* Enhanced CSS Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes pulse-glow {
            0%, 100% { 
              box-shadow: 0 8px 25px rgba(194, 24, 91, 0.25);
            }
            50% { 
              box-shadow: 0 12px 35px rgba(194, 24, 91, 0.4);
            }
          }
          
          @keyframes scale-in {
            0% {
              transform: scale(0.95);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          .animate-on-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .animate-on-hover:hover {
            animation: pulse-glow 2s infinite;
          }
        `}
      </style>

      {/* Hero Section - Enhanced */}
      <Box 
        bgGradient="linear(135deg, brand.500 0%, purple.500 50%, brand.600 100%)" 
        color="white" 
        py={{ base: 20, md: 28 }}
        position="relative"
        overflow="hidden"
      >
        {/* Background Decorative Elements */}
        <Box
          position="absolute"
          top="10%"
          right="10%"
          w="150px"
          h="150px"
          borderRadius="full"
          bg="whiteAlpha.200"
          filter="blur(60px)"
        />
        <Box
          position="absolute"
          bottom="20%"
          left="15%"
          w="120px"
          h="120px"
          borderRadius="full"
          bg="whiteAlpha.300"
          filter="blur(50px)"
        />
        
        <Container maxW="6xl" position="relative">
          <VStack spacing={8} textAlign="center">
            <Badge 
              bgGradient="linear(45deg, whiteAlpha.300, whiteAlpha.400)"
              color="brand.600" 
              px={6} 
              py={3} 
              fontSize="md" 
              borderRadius="full"
              backdropFilter="blur(10px)"
              border="1px solid"
              borderColor="whiteAlpha.300"
              fontWeight="700"
              boxShadow="0 8px 25px rgba(0, 0, 0, 0.1)"
            >
              Professional Healthcare Since 2020
            </Badge>
            <Heading 
              size={{ base: "xl", md: "3xl" }} 
              fontWeight="900"
              lineHeight="1.1"
              maxW="5xl"
            >
              About{' '}
              <Text
                as="span"
                textShadow="0 0 30px rgba(255, 255, 255, 0.5)"
              >
                Royal Health Consult
              </Text>
              <br />
              <Text as="span" fontSize={{ base: "xl", md: "2xl" }} opacity="0.9">
                (RHC)
              </Text>
            </Heading>
            <Text 
              fontSize={{ base: "lg", md: "xl" }} 
              maxW="4xl" 
              opacity={0.95}
              lineHeight="1.8"
              fontWeight="500"
            >
              A professional nursing and healthcare service provider dedicated to delivering 
              compassionate, reliable, and family-centered care. We are your partner in wellness and care.
            </Text>
            <HStack spacing={6} flexWrap="wrap" justify="center">
              <Button 
                size="xl" 
                bg="white" 
                color="brand.600" 
                _hover={{ 
                  bg: "gray.50", 
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 35px rgba(0, 0, 0, 0.15)"
                }}
                _focus={{
                  boxShadow: "0 0 0 3px rgba(194, 24, 91, 0.5)",
                  outline: "none"
                }}
                leftIcon={<FaCalendarAlt />}
                boxShadow="0 8px 25px rgba(0, 0, 0, 0.1)"
                transition="all 0.3s ease-in-out"
                onClick={() => navigate('/booking')}
                borderRadius="xl"
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="800"
                aria-label="Book a healthcare assessment appointment"
                className="animate-on-hover"
              >
                Book Assessment
              </Button>
              <Button 
                size="xl" 
                variant="outline" 
                borderColor="white" 
                borderWidth="2px"
                color="white"
                _hover={{ 
                  bg: "whiteAlpha.200", 
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 25px rgba(255, 255, 255, 0.2)"
                }}
                _focus={{
                  boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.5)",
                  outline: "none"
                }}
                transition="all 0.3s ease-in-out"
                onClick={() => navigate('/contact')}
                borderRadius="xl"
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="700"
                aria-label="Contact Royal Health Consult"
              >
                Contact Us
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      <Container maxW="6xl" py={{ base: 12, md: 16, lg: 20 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 16, md: 18, lg: 20 }} align="stretch">

          {/* Company Introduction - Enhanced */}
          <Box textAlign="center">
            <VStack spacing={8}>
              <Heading 
                size="2xl" 
                color="gray.800"
                fontWeight="800"
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
                  Who We Are
                </Text>
              </Heading>
              <VStack spacing={6} maxW="5xl">
                <Text fontSize="xl" lineHeight="tall" color="gray.700" fontWeight="500">
                  <strong>Royal Health Consult (RHC)</strong> is a professional nursing and healthcare service 
                  provider dedicated to delivering compassionate, reliable, and family-centered care since 2020.
                </Text>
                <Text fontSize="xl" lineHeight="tall" color="gray.700" fontWeight="500">
                  We support individuals and families by offering personalized services that promote health, 
                  dignity, and quality of life.
                </Text>
                <Text fontSize="xl" lineHeight="tall" color="gray.700" fontWeight="500">
                  At RHC, we understand that every client is unique. That's why we provide tailored healthcare 
                  solutions ranging from home nursing, postnatal and mother-baby care, medication management, 
                  wound dressing, health screenings, physiotherapy, and caregiver support.
                </Text>
                <Text fontSize="xl" lineHeight="tall" color="gray.700" fontWeight="500">
                  Whether it's in the comfort of your home, workplace, or community, our team ensures care is 
                  delivered with professionalism, integrity, and compassion.
                </Text>
                <Box 
                  bgGradient="linear(135deg, brand.50, purple.50)" 
                  p={8} 
                  borderRadius="2xl" 
                  borderLeft="4px solid" 
                  borderLeftColor="brand.500"
                  boxShadow="0 8px 25px rgba(194, 24, 91, 0.1)"
                  border="1px solid"
                  borderColor="brand.200"
                >
                  <Text fontSize="xl" lineHeight="tall" color="gray.700" fontStyle="italic" fontWeight="600">
                    We are committed to redefining how families experience home care services. With a strong 
                    foundation built on knowledge, service excellence, and trust, Royal Health Consult is more 
                    than a healthcare provider — <strong>we are your partner in wellness and care.</strong>
                  </Text>
                </Box>
              </VStack>
            </VStack>
          </Box>

          {/* Our Services - Enhanced */}
          <Box>
            <VStack spacing={12} textAlign="center">
              <VStack spacing={4}>
                <Heading 
                  size="2xl" 
                  color="gray.800"
                  fontWeight="800"
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
                    Our Comprehensive
                  </Text>{' '}
                  Services
                </Heading>
                <Text fontSize="xl" color="gray.600" maxW="3xl" fontWeight="500">
                  Tailored healthcare solutions designed to meet your unique needs and promote quality of life
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8, lg: 10 }}>
                {services.map((service, index) => (
                  <Card 
                    key={index} 
                    bg="white" 
                    shadow="lg" 
                    borderRadius="2xl"
                    border="2px solid"
                    borderColor="gray.100"
                    transition="all 0.3s ease-in-out"
                    _hover={{ 
                      transform: "translateY(-6px)", 
                      shadow: "0 15px 35px rgba(194, 24, 91, 0.15)",
                      borderColor: service.color === 'brand' ? 'brand.300' : `${service.color}.300`
                    }}
                  >
                    <CardBody p={8} textAlign="center">
                      <VStack spacing={6}>
                        <Box 
                          bgGradient={service.color === 'brand' 
                            ? "linear(45deg, brand.100, purple.100)" 
                            : `linear(45deg, ${service.color}.100, ${service.color}.200)`
                          } 
                          p={5} 
                          borderRadius="2xl"
                          border="2px solid"
                          borderColor={service.color === 'brand' ? 'brand.200' : `${service.color}.200`}
                        >
                          <Icon 
                            as={service.icon} 
                            fontSize="3xl" 
                            color={service.color === 'brand' ? 'brand.600' : `${service.color}.600`} 
                          />
                        </Box>
                        <VStack spacing={3}>
                          <Heading size="md" color="gray.800" fontWeight="700">
                            {service.title}
                          </Heading>
                          <Text color="gray.600" lineHeight="tall" fontSize="md" fontWeight="500">
                            {service.description}
                          </Text>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Where We Serve - Enhanced */}
          <Box 
            bgGradient="linear(135deg, brand.50, purple.50)" 
            borderRadius="3xl" 
            p={12}
            border="2px solid"
            borderColor="brand.200"
            boxShadow="0 10px 30px rgba(194, 24, 91, 0.1)"
          >
            <VStack spacing={12} textAlign="center">
              <VStack spacing={4}>
                <Heading 
                  size="2xl" 
                  color="gray.800"
                  fontWeight="800"
                >
                  Where We Provide Care
                </Heading>
                <Text fontSize="xl" color="gray.600" maxW="3xl" fontWeight="500">
                  Professional healthcare services delivered wherever you need them most
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} maxW="4xl">
                {careLocations.map((location, index) => (
                  <Card 
                    key={index} 
                    bg="white" 
                    shadow="md" 
                    borderRadius="2xl" 
                    border="2px solid" 
                    borderColor="brand.200"
                    _hover={{
                      transform: "translateY(-4px)",
                      shadow: "0 12px 30px rgba(194, 24, 91, 0.15)"
                    }}
                    transition="all 0.3s ease-in-out"
                  >
                    <CardBody textAlign="center" py={8}>
                      <VStack spacing={4}>
                        <Box 
                          bgGradient="linear(45deg, brand.100, purple.100)" 
                          p={5} 
                          borderRadius="2xl"
                          border="2px solid"
                          borderColor="brand.200"
                        >
                          <Icon as={location.icon} fontSize="3xl" color="brand.600" />
                        </Box>
                        <VStack spacing={2}>
                          <Heading size="md" color="gray.800" fontWeight="700">
                            {location.name}
                          </Heading>
                          <Text fontSize="md" color="gray.600" fontWeight="500">
                            {location.description}
                          </Text>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>

              <Box bg="white" p={8} borderRadius="2xl" maxW="4xl" border="2px solid" borderColor="brand.200">
                <Text fontSize="xl" color="gray.700" textAlign="center" lineHeight="tall" fontWeight="600">
                  <strong>Our commitment:</strong> Whether it's in the comfort of your home, workplace, 
                  or community, our team ensures care is delivered with professionalism, integrity, and compassion.
                </Text>
              </Box>
            </VStack>
          </Box>

          {/* Mission & Vision - Enhanced */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12}>
            <Card 
              bg={cardBg} 
              shadow="xl" 
              borderRadius="3xl" 
              border="2px solid"
              borderColor="brand.200"
              transition="all 0.3s ease-in-out"
              _hover={{ 
                transform: "translateY(-6px)", 
                shadow: "0 20px 40px rgba(194, 24, 91, 0.15)" 
              }}
            >
              <CardBody p={10}>
                <VStack spacing={6} align="start">
                  <HStack spacing={4}>
                    <Box 
                      bgGradient="linear(45deg, brand.100, purple.100)" 
                      p={4} 
                      borderRadius="2xl"
                      border="2px solid"
                      borderColor="brand.200"
                    >
                      <Icon as={FaStethoscope} fontSize="3xl" color="brand.600" />
                    </Box>
                    <Heading size="xl" color="gray.800" fontWeight="800">
                      Our Mission
                    </Heading>
                  </HStack>
                  <Text fontSize="xl" lineHeight="tall" color="gray.600" fontWeight="500">
                    To deliver compassionate, reliable, and family-centered healthcare services that support 
                    individuals and families by offering personalized care solutions that promote health, 
                    dignity, and quality of life since 2020.
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card 
              bg={cardBg} 
              shadow="xl" 
              borderRadius="3xl" 
              border="2px solid"
              borderColor="purple.200"
              transition="all 0.3s ease-in-out"
              _hover={{ 
                transform: "translateY(-6px)", 
                shadow: "0 20px 40px rgba(123, 31, 162, 0.15)" 
              }}
            >
              <CardBody p={10}>
                <VStack spacing={6} align="start">
                  <HStack spacing={4}>
                    <Box 
                      bgGradient="linear(45deg, purple.100, brand.100)" 
                      p={4} 
                      borderRadius="2xl"
                      border="2px solid"
                      borderColor="purple.200"
                    >
                      <Icon as={FaEye} fontSize="3xl" color="purple.600" />
                    </Box>
                    <Heading size="xl" color="gray.800" fontWeight="800">
                      Our Vision
                    </Heading>
                  </HStack>
                  <Text fontSize="xl" lineHeight="tall" color="gray.600" fontWeight="500">
                    To be the trusted provider for compassionate care and excellent home care service, 
                    redefining how families experience professional healthcare in their homes and communities.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Statistics Section - Enhanced */}
          <Box 
            bgGradient="linear(135deg, purple.50, brand.50)" 
            borderRadius="3xl" 
            p={12}
            border="2px solid"
            borderColor="purple.200"
            boxShadow="0 10px 30px rgba(123, 31, 162, 0.1)"
          >
            <VStack spacing={12} textAlign="center">
              <VStack spacing={4}>
                <Heading 
                  size="2xl" 
                  color="gray.800"
                  fontWeight="800"
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
                    Our Impact
                  </Text>{' '}
                  in Numbers
                </Heading>
                <Text fontSize="xl" color="gray.600" maxW="3xl" fontWeight="500">
                  Building trust through professional excellence and compassionate care since 2020
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 4, md: 6, lg: 8 }} w="full">
                {stats.map((stat, index) => (
                  <Card 
                    key={index} 
                    bg="white" 
                    shadow="lg" 
                    borderRadius="2xl" 
                    border="2px solid" 
                    borderColor={stat.color === 'brand' ? 'brand.200' : `${stat.color}.200`}
                    _hover={{
                      transform: "translateY(-4px)",
                      shadow: stat.color === 'brand' 
                        ? "0 15px 35px rgba(194, 24, 91, 0.15)"
                        : `0 15px 35px rgba(0, 0, 0, 0.1)`
                    }}
                    transition="all 0.3s ease-in-out"
                  >
                    <CardBody textAlign="center" py={8}>
                      <VStack spacing={4}>
                        <Box 
                          bgGradient={stat.color === 'brand'
                            ? "linear(45deg, brand.100, purple.100)"
                            : `linear(45deg, ${stat.color}.100, ${stat.color}.200)`
                          } 
                          p={5} 
                          borderRadius="2xl"
                          border="2px solid"
                          borderColor={stat.color === 'brand' ? 'brand.200' : `${stat.color}.200`}
                        >
                          <Icon 
                            as={stat.icon} 
                            fontSize="3xl" 
                            color={stat.color === 'brand' ? 'brand.600' : `${stat.color}.600`} 
                          />
                        </Box>
                        <VStack spacing={1}>
                          <Text 
                            fontSize="4xl" 
                            fontWeight="900" 
                            bgGradient={stat.color === 'brand'
                              ? "linear(45deg, brand.500, purple.500)"
                              : `linear(45deg, ${stat.color}.500, ${stat.color}.600)`
                            }
                            bgClip="text"
                            sx={{
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {stat.value}
                          </Text>
                          <Text fontSize="md" color="gray.600" fontWeight="700">
                            {stat.label}
                          </Text>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>

          {/* How We Work - Enhanced */}
          <VStack spacing={12} textAlign="center">
            <VStack spacing={4}>
              <Heading 
                size="2xl" 
                color="gray.800"
                fontWeight="800"
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
                  How We Work
                </Text>
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="3xl" fontWeight="500">
                Our simple, professional process to provide you with personalized healthcare solutions
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
              {process.map((step, index) => (
                <Card 
                  key={index} 
                  bg="white" 
                  shadow="lg" 
                  borderRadius="2xl" 
                  border="2px solid"
                  borderColor="brand.200"
                  transition="all 0.3s ease-in-out"
                  _hover={{ 
                    transform: "translateY(-4px)", 
                    shadow: "0 15px 35px rgba(194, 24, 91, 0.15)" 
                  }}
                >
                  <CardBody p={8}>
                    <HStack spacing={6} align="start">
                      <VStack spacing={0}>
                        <Box 
                          bgGradient="linear(45deg, brand.500, purple.500)" 
                          color="white" 
                          w="60px" 
                          h="60px" 
                          borderRadius="2xl" 
                          display="flex" 
                          alignItems="center" 
                          justifyContent="center"
                          fontWeight="900"
                          fontSize="xl"
                          boxShadow="0 8px 25px rgba(194, 24, 91, 0.3)"
                        >
                          {step.step}
                        </Box>
                        <Box 
                          bgGradient="linear(45deg, brand.100, purple.100)" 
                          p={4} 
                          borderRadius="2xl" 
                          mt={4}
                          border="2px solid"
                          borderColor="brand.200"
                        >
                          <Icon as={step.icon} fontSize="2xl" color="brand.600" />
                        </Box>
                      </VStack>
                      <VStack spacing={3} align="start" flex={1}>
                        <Heading size="lg" color="gray.800" fontWeight="800">
                          {step.title}
                        </Heading>
                        <Text color="gray.600" lineHeight="tall" fontSize="lg" fontWeight="500">
                          {step.description}
                        </Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Core Values - Enhanced */}
          <VStack spacing={12} textAlign="center">
            <VStack spacing={4}>
              <Heading 
                size="2xl" 
                color="gray.800"
                fontWeight="800"
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
                  Our Core Values
                </Text>
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="3xl" fontWeight="500">
                The foundation of knowledge, service excellence, and trust that guides our every action
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {values.map((value, index) => (
                <Card 
                  key={index} 
                  bg="white" 
                  shadow="lg" 
                  borderRadius="2xl"
                  border="2px solid"
                  borderColor="gray.100"
                  transition="all 0.3s ease-in-out"
                  _hover={{ 
                    transform: "translateY(-6px)", 
                    shadow: "0 15px 35px rgba(194, 24, 91, 0.15)",
                    borderColor: value.color === 'brand' ? 'brand.300' : `${value.color}.300`
                  }}
                >
                  <CardBody p={8} textAlign="center">
                    <VStack spacing={6}>
                      <Box 
                        bgGradient={value.color === 'brand' 
                          ? "linear(45deg, brand.100, purple.100)" 
                          : `linear(45deg, ${value.color}.100, ${value.color}.200)`
                        } 
                        p={5} 
                        borderRadius="2xl"
                        border="2px solid"
                        borderColor={value.color === 'brand' ? 'brand.200' : `${value.color}.200`}
                      >
                        <Icon 
                          as={value.icon} 
                          fontSize="3xl" 
                          color={value.color === 'brand' ? 'brand.600' : `${value.color}.600`} 
                        />
                      </Box>
                      <VStack spacing={3}>
                        <Heading size="md" color="gray.800" fontWeight="700">
                          {value.title}
                        </Heading>
                        <Text color="gray.600" lineHeight="tall" fontSize="md" fontWeight="500">
                          {value.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Call to Action - Enhanced */}
          <Box 
            bgGradient="linear(135deg, brand.50 0%, purple.50 50%, brand.25 100%)" 
            borderRadius="3xl" 
            p={12} 
            textAlign="center"
            border="2px solid"
            borderColor="brand.200"
            boxShadow="0 15px 40px rgba(194, 24, 91, 0.1)"
            position="relative"
            overflow="hidden"
          >
            {/* Background Decorative Elements */}
            <Box
              position="absolute"
              top="20%"
              right="10%"
              w="100px"
              h="100px"
              borderRadius="full"
              bgGradient="linear(45deg, brand.200, purple.200)"
              opacity="0.3"
              filter="blur(40px)"
            />
            <Box
              position="absolute"
              bottom="20%"
              left="15%"
              w="80px"
              h="80px"
              borderRadius="full"
              bgGradient="linear(45deg, purple.200, brand.200)"
              opacity="0.4"
              filter="blur(30px)"
            />

            <VStack spacing={8} position="relative" zIndex={1}>
              <VStack spacing={6}>
                <Heading 
                  size="2xl" 
                  color="gray.800"
                  fontWeight="800"
                >
                  Experience the{' '}
                  <Text
                    as="span"
                    bgGradient="linear(45deg, brand.500, purple.500)"
                    bgClip="text"
                    sx={{
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    RHC Difference
                  </Text>
                </Heading>
                <Text fontSize="xl" maxW="4xl" color="gray.600" fontWeight="500" lineHeight="tall">
                  Join hundreds of satisfied families who have experienced our personalized, 
                  professional healthcare services. We understand that every client is unique, 
                  and we're here to be your partner in wellness and care.
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} maxW="5xl">
                <Button
                  size="xl"
                  leftIcon={<FaPhone />}
                  bgGradient="linear(45deg, brand.500, purple.500)"
                  color="white"
                  variant="solid"
                  _hover={{ 
                    bgGradient: "linear(45deg, brand.600, purple.600)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 35px rgba(194, 24, 91, 0.3)"
                  }}
                  _focus={{
                    boxShadow: "0 0 0 3px rgba(194, 24, 91, 0.5)",
                    outline: "none"
                  }}
                  transition="all 0.3s ease-in-out"
                  borderRadius="xl"
                  py={6}
                  px={8}
                  fontSize="lg"
                  fontWeight="800"
                  boxShadow="0 8px 25px rgba(194, 24, 91, 0.25)"
                  aria-label="Call Royal Health Consult now"
                  className="animate-on-hover"
                >
                  Call Us Today
                </Button>
                <Button
                  size="xl"
                  leftIcon={<FaWhatsapp />}
                  bg="#25D366"
                  color="white"
                  variant="solid"
                  _hover={{ 
                    bg: "#128C7E",
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 35px rgba(37, 211, 102, 0.4)"
                  }}
                  _focus={{
                    boxShadow: "0 0 0 3px rgba(37, 211, 102, 0.5)",
                    outline: "none"
                  }}
                  transition="all 0.3s ease-in-out"
                  borderRadius="xl"
                  py={6}
                  px={8}
                  fontSize="lg"
                  fontWeight="800"
                  boxShadow="0 8px 25px rgba(37, 211, 102, 0.3)"
                  aria-label="Contact us via WhatsApp"
                  className="animate-on-hover"
                >
                  WhatsApp Us
                </Button>
                <Button
                  size="xl"
                  leftIcon={<FaCalendarAlt />}
                  bg="purple.500"
                  color="white"
                  variant="solid"
                  _hover={{ 
                    bg: "purple.600",
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 35px rgba(147, 51, 234, 0.3)"
                  }}
                  _focus={{
                    boxShadow: "0 0 0 3px rgba(147, 51, 234, 0.5)",
                    outline: "none"
                  }}
                  transition="all 0.3s ease-in-out"
                  onClick={() => navigate('/booking')}
                  borderRadius="xl"
                  py={6}
                  px={8}
                  fontSize="lg"
                  fontWeight="800"
                  boxShadow="0 8px 25px rgba(147, 51, 234, 0.25)"
                  aria-label="Book a healthcare assessment appointment"
                  className="animate-on-hover"
                >
                  Book Assessment
                </Button>
              </SimpleGrid>

              {/* Trust Badge */}
              <Badge
                bgGradient="linear(45deg, brand.500, purple.500)"
                color="white"
                px={6}
                py={2}
                borderRadius="full"
                fontSize="md"
                fontWeight="800"
                textTransform="uppercase"
                letterSpacing="wide"
                boxShadow="0 4px 15px rgba(194, 24, 91, 0.3)"
              >
                Trusted by 200+ Families Since 2020
              </Badge>
            </VStack>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
};

export default About;