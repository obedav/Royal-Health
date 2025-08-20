// src/pages/About.tsx - Comprehensive About Page with All Company Information
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
    { label: 'Happy Clients', value: '500+', icon: FaUsers, color: 'blue' },
    { label: 'Healthcare Professionals', value: '50+', icon: FaUserMd, color: 'green' },
    { label: 'Years of Experience', value: '5+', icon: FaAward, color: 'purple' },
    { label: 'Success Rate', value: '98%', icon: FaStar, color: 'orange' }
  ];

  const services = [
    {
      title: 'Home Nursing',
      description: 'Professional nursing care in the comfort of your home',
      icon: FaUserNurse,
      color: 'blue'
    },
    {
      title: 'Postnatal & Mother-Baby Care',
      description: 'Specialized care for new mothers and their babies',
      icon: FaBaby,
      color: 'pink'
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
      color: 'blue'
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
      {/* Hero Section */}
      <Box 
        bgGradient="linear(135deg, pink.500 0%, pink.600 50%, pink.700 100%)" 
        color="white" 
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity={0.1}
          background="repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)"
        />
        <Container maxW="6xl" position="relative">
          <VStack spacing={8} textAlign="center">
            <Badge 
              bg="whiteAlpha.200" 
              color="white" 
              px={4} 
              py={2} 
              fontSize="sm" 
              borderRadius="full"
              backdropFilter="blur(10px)"
            >
              Professional Healthcare Since 2020
            </Badge>
            <Heading 
              size={{ base: "xl", md: "2xl" }} 
              fontWeight="700"
              lineHeight="1.2"
              maxW="4xl"
            >
              About Royal Health Consult (RHC)
            </Heading>
            <Text 
              fontSize={{ base: "lg", md: "xl" }} 
              maxW="4xl" 
              opacity={0.9}
              lineHeight="1.8"
            >
              A professional nursing and healthcare service provider dedicated to delivering 
              compassionate, reliable, and family-centered care. We are your partner in wellness and care.
            </Text>
            <HStack spacing={4}>
              <Button 
                size="lg" 
                bg="white" 
                color="pink.600" 
                _hover={{ bg: "gray.50", transform: "translateY(-2px)" }}
                leftIcon={<FaCalendarAlt />}
                boxShadow="xl"
                transition="all 0.3s"
                onClick={() => navigate('/booking')}
              >
                Book Assessment
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                borderColor="white" 
                color="white"
                _hover={{ bg: "whiteAlpha.200", transform: "translateY(-2px)" }}
                transition="all 0.3s"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      <Container maxW="6xl" py={20}>
        <VStack spacing={20} align="stretch">

          {/* Company Introduction */}
          <Box textAlign="center">
            <VStack spacing={8}>
              <Heading size="xl" color="gray.800">Who We Are</Heading>
              <VStack spacing={6} maxW="5xl">
                <Text fontSize="lg" lineHeight="tall" color="gray.700">
                  <strong>Royal Health Consult (RHC)</strong> is a professional nursing and healthcare service 
                  provider dedicated to delivering compassionate, reliable, and family-centered care since 2020.
                </Text>
                <Text fontSize="lg" lineHeight="tall" color="gray.700">
                  We support individuals and families by offering personalized services that promote health, 
                  dignity, and quality of life.
                </Text>
                <Text fontSize="lg" lineHeight="tall" color="gray.700">
                  At RHC, we understand that every client is unique. That's why we provide tailored healthcare 
                  solutions ranging from home nursing, postnatal and mother-baby care, medication management, 
                  wound dressing, health screenings, physiotherapy, and caregiver support.
                </Text>
                <Text fontSize="lg" lineHeight="tall" color="gray.700">
                  Whether it's in the comfort of your home, workplace, or community, our team ensures care is 
                  delivered with professionalism, integrity, and compassion.
                </Text>
                <Box bg="pink.50" p={6} borderRadius="xl" borderLeft="4px solid" borderLeftColor="pink.500">
                  <Text fontSize="lg" lineHeight="tall" color="gray.700" fontStyle="italic">
                    We are committed to redefining how families experience home care services. With a strong 
                    foundation built on knowledge, service excellence, and trust, Royal Health Consult is more 
                    than a healthcare provider — <strong>we are your partner in wellness and care.</strong>
                  </Text>
                </Box>
              </VStack>
            </VStack>
          </Box>

          {/* Our Services - Detailed */}
          <Box>
            <VStack spacing={12} textAlign="center">
              <VStack spacing={4}>
                <Heading size="xl" color="gray.800">Our Comprehensive Services</Heading>
                <Text fontSize="lg" color="gray.600" maxW="3xl">
                  Tailored healthcare solutions designed to meet your unique needs and promote quality of life
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                {services.map((service, index) => (
                  <Card 
                    key={index} 
                    bg="white" 
                    shadow="lg" 
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.100"
                    transition="all 0.3s"
                    _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
                  >
                    <CardBody p={8} textAlign="center">
                      <VStack spacing={6}>
                        <Box bg={`${service.color}.100`} p={4} borderRadius="xl">
                          <Icon as={service.icon} fontSize="2xl" color={`${service.color}.600`} />
                        </Box>
                        <VStack spacing={3}>
                          <Heading size="md" color="gray.800">
                            {service.title}
                          </Heading>
                          <Text color="gray.600" lineHeight="tall" fontSize="sm">
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

          {/* Where We Serve */}
          <Box bg={sectionBg} borderRadius="3xl" p={12}>
            <VStack spacing={12} textAlign="center">
              <VStack spacing={4}>
                <Heading size="xl" color="gray.800">Where We Provide Care</Heading>
                <Text fontSize="lg" color="gray.600" maxW="3xl">
                  Professional healthcare services delivered wherever you need them most
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} maxW="4xl">
                {careLocations.map((location, index) => (
                  <Card key={index} bg="white" shadow="md" borderRadius="xl" border="1px solid" borderColor="gray.100">
                    <CardBody textAlign="center" py={8}>
                      <VStack spacing={4}>
                        <Box bg="pink.100" p={4} borderRadius="xl">
                          <Icon as={location.icon} fontSize="2xl" color="pink.600" />
                        </Box>
                        <VStack spacing={2}>
                          <Heading size="md" color="gray.800">
                            {location.name}
                          </Heading>
                          <Text fontSize="sm" color="gray.600">
                            {location.description}
                          </Text>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>

              <Box bg="white" p={8} borderRadius="xl" maxW="4xl">
                <Text fontSize="lg" color="gray.700" textAlign="center" lineHeight="tall">
                  <strong>Our commitment:</strong> Whether it's in the comfort of your home, workplace, 
                  or community, our team ensures care is delivered with professionalism, integrity, and compassion.
                </Text>
              </Box>
            </VStack>
          </Box>

          {/* Mission & Vision */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12}>
            <Card 
              bg={cardBg} 
              shadow="xl" 
              borderRadius="2xl" 
              border="1px solid"
              borderColor="gray.100"
              transition="all 0.3s"
              _hover={{ transform: "translateY(-4px)", shadow: "2xl" }}
            >
              <CardBody p={10}>
                <VStack spacing={6} align="start">
                  <HStack spacing={3}>
                    <Box bg="pink.100" p={3} borderRadius="xl">
                      <Icon as={FaStethoscope} fontSize="2xl" color="pink.600" />
                    </Box>
                    <Heading size="lg" color="gray.800">Our Mission</Heading>
                  </HStack>
                  <Text fontSize="lg" lineHeight="tall" color="gray.600">
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
              borderRadius="2xl" 
              border="1px solid"
              borderColor="gray.100"
              transition="all 0.3s"
              _hover={{ transform: "translateY(-4px)", shadow: "2xl" }}
            >
              <CardBody p={10}>
                <VStack spacing={6} align="start">
                  <HStack spacing={3}>
                    <Box bg="blue.100" p={3} borderRadius="xl">
                      <Icon as={FaEye} fontSize="2xl" color="blue.600" />
                    </Box>
                    <Heading size="lg" color="gray.800">Our Vision</Heading>
                  </HStack>
                  <Text fontSize="lg" lineHeight="tall" color="gray.600">
                    To be the trusted provider for compassionate care and excellent home care service, 
                    redefining how families experience professional healthcare in their homes and communities.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Statistics Section */}
          <Box bg={sectionBg} borderRadius="3xl" p={12}>
            <VStack spacing={12} textAlign="center">
              <VStack spacing={4}>
                <Heading size="xl" color="gray.800">Our Impact in Numbers</Heading>
                <Text fontSize="lg" color="gray.600" maxW="3xl">
                  Building trust through professional excellence and compassionate care since 2020
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w="full">
                {stats.map((stat, index) => (
                  <Card key={index} bg="white" shadow="md" borderRadius="xl" border="1px solid" borderColor="gray.100">
                    <CardBody textAlign="center" py={8}>
                      <VStack spacing={4}>
                        <Box bg={`${stat.color}.100`} p={4} borderRadius="xl">
                          <Icon as={stat.icon} fontSize="2xl" color={`${stat.color}.600`} />
                        </Box>
                        <VStack spacing={1}>
                          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                            {stat.value}
                          </Text>
                          <Text fontSize="sm" color="gray.600" fontWeight="medium">
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

          {/* How We Work */}
          <VStack spacing={12} textAlign="center">
            <VStack spacing={4}>
              <Heading size="xl" color="gray.800">How We Work</Heading>
              <Text fontSize="lg" color="gray.600" maxW="3xl">
                Our simple, professional process to provide you with personalized healthcare solutions
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
              {process.map((step, index) => (
                <Card 
                  key={index} 
                  bg="white" 
                  shadow="lg" 
                  borderRadius="xl" 
                  border="1px solid"
                  borderColor="gray.100"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                >
                  <CardBody p={8}>
                    <HStack spacing={6} align="start">
                      <VStack spacing={0}>
                        <Box 
                          bg="pink.600" 
                          color="white" 
                          w="50px" 
                          h="50px" 
                          borderRadius="xl" 
                          display="flex" 
                          alignItems="center" 
                          justifyContent="center"
                          fontWeight="bold"
                          fontSize="lg"
                        >
                          {step.step}
                        </Box>
                        <Box bg="pink.100" p={3} borderRadius="xl" mt={4}>
                          <Icon as={step.icon} fontSize="xl" color="pink.600" />
                        </Box>
                      </VStack>
                      <VStack spacing={3} align="start" flex={1}>
                        <Heading size="md" color="gray.800">
                          {step.title}
                        </Heading>
                        <Text color="gray.600" lineHeight="tall">
                          {step.description}
                        </Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Core Values */}
          <VStack spacing={12} textAlign="center">
            <VStack spacing={4}>
              <Heading size="xl" color="gray.800">Our Core Values</Heading>
              <Text fontSize="lg" color="gray.600" maxW="3xl">
                The foundation of knowledge, service excellence, and trust that guides our every action
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {values.map((value, index) => (
                <Card 
                  key={index} 
                  bg="white" 
                  shadow="lg" 
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
                >
                  <CardBody p={8} textAlign="center">
                    <VStack spacing={6}>
                      <Box bg={`${value.color}.100`} p={4} borderRadius="xl">
                        <Icon as={value.icon} fontSize="2xl" color={`${value.color}.600`} />
                      </Box>
                      <VStack spacing={3}>
                        <Heading size="md" color="gray.800">
                          {value.title}
                        </Heading>
                        <Text color="gray.600" lineHeight="tall" fontSize="sm">
                          {value.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Call to Action */}
          <Box 
            bgGradient="linear(135deg, pink.50 0%, blue.50 100%)" 
            borderRadius="3xl" 
            p={12} 
            textAlign="center"
          >
            <VStack spacing={8}>
              <VStack spacing={4}>
                <Heading size="xl" color="gray.800">
                  Experience the RHC Difference
                </Heading>
                <Text fontSize="lg" maxW="4xl" color="gray.600">
                  Join hundreds of satisfied families who have experienced our personalized, 
                  professional healthcare services. We understand that every client is unique, 
                  and we're here to be your partner in wellness and care.
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} maxW="4xl">
                <Button
                  size="lg"
                  leftIcon={<FaPhone />}
                  colorScheme="pink"
                  variant="solid"
                  _hover={{ transform: "translateY(-2px)" }}
                  transition="all 0.3s"
                >
                  Call Us Today
                </Button>
                <Button
                  size="lg"
                  leftIcon={<FaWhatsapp />}
                  colorScheme="green"
                  variant="solid"
                  _hover={{ transform: "translateY(-2px)" }}
                  transition="all 0.3s"
                >
                  WhatsApp Us
                </Button>
                <Button
                  size="lg"
                  leftIcon={<FaCalendarAlt />}
                  colorScheme="blue"
                  variant="solid"
                  _hover={{ transform: "translateY(-2px)" }}
                  transition="all 0.3s"
                  onClick={() => navigate('/booking')}
                >
                  Book Assessment
                </Button>
              </SimpleGrid>
            </VStack>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
};

export default About;