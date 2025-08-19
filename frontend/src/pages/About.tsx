// src/pages/About.tsx - Updated with RHC operational dynamics and values
import React, { useState, useEffect } from 'react';
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
  Avatar,
  Divider,
  List,
  ListItem,
  ListIcon,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  useToast,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react';
import {
  FaHeart,
  FaUserMd,
  FaHome,
  FaShieldAlt,
  FaClock,
  FaPhone,
  FaCheck,
  FaAward,
  FaUsers,
  FaStethoscope,
  FaHandsHelping,
  FaGlobe,
  FaClipboardList,
  FaFileAlt,
  FaWhatsapp,
  FaEnvelope,
  FaStar,
  FaGraduationCap,
  FaLightbulb,
  FaEye,
  FaUserGraduate,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Types for real data
interface CompanyStats {
  totalPatients: number;
  totalProfessionals: number;
  statesCovered: number;
  successRate: number;
  totalBookings: number;
  completedAssessments: number;
}

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  specialization: string;
  experience: number;
  credentials: string[];
  bio?: string;
  profileImage?: string;
  isActive: boolean;
}

interface CompanyInfo {
  mission: string;
  vision: string;
  foundedYear: number;
  story: string;
  values: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

const About: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // State for real data
  const [companyStats, setCompanyStats] = useState<CompanyStats | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:3001/api/v1';

  // Fetch real data from backend
  const fetchAboutData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch company statistics
      const statsResponse = await fetch(`${API_BASE_URL}/company/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setCompanyStats(statsData);
      }

      // Fetch team members
      const teamResponse = await fetch(`${API_BASE_URL}/team/members`);
      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        setTeamMembers(teamData.filter((member: TeamMember) => member.isActive));
      }

      // Fetch company information
      const companyResponse = await fetch(`${API_BASE_URL}/company/info`);
      if (companyResponse.ok) {
        const companyData = await companyResponse.json();
        setCompanyInfo(companyData);
      }

    } catch (err) {
      console.error('Error fetching about data:', err);
      setError('Failed to load company information');
      
      // Fallback: Use minimal real data from other endpoints
      try {
        const bookingStatsResponse = await fetch(`${API_BASE_URL}/bookings/stats`);
        const usersResponse = await fetch(`${API_BASE_URL}/users`);
        
        if (bookingStatsResponse.ok && usersResponse.ok) {
          const bookingStats = await bookingStatsResponse.json();
          const users = await usersResponse.json();
          
          // Calculate stats from existing data
          const patients = users.filter((user: any) => user.role === 'client' || user.role === 'patient');
          const professionals = users.filter((user: any) => user.role === 'nurse' || user.role === 'healthcare_professional');
          
          setCompanyStats({
            totalPatients: patients.length,
            totalProfessionals: professionals.length,
            statesCovered: 15,
            successRate: bookingStats.total > 0 ? Math.round((bookingStats.completed / bookingStats.total) * 100) : 0,
            totalBookings: bookingStats.total || 0,
            completedAssessments: bookingStats.completed || 0,
          });
        }
      } catch (fallbackErr) {
        console.error('Fallback data fetch failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  // Updated company information based on RHC document
  const defaultCompanyInfo: CompanyInfo = {
    mission: "To provide personalized professional healthcare service that enhances the quality of life of our clients while ensuring that our twin goal of comfortability and affordability is achieved.",
    vision: "To be the trusted provider for compassionate care and excellent home care service",
    foundedYear: 2023,
    story: "Royal Health Consult was founded with a commitment to making professional healthcare accessible and comfortable for everyone.",
    values: [
      {
        title: 'Professionalism',
        description: 'We consistently deliver ethical and reliable nursing care.',
        icon: 'award'
      },
      {
        title: 'Integrity',
        description: 'We practice in honesty and transparency in all our interaction.',
        icon: 'shield'
      },
      {
        title: 'Compassionate Care',
        description: 'We care genuinely for every client',
        icon: 'heart'
      },
      {
        title: 'Knowledge',
        description: 'We are committed to continuous improvement and learning to better serve our clients.',
        icon: 'graduation'
      },
      {
        title: 'Understanding',
        description: 'We take the time to truly listen and respond to unique needs of our clients',
        icon: 'lightbulb'
      },
      {
        title: 'Service Excellence',
        description: 'We are in business to exceed your expectation',
        icon: 'star'
      }
    ]
  };

  // Operational process steps from the document
  const operationalSteps = [
    {
      step: 1,
      title: "Initial Contact",
      description: "Reach out to us through phone calls, WhatsApp message, or email to book for an assessment.",
      icon: FaPhone,
      methods: ["Phone Call", "WhatsApp", "Email"]
    },
    {
      step: 2,
      title: "Professional Assessment",
      description: "Our trained professionals conduct a comprehensive assessment of your healthcare needs.",
      icon: FaUserMd,
      methods: ["Trained Professionals", "Comprehensive Evaluation"]
    },
    {
      step: 3,
      title: "Client Assessment Report (CAR)",
      description: "We provide you with a detailed Client Assessment Report with personalized recommendations.",
      icon: FaFileAlt,
      methods: ["Detailed Report", "Personalized Recommendations"]
    },
    {
      step: 4,
      title: "Service Deployment",
      description: "Upon satisfactory review of CAR, sign up for your preferred healthcare package and services begin.",
      icon: FaHome,
      methods: ["Package Selection", "Service Deployment"]
    }
  ];

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      heart: FaHeart,
      shield: FaShieldAlt,
      home: FaHome,
      clock: FaClock,
      award: FaAward,
      graduation: FaGraduationCap,
      lightbulb: FaLightbulb,
      star: FaStar,
    };
    return iconMap[iconName] || FaCheck;
  };

  const getColorScheme = (index: number) => {
    const colors = ['red', 'blue', 'green', 'orange', 'purple', 'teal'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
          <Text>Loading company information...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box bg={bg} minH="100vh">
      {/* Hero Section */}
      <Box bg="primary.600" color="white" py={20}>
        <Container maxW="6xl">
          <VStack spacing={6} textAlign="center">
            <Heading size="2xl" fontWeight="bold">
              About Royal Health Consult (RHC)
            </Heading>
            <Text fontSize="xl" maxW="4xl" opacity={0.9}>
              {companyInfo?.mission || defaultCompanyInfo.mission}
            </Text>
            <Badge bg="white" color="primary.600" px={6} py={3} fontSize="lg" borderRadius="full">
              Professional • Compassionate • Excellence
            </Badge>
          </VStack>
        </Container>
      </Box>

      <Container maxW="6xl" py={16}>
        <VStack spacing={20} align="stretch">
          {/* Error Alert */}
          {error && (
            <Alert status="warning">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Notice</Text>
                <Text fontSize="sm">{error}. Showing available data from the system.</Text>
              </Box>
            </Alert>
          )}

          {/* Mission & Vision */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12}>
            <Card bg={cardBg} shadow="xl" borderRadius="2xl" overflow="hidden">
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack spacing={3}>
                    <Icon as={FaStethoscope} fontSize="2xl" color="primary.500" />
                    <Heading size="lg" color="primary.600">Our Mission</Heading>
                  </HStack>
                  <Text fontSize="lg" lineHeight="tall" color="gray.600">
                    {companyInfo?.mission || defaultCompanyInfo.mission}
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg} shadow="xl" borderRadius="2xl" overflow="hidden">
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack spacing={3}>
                    <Icon as={FaEye} fontSize="2xl" color="secondary.500" />
                    <Heading size="lg" color="secondary.600">Our Vision</Heading>
                  </HStack>
                  <Text fontSize="lg" lineHeight="tall" color="gray.600">
                    {companyInfo?.vision || defaultCompanyInfo.vision}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Operational Dynamics Section */}
          <Box>
            <VStack spacing={8} textAlign="center" mb={12}>
              <Heading size="xl" color="gray.800">Our Operational Dynamics</Heading>
              <Text fontSize="lg" maxW="4xl" color="gray.600">
                We follow a systematic approach to ensure you receive the best personalized healthcare service
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {operationalSteps.map((process, index) => (
                <Card key={index} bg={cardBg} shadow="lg" borderRadius="xl" overflow="hidden">
                  <CardBody p={8}>
                    <HStack spacing={6} align="start">
                      <Box bg={`${getColorScheme(index)}.100`} p={4} borderRadius="full" position="relative">
                        <Icon as={process.icon} fontSize="xl" color={`${getColorScheme(index)}.500`} />
                        <Badge 
                          position="absolute" 
                          top="-2" 
                          right="-2" 
                          bg={`${getColorScheme(index)}.500`} 
                          color="white" 
                          borderRadius="full"
                          minW="24px"
                          h="24px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="sm"
                        >
                          {process.step}
                        </Badge>
                      </Box>
                      <VStack spacing={3} align="start" flex={1}>
                        <Heading size="md" color={`${getColorScheme(index)}.600`}>
                          {process.title}
                        </Heading>
                        <Text color="gray.600" lineHeight="tall">
                          {process.description}
                        </Text>
                        <HStack spacing={2} flexWrap="wrap">
                          {process.methods.map((method, idx) => (
                            <Badge key={idx} variant="outline" colorScheme={getColorScheme(index)} fontSize="xs">
                              {method}
                            </Badge>
                          ))}
                        </HStack>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Real Statistics from Backend */}
          {companyStats && (
            <Box bg="gray.100" borderRadius="3xl" p={12}>
              <VStack spacing={8} textAlign="center" mb={12}>
                <Heading size="xl" color="gray.800">Our Real Impact</Heading>
                <Text fontSize="lg" maxW="3xl" color="gray.600">
                  Live statistics from our healthcare platform
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
                <Card bg="white" shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={8}>
                    <Stat>
                      <VStack spacing={3}>
                        <Icon as={FaUsers} fontSize="3xl" color="primary.500" />
                        <StatNumber fontSize="3xl" color="gray.800" fontWeight="bold">
                          {companyStats.totalPatients.toLocaleString()}
                        </StatNumber>
                        <StatLabel fontSize="md" color="gray.600" fontWeight="medium">
                          Clients Served
                        </StatLabel>
                      </VStack>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg="white" shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={8}>
                    <Stat>
                      <VStack spacing={3}>
                        <Icon as={FaUserMd} fontSize="3xl" color="green.500" />
                        <StatNumber fontSize="3xl" color="gray.800" fontWeight="bold">
                          {companyStats.totalProfessionals}
                        </StatNumber>
                        <StatLabel fontSize="md" color="gray.600" fontWeight="medium">
                          Trained Professionals
                        </StatLabel>
                      </VStack>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg="white" shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={8}>
                    <Stat>
                      <VStack spacing={3}>
                        <Icon as={FaClipboardList} fontSize="3xl" color="blue.500" />
                        <StatNumber fontSize="3xl" color="gray.800" fontWeight="bold">
                          {companyStats.completedAssessments}
                        </StatNumber>
                        <StatLabel fontSize="md" color="gray.600" fontWeight="medium">
                          Assessments Completed
                        </StatLabel>
                      </VStack>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg="white" shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={8}>
                    <Stat>
                      <VStack spacing={3}>
                        <Icon as={FaAward} fontSize="3xl" color="purple.500" />
                        <StatNumber fontSize="3xl" color="gray.800" fontWeight="bold">
                          {companyStats.successRate}%
                        </StatNumber>
                        <StatLabel fontSize="md" color="gray.600" fontWeight="medium">
                          Client Satisfaction
                        </StatLabel>
                      </VStack>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </Box>
          )}

          {/* PICK US Values - Core Values from Document */}
          <Box>
            <VStack spacing={8} textAlign="center" mb={12}>
              <Heading size="xl" color="gray.800">Our Core Values - "PICK US"</Heading>
              <Text fontSize="lg" maxW="4xl" color="gray.600">
                The RHC values form the acronym "PICK US" - representing our commitment to excellence in every aspect of our service delivery.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {(companyInfo?.values || defaultCompanyInfo.values).map((value, index) => (
                <Card key={index} bg={cardBg} shadow="lg" borderRadius="xl" overflow="hidden">
                  <CardBody p={8} textAlign="center">
                    <VStack spacing={6}>
                      <Box bg={`${getColorScheme(index)}.100`} p={4} borderRadius="full">
                        <Icon as={getIconComponent(value.icon)} fontSize="2xl" color={`${getColorScheme(index)}.500`} />
                      </Box>
                      <VStack spacing={3}>
                        <Heading size="md" color={`${getColorScheme(index)}.600`}>
                          {value.title}
                        </Heading>
                        <Text color="gray.600" lineHeight="tall" textAlign="center">
                          {value.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Contact Methods */}
          <Box bg="primary.50" borderRadius="3xl" p={12}>
            <VStack spacing={8} textAlign="center" mb={8}>
              <Heading size="xl" color="gray.800">Get in Touch</Heading>
              <Text fontSize="lg" maxW="3xl" color="gray.600">
                Contact us through any of our convenient channels to begin your healthcare journey
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <Card bg="white" shadow="md" borderRadius="xl">
                <CardBody textAlign="center" py={8}>
                  <VStack spacing={4}>
                    <Icon as={FaPhone} fontSize="3xl" color="primary.500" />
                    <Heading size="md" color="gray.800">Phone Call</Heading>
                    <Text color="gray.600">Speak directly with our team</Text>
                    <Button colorScheme="primary" size="sm">Call Now</Button>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg="white" shadow="md" borderRadius="xl">
                <CardBody textAlign="center" py={8}>
                  <VStack spacing={4}>
                    <Icon as={FaWhatsapp} fontSize="3xl" color="green.500" />
                    <Heading size="md" color="gray.800">WhatsApp</Heading>
                    <Text color="gray.600">Quick and convenient messaging</Text>
                    <Button colorScheme="green" size="sm">Message Us</Button>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg="white" shadow="md" borderRadius="xl">
                <CardBody textAlign="center" py={8}>
                  <VStack spacing={4}>
                    <Icon as={FaEnvelope} fontSize="3xl" color="blue.500" />
                    <Heading size="md" color="gray.800">Email</Heading>
                    <Text color="gray.600">Detailed inquiries and information</Text>
                    <Button colorScheme="blue" size="sm">Send Email</Button>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Box>

          {/* Real Team Members */}
          {teamMembers.length > 0 && (
            <Box>
              <VStack spacing={8} textAlign="center" mb={12}>
                <Heading size="xl" color="gray.800">Meet Our Trained Professionals</Heading>
                <Text fontSize="lg" maxW="3xl" color="gray.600">
                  Our experienced healthcare professionals committed to providing exceptional care and service excellence.
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                {teamMembers.slice(0, 6).map((member) => (
                  <Card key={member.id} bg={cardBg} shadow="xl" borderRadius="2xl" overflow="hidden">
                    <CardBody p={8} textAlign="center">
                      <VStack spacing={6}>
                        <Avatar 
                          size="2xl" 
                          name={`${member.firstName} ${member.lastName}`} 
                          src={member.profileImage}
                          bg="primary.500" 
                        />
                        <VStack spacing={2}>
                          <Heading size="md" color="gray.800">
                            {member.firstName} {member.lastName}
                          </Heading>
                          <Text fontWeight="600" color="primary.600">{member.role}</Text>
                          <Text fontSize="sm" color="gray.600">{member.specialization}</Text>
                          <Badge colorScheme="green">{member.experience} years experience</Badge>
                        </VStack>
                        {member.bio && (
                          <>
                            <Divider />
                            <Text fontSize="sm" color="gray.600" textAlign="center">
                              {member.bio}
                            </Text>
                          </>
                        )}
                        {member.credentials.length > 0 && (
                          <>
                            <Divider />
                            <VStack spacing={2}>
                              <Text fontSize="sm" fontWeight="600" color="gray.700">Credentials:</Text>
                              <HStack spacing={2} flexWrap="wrap" justify="center">
                                {member.credentials.map((credential, idx) => (
                                  <Badge key={idx} variant="outline" colorScheme="blue" fontSize="xs">
                                    {credential}
                                  </Badge>
                                ))}
                              </HStack>
                            </VStack>
                          </>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Call to Action */}
          <Box bg="primary.600" color="white" borderRadius="3xl" p={12} textAlign="center">
            <VStack spacing={8}>
              <VStack spacing={4}>
                <Heading size="xl">Ready to Experience Professional Healthcare at Home?</Heading>
                <Text fontSize="lg" maxW="4xl" opacity={0.9}>
                  Join {companyStats?.totalPatients || 'thousands of'} satisfied clients who have chosen 
                  Royal Health Consult for personalized, professional healthcare services that prioritize 
                  comfort and affordability.
                </Text>
              </VStack>
              <HStack spacing={6}>
                <Button
                  size="lg"
                  bg="white"
                  color="primary.600"
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => navigate('/booking')}
                  leftIcon={<FaClipboardList />}
                >
                  Book Assessment
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  onClick={() => navigate('/contact')}
                >
                  Contact Us
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default About;