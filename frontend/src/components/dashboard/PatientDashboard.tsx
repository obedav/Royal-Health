import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Icon,
  Flex,
  Stack,
  useColorModeValue,
  SimpleGrid,
  Avatar,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useBreakpointValue,
} from '@chakra-ui/react';
import { 
  CalendarIcon, 
  TimeIcon, 
  PhoneIcon, 
  EmailIcon,
  CheckCircleIcon,
  WarningIcon,
  InfoIcon,
  AddIcon,
  StarIcon,
  ViewIcon,
  EditIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { 
  FaHeart, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUserMd,
  FaCalendarAlt,
  FaPlusCircle,
  FaChartLine,
  FaBell,
  FaClipboardList,
  FaStethoscope,
} from 'react-icons/fa';

// Real API Integration
const API_BASE_URL = 'http://localhost:3001/api/v1';

interface Booking {
  id: string;
  serviceType: string;
  serviceName: string;
  serviceDescription: string;
  basePrice: string;
  totalPrice: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  patientAddress: string;
  city: string;
  state: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalConditions?: string;
  currentMedications?: string;
  createdAt: string;
  updatedAt: string;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  assignedNurse?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null;
}

const PatientDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const toast = useToast();
  
  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const isMobile = useBreakpointValue({ base: true, md: false });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchMyBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      toast({
        title: 'Booking Cancelled',
        description: 'Your appointment has been cancelled successfully',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });

      // Refresh bookings
      await fetchMyBookings();
    } catch (err: any) {
      toast({
        title: 'Cancellation Failed',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'confirmed': return 'blue';
      case 'in_progress': return 'purple';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'paid': return 'green';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(parseFloat(price));
  };

  // Statistics
  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => 
      new Date(b.scheduledDate) > new Date() && 
      !['cancelled', 'completed'].includes(b.status)
    ).length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  if (isLoading) {
    return (
      <Box bg={bgColor} minH="80vh" py={8}>
        {/* Enhanced CSS Animations */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-15px); }
            }
            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 0 20px rgba(194, 24, 91, 0.3); }
              50% { box-shadow: 0 0 40px rgba(194, 24, 91, 0.6); }
            }
          `}
        </style>
        
        <Container maxW="7xl">
          <VStack spacing={8} justify="center" minH="60vh">
            <Box
              p={8}
              borderRadius="2xl"
              bg="white"
              boxShadow="0 20px 60px rgba(194, 24, 91, 0.2)"
              animation="float 3s ease-in-out infinite, pulse-glow 2s ease-in-out infinite"
            >
              <Spinner size="xl" color="brand.500" thickness="4px" speed="0.65s" />
            </Box>
            <VStack spacing={3} textAlign="center">
              <Text 
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="700" 
                bgGradient="linear(45deg, brand.500, purple.500)"
                bgClip="text"
                sx={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Loading Your Health Dashboard
              </Text>
              <Text fontSize="md" color="gray.600" fontWeight="500">
                Preparing your personalized health insights...
              </Text>
              <Progress 
                size="sm" 
                colorScheme="brand" 
                isIndeterminate 
                w="200px" 
                borderRadius="full"
                bg="gray.200"
              />
            </VStack>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="80vh" py={{ base: 4, md: 8 }}>
      <Container maxW="7xl">
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          {/* Enhanced Welcome Section */}
          <Card 
            bg={cardBg} 
            borderRadius={{ base: "xl", md: "2xl" }}
            boxShadow="0 8px 30px rgba(194, 24, 91, 0.12)"
            border="2px solid"
            borderColor="brand.100"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '6px',
              bgGradient: 'linear(90deg, brand.500, purple.500)',
            }}
          >
            <CardBody p={{ base: 6, md: 8 }}>
              <Flex 
                direction={{ base: "column", lg: "row" }} 
                justify="space-between" 
                align={{ base: "start", lg: "center" }}
                gap={6}
              >
                <VStack spacing={4} align="start" flex={1}>
                  <HStack spacing={3}>
                    <Box
                      p={3}
                      borderRadius="full"
                      bgGradient="linear(45deg, brand.500, purple.500)"
                      color="white"
                      boxShadow="0 4px 15px rgba(194, 24, 91, 0.3)"
                    >
                      <Icon as={FaStethoscope} fontSize="xl" />
                    </Box>
                    <Heading 
                      size={{ base: "md", md: "lg" }} 
                      bgGradient="linear(45deg, brand.500, purple.500)"
                      bgClip="text"
                      sx={{
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Your Health Dashboard
                    </Heading>
                  </HStack>
                  <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} maxW="600px">
                    Take control of your health journey. Manage appointments, track your wellness, 
                    and connect with our professional healthcare team.
                  </Text>
                </VStack>
                
                {!isMobile && (
                  <VStack spacing={3} align="end">
                    <Avatar
                      size="xl"
                      bg="brand.500"
                      icon={<Icon as={FaUserMd} fontSize="2xl" />}
                      border="4px solid"
                      borderColor="white"
                      boxShadow="0 4px 20px rgba(194, 24, 91, 0.2)"
                    />
                    <Badge
                      colorScheme="brand"
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      Premium Care
                    </Badge>
                  </VStack>
                )}
              </Flex>
            </CardBody>
          </Card>

          {/* Enhanced Statistics Grid */}
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={{ base: 4, md: 6 }}>
            <Card 
              bg="linear-gradient(135deg, #EBF8FF 0%, #BEE3F8 100%)" 
              border="2px solid" 
              borderColor="blue.200"
              borderRadius="xl"
              boxShadow="0 4px 20px rgba(59, 130, 246, 0.15)"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 8px 30px rgba(59, 130, 246, 0.2)"
              }}
            >
              <CardBody p={{ base: 4, md: 6 }}>
                <Stat>
                  <StatLabel>
                    <HStack spacing={2}>
                      <Icon as={FaClipboardList} color="blue.600" />
                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="600">Total</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="blue.600" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800">
                    {stats.total}
                  </StatNumber>
                  <StatHelpText fontSize={{ base: "xs", md: "sm" }} color="blue.500">
                    All appointments
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card 
              bg="linear-gradient(135deg, #F0FFF4 0%, #C6F6D5 100%)" 
              border="2px solid" 
              borderColor="green.200"
              borderRadius="xl"
              boxShadow="0 4px 20px rgba(34, 197, 94, 0.15)"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 8px 30px rgba(34, 197, 94, 0.2)"
              }}
            >
              <CardBody p={{ base: 4, md: 6 }}>
                <Stat>
                  <StatLabel>
                    <HStack spacing={2}>
                      <Icon as={FaClock} color="green.600" />
                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="600">Upcoming</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="green.600" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800">
                    {stats.upcoming}
                  </StatNumber>
                  <StatHelpText fontSize={{ base: "xs", md: "sm" }} color="green.500">
                    Next visits
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card 
              bg="linear-gradient(135deg, #FFFBEB 0%, #FED7AA 100%)" 
              border="2px solid" 
              borderColor="yellow.200"
              borderRadius="xl"
              boxShadow="0 4px 20px rgba(251, 146, 60, 0.15)"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 8px 30px rgba(251, 146, 60, 0.2)"
              }}
            >
              <CardBody p={{ base: 4, md: 6 }}>
                <Stat>
                  <StatLabel>
                    <HStack spacing={2}>
                      <Icon as={FaBell} color="yellow.600" />
                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="600">Pending</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="yellow.600" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800">
                    {stats.pending}
                  </StatNumber>
                  <StatHelpText fontSize={{ base: "xs", md: "sm" }} color="yellow.500">
                    Need action
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card 
              bg="linear-gradient(135deg, #FAF5FF 0%, #DDD6FE 100%)" 
              border="2px solid" 
              borderColor="purple.200"
              borderRadius="xl"
              boxShadow="0 4px 20px rgba(147, 51, 234, 0.15)"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 8px 30px rgba(147, 51, 234, 0.2)"
              }}
            >
              <CardBody p={{ base: 4, md: 6 }}>
                <Stat>
                  <StatLabel>
                    <HStack spacing={2}>
                      <CheckCircleIcon color="purple.600" />
                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="600">Completed</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="purple.600" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800">
                    {stats.completed}
                  </StatNumber>
                  <StatHelpText fontSize={{ base: "xs", md: "sm" }} color="purple.500">
                    Successfully done
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Error Alert */}
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Enhanced Quick Actions with Unique Design */}
          <Card 
            bg={cardBg}
            borderRadius="2xl"
            boxShadow="0 12px 40px rgba(194, 24, 91, 0.12)"
            border="2px solid"
            borderColor="brand.100"
            overflow="hidden"
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '6px',
              bgGradient: 'linear(90deg, brand.500, purple.500, blue.500)',
            }}
          >
            <CardHeader pb={0}>
              <HStack spacing={4}>
                <Box
                  p={3}
                  borderRadius="full"
                  bgGradient="linear(45deg, brand.500, purple.500)"
                  color="white"
                >
                  <Icon as={FaPlusCircle} fontSize="xl" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Heading size="md" color="gray.800">
                    Quick Health Actions
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Take control of your healthcare journey
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} w="full">
                {/* Book New Appointment - Primary Action */}
                <Card
                  bgGradient="linear(135deg, brand.500, purple.600)"
                  color="white"
                  borderRadius="xl"
                  cursor="pointer"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: "0 20px 60px rgba(194, 24, 91, 0.4)",
                  }}
                  onClick={() => window.location.href = '/booking'}
                  role="button"
                  tabIndex={0}
                >
                  <CardBody p={6} textAlign="center">
                    <VStack spacing={4}>
                      <Box
                        p={4}
                        borderRadius="full"
                        bg="whiteAlpha.200"
                        backdropFilter="blur(10px)"
                      >
                        <Icon as={FaCalendarAlt} fontSize="2xl" />
                      </Box>
                      <VStack spacing={2}>
                        <Text fontSize="lg" fontWeight="800">
                          Book Appointment
                        </Text>
                        <Text fontSize="sm" opacity={0.9} textAlign="center">
                          Schedule with healthcare professionals
                        </Text>
                      </VStack>
                      <HStack spacing={2} color="whiteAlpha.800">
                        <Text fontSize="xs">Get started</Text>
                        <ChevronRightIcon />
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* View Appointments */}
                <Card
                  bg="white"
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="blue.200"
                  cursor="pointer"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{
                    transform: "translateY(-6px)",
                    borderColor: "blue.400",
                    boxShadow: "0 15px 40px rgba(59, 130, 246, 0.2)",
                  }}
                  onClick={() => window.location.href = '/appointments'}
                  role="button"
                  tabIndex={0}
                >
                  <CardBody p={6} textAlign="center">
                    <VStack spacing={4}>
                      <Box
                        p={4}
                        borderRadius="full"
                        bg="blue.50"
                        color="blue.600"
                      >
                        <Icon as={FaClipboardList} fontSize="2xl" />
                      </Box>
                      <VStack spacing={2}>
                        <Text fontSize="lg" fontWeight="700" color="blue.700">
                          My Appointments
                        </Text>
                        <Text fontSize="sm" color="blue.600" textAlign="center">
                          View and manage all visits
                        </Text>
                      </VStack>
                      <Badge colorScheme="blue" borderRadius="full" px={3}>
                        {stats.upcoming} upcoming
                      </Badge>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Health Records */}
                <Card
                  bg="white"
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="green.200"
                  cursor="pointer"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{
                    transform: "translateY(-6px)",
                    borderColor: "green.400",
                    boxShadow: "0 15px 40px rgba(34, 197, 94, 0.2)",
                  }}
                  onClick={() => window.location.href = '/health-records'}
                  role="button"
                  tabIndex={0}
                >
                  <CardBody p={6} textAlign="center">
                    <VStack spacing={4}>
                      <Box
                        p={4}
                        borderRadius="full"
                        bg="green.50"
                        color="green.600"
                      >
                        <Icon as={FaChartLine} fontSize="2xl" />
                      </Box>
                      <VStack spacing={2}>
                        <Text fontSize="lg" fontWeight="700" color="green.700">
                          Health Records
                        </Text>
                        <Text fontSize="sm" color="green.600" textAlign="center">
                          Track your health journey
                        </Text>
                      </VStack>
                      <HStack spacing={2} color="green.500">
                        <Text fontSize="xs">View records</Text>
                        <ViewIcon fontSize="xs" />
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Revolutionary Appointment Management Section */}
          <Card 
            bg={cardBg}
            borderRadius="2xl"
            boxShadow="0 12px 40px rgba(194, 24, 91, 0.08)"
            border="2px solid"
            borderColor="gray.100"
            overflow="hidden"
          >
            <CardHeader 
              bgGradient="linear(135deg, gray.50, gray.25)"
              borderBottom="1px solid"
              borderColor="gray.200"
            >
              <Flex justify="space-between" align="center">
                <HStack spacing={4}>
                  <Box
                    p={3}
                    borderRadius="full"
                    bgGradient="linear(45deg, blue.500, purple.500)"
                    color="white"
                  >
                    <Icon as={FaCalendarAlt} fontSize="lg" />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Heading size="md" color="gray.800">
                      Appointment Center
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      Manage your healthcare appointments
                    </Text>
                  </VStack>
                </HStack>
                <Button 
                  size="sm"
                  variant="ghost"
                  colorScheme="brand"
                  rightIcon={<ChevronRightIcon />}
                  onClick={() => window.location.href = '/appointments'}
                >
                  View All
                </Button>
              </Flex>
            </CardHeader>

            <CardBody p={0}>
              <Tabs 
                index={activeTabIndex} 
                onChange={setActiveTabIndex}
                variant="enclosed"
                colorScheme="brand"
              >
                <TabList borderBottom="2px solid" borderColor="gray.100" bg="gray.50">
                  <Tab _selected={{ color: "brand.600", borderColor: "brand.500" }}>
                    <HStack spacing={2}>
                      <Icon as={FaClock} />
                      <Text>Upcoming</Text>
                      {stats.upcoming > 0 && (
                        <Badge colorScheme="brand" borderRadius="full" fontSize="xs">
                          {stats.upcoming}
                        </Badge>
                      )}
                    </HStack>
                  </Tab>
                  <Tab _selected={{ color: "green.600", borderColor: "green.500" }}>
                    <HStack spacing={2}>
                      <CheckCircleIcon />
                      <Text>Completed</Text>
                    </HStack>
                  </Tab>
                  <Tab _selected={{ color: "yellow.600", borderColor: "yellow.500" }}>
                    <HStack spacing={2}>
                      <WarningIcon />
                      <Text>Pending</Text>
                      {stats.pending > 0 && (
                        <Badge colorScheme="yellow" borderRadius="full" fontSize="xs">
                          {stats.pending}
                        </Badge>
                      )}
                    </HStack>
                  </Tab>
                </TabList>

                <TabPanels>
                  {/* Upcoming Appointments Tab */}
                  <TabPanel p={6}>
                    {bookings.filter(b => 
                      new Date(b.scheduledDate) > new Date() && 
                      !['cancelled', 'completed'].includes(b.status)
                    ).length === 0 ? (
                      <VStack spacing={6} py={12}>
                        <Box
                          w="120px"
                          h="120px"
                          borderRadius="full"
                          bgGradient="linear(135deg, blue.50, purple.50)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          border="4px solid"
                          borderColor="blue.100"
                        >
                          <Icon as={FaCalendarAlt} fontSize="3xl" color="blue.400" />
                        </Box>
                        <VStack spacing={3} textAlign="center">
                          <Text fontSize="xl" color="gray.700" fontWeight="700">
                            No Upcoming Appointments
                          </Text>
                          <Text color="gray.500" maxW="400px" lineHeight="1.6">
                            Ready to prioritize your health? Schedule your next appointment 
                            with our expert healthcare professionals.
                          </Text>
                        </VStack>
                        <Button 
                          bgGradient="linear(45deg, brand.500, purple.500)"
                          color="white"
                          leftIcon={<AddIcon />}
                          size="lg"
                          borderRadius="xl"
                          px={8}
                          py={6}
                          fontSize="lg"
                          fontWeight="700"
                          boxShadow="0 8px 25px rgba(194, 24, 91, 0.25)"
                          _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 35px rgba(194, 24, 91, 0.35)"
                          }}
                          onClick={() => window.location.href = '/booking'}
                        >
                          Book Your Next Appointment
                        </Button>
                      </VStack>
                    ) : (
                      <VStack spacing={4} align="stretch">
                        {bookings
                          .filter(b => new Date(b.scheduledDate) > new Date() && !['cancelled', 'completed'].includes(b.status))
                          .slice(0, 2)
                          .map((booking) => (
                            <Card 
                              key={booking.id} 
                              borderRadius="xl"
                              boxShadow="0 8px 30px rgba(0, 0, 0, 0.08)"
                              border="2px solid"
                              borderColor={getStatusColor(booking.status) + '.200'}
                              bg="white"
                              transition="all 0.3s ease"
                              _hover={{
                                transform: "translateY(-4px)",
                                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)"
                              }}
                            >
                              <CardBody p={6}>
                                <Flex direction={{ base: "column", lg: "row" }} gap={6}>
                                  {/* Left Section - Appointment Details */}
                                  <VStack align="start" spacing={4} flex={1}>
                                    {/* Header with Service Info */}
                                    <Flex justify="space-between" align="start" w="full">
                                      <VStack align="start" spacing={2}>
                                        <HStack spacing={3}>
                                          <Box
                                            p={3}
                                            borderRadius="xl"
                                            bg={getStatusColor(booking.status) + '.100'}
                                            color={getStatusColor(booking.status) + '.700'}
                                          >
                                            <Icon as={FaUserMd} fontSize="lg" />
                                          </Box>
                                          <VStack align="start" spacing={0}>
                                            <Heading size="md" color="gray.800" noOfLines={1}>
                                              {booking.serviceName}
                                            </Heading>
                                            <Text fontSize="sm" color="gray.500" noOfLines={2}>
                                              {booking.serviceDescription}
                                            </Text>
                                          </VStack>
                                        </HStack>
                                      </VStack>
                                      
                                      <VStack align="end" spacing={2}>
                                        <Badge 
                                          colorScheme={getStatusColor(booking.status)} 
                                          fontSize="xs"
                                          px={3} 
                                          py={1}
                                          borderRadius="full"
                                          fontWeight="700"
                                          textTransform="uppercase"
                                        >
                                          {booking.status}
                                        </Badge>
                                        <Text fontSize="xl" fontWeight="800" color="green.600">
                                          {formatPrice(booking.totalPrice)}
                                        </Text>
                                      </VStack>
                                    </Flex>

                                    <Divider />

                                    {/* Appointment Details Grid */}
                                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} w="full">
                                      {/* Date & Time */}
                                      <HStack spacing={3} p={4} bg="blue.50" borderRadius="xl">
                                        <Box
                                          p={2}
                                          borderRadius="lg"
                                          bg="blue.100"
                                          color="blue.700"
                                        >
                                          <CalendarIcon />
                                        </Box>
                                        <VStack align="start" spacing={0}>
                                          <Text fontSize="xs" color="blue.600" fontWeight="700" textTransform="uppercase">
                                            Date & Time
                                          </Text>
                                          <Text fontSize="sm" fontWeight="700" color="blue.800">
                                            {formatDate(booking.scheduledDate)}
                                          </Text>
                                          <Text fontSize="sm" color="blue.600">
                                            {booking.scheduledTime} • {booking.duration}min
                                          </Text>
                                        </VStack>
                                      </HStack>

                                      {/* Location */}
                                      <HStack spacing={3} p={4} bg="green.50" borderRadius="xl">
                                        <Box
                                          p={2}
                                          borderRadius="lg"
                                          bg="green.100"
                                          color="green.700"
                                        >
                                          <Icon as={FaMapMarkerAlt} />
                                        </Box>
                                        <VStack align="start" spacing={0}>
                                          <Text fontSize="xs" color="green.600" fontWeight="700" textTransform="uppercase">
                                            Location
                                          </Text>
                                          <Text fontSize="sm" fontWeight="700" color="green.800" noOfLines={1}>
                                            {booking.city}, {booking.state}
                                          </Text>
                                          <Text fontSize="xs" color="green.600" noOfLines={1}>
                                            Home service
                                          </Text>
                                        </VStack>
                                      </HStack>
                                    </SimpleGrid>

                                    {/* Assigned Nurse */}
                                    {booking.assignedNurse && (
                                      <Box w="full" p={4} bg="purple.50" borderRadius="xl" border="2px solid" borderColor="purple.100">
                                        <HStack spacing={3}>
                                          <Avatar
                                            size="sm"
                                            name={`${booking.assignedNurse.firstName} ${booking.assignedNurse.lastName}`}
                                            bg="purple.500"
                                            color="white"
                                          />
                                          <VStack align="start" spacing={0}>
                                            <Text fontSize="xs" color="purple.600" fontWeight="700" textTransform="uppercase">
                                              Your Healthcare Professional
                                            </Text>
                                            <Text fontSize="sm" fontWeight="700" color="purple.800">
                                              {booking.assignedNurse.firstName} {booking.assignedNurse.lastName}
                                            </Text>
                                            <Text fontSize="xs" color="purple.600">
                                              {booking.assignedNurse.phone}
                                            </Text>
                                          </VStack>
                                        </HStack>
                                      </Box>
                                    )}
                                  </VStack>

                                  {/* Right Section - Actions */}
                                  <VStack spacing={3} minW={{ base: "full", lg: "200px" }}>
                                    <VStack spacing={2} w="full">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        colorScheme="brand"
                                        w="full"
                                        borderRadius="lg"
                                        onClick={() => window.open(`/booking/${booking.id}`, '_blank')}
                                      >
                                        View Details
                                      </Button>
                                      
                                      {booking.status === 'pending' && (
                                        <Button
                                          size="sm"
                                          colorScheme="red"
                                          variant="ghost"
                                          w="full"
                                          borderRadius="lg"
                                          onClick={() => cancelBooking(booking.id)}
                                        >
                                          Cancel
                                        </Button>
                                      )}
                                    </VStack>
                                    
                                    <Text fontSize="xs" color="gray.400" textAlign="center">
                                      ID: {booking.id.slice(-8)}
                                    </Text>
                                  </VStack>
                                </Flex>
                              </CardBody>
                            </Card>
                          ))}
                      </VStack>
                    )}
                  </TabPanel>

                  {/* Completed Appointments Tab */}
                  <TabPanel p={6}>
                    <VStack spacing={4}>
                      {bookings.filter(b => b.status === 'completed').length === 0 ? (
                        <Text color="gray.500" py={8}>No completed appointments yet</Text>
                      ) : (
                        bookings.filter(b => b.status === 'completed').slice(0, 3).map((booking) => (
                          <Text key={booking.id}>{booking.serviceName} - {formatDate(booking.scheduledDate)}</Text>
                        ))
                      )}
                    </VStack>
                  </TabPanel>

                  {/* Pending Appointments Tab */}
                  <TabPanel p={6}>
                    <VStack spacing={4}>
                      {bookings.filter(b => b.status === 'pending').length === 0 ? (
                        <Text color="gray.500" py={8}>No pending appointments</Text>
                      ) : (
                        bookings.filter(b => b.status === 'pending').slice(0, 3).map((booking) => (
                          <Text key={booking.id}>{booking.serviceName} - {formatDate(booking.scheduledDate)}</Text>
                        ))
                      )}
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>

          {/* Health Insights & Wellness Tips */}
          <Card 
            bgGradient="linear(135deg, blue.50, purple.50, pink.50)"
            borderRadius="2xl"
            border="2px solid"
            borderColor="blue.200"
            boxShadow="0 12px 40px rgba(59, 130, 246, 0.15)"
            overflow="hidden"
            position="relative"
          >
            <CardBody p={{ base: 6, md: 8 }}>
              <Flex direction={{ base: "column", lg: "row" }} align="center" gap={6}>
                {/* Content */}
                <VStack align={{ base: "center", lg: "start" }} spacing={4} flex={1} textAlign={{ base: "center", lg: "left" }}>
                  <HStack spacing={3}>
                    <Box
                      p={3}
                      borderRadius="full"
                      bgGradient="linear(45deg, blue.500, purple.500)"
                      color="white"
                    >
                      <Icon as={FaHeart} fontSize="xl" />
                    </Box>
                    <Heading size="lg" bgGradient="linear(45deg, blue.600, purple.600)" bgClip="text" sx={{
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      Your Health Journey
                    </Heading>
                  </HStack>
                  
                  <Text color="gray.700" fontSize="md" lineHeight="1.7" maxW="500px">
                    <Text as="span" fontWeight="700" color="blue.700">Stay proactive with your health!</Text> 
                    {" "}Regular check-ups and preventive care are key to maintaining optimal wellness. 
                    Track your progress and celebrate every step towards better health.
                  </Text>
                  
                  <HStack spacing={4} pt={2}>
                    <Button
                      size="md"
                      bgGradient="linear(45deg, blue.500, purple.500)"
                      color="white"
                      borderRadius="xl"
                      fontWeight="700"
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)"
                      }}
                    >
                      Health Tips
                    </Button>
                    <Button
                      size="md"
                      variant="outline"
                      colorScheme="blue"
                      borderRadius="xl"
                      fontWeight="700"
                    >
                      Track Progress
                    </Button>
                  </HStack>
                </VStack>
                
                {/* Decorative Element */}
                {!isMobile && (
                  <Box position="relative">
                    <Box
                      w="150px"
                      h="150px"
                      borderRadius="full"
                      bgGradient="linear(45deg, blue.400, purple.400)"
                      opacity={0.1}
                      position="absolute"
                      top="-20px"
                      right="-20px"
                    />
                    <Icon 
                      as={FaChartLine} 
                      fontSize="6xl" 
                      color="blue.300"
                      opacity={0.7}
                    />
                  </Box>
                )}
              </Flex>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default PatientDashboard;