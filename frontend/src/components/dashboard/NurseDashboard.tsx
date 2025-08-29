import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Avatar,
  Divider,
  Progress,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Switch,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  Select,
  useToast,
  SimpleGrid,
  Stack,
  useBreakpointValue,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserInjured,
  FaClipboardList,
  FaHeart,
  FaStethoscope,
  FaUserNurse,
  FaHandHoldingMedical,
  FaHeartbeat,
  FaAward,
  FaChartLine,
  FaCalendarCheck,
  FaNotesMedical,
  FaUserShield,
  FaMedkit,
  FaThermometerHalf,
  FaPills,
  FaBandAid,
  FaFirstAid,
  FaSyringe,
  FaHospitalUser,
} from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:3001/api/v1';

interface NurseStats {
  totalAssignments: number;
  completedToday: number;
  upcomingToday: number;
  monthlyEarnings: number;
  patientsSeen: number;
  averageRating: number;
}

interface Assignment {
  id: string;
  serviceName: string;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  status: string;
  totalPrice: string;
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
  specialInstructions?: string;
  createdAt: string;
}

const NurseDashboard: React.FC = () => {
  const [stats, setStats] = useState<NurseStats | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchNurseData = async () => {
    setIsLoading(true);
    try {
      // Fetch nurse assignments (using my-bookings endpoint since nurse is assigned)
      const assignmentsResponse = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
        headers: getAuthHeaders(),
      });
      
      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json();
        setAssignments(assignmentsData);
        
        // Calculate stats from assignments
        const today = new Date().toDateString();
        const completedToday = assignmentsData.filter((a: Assignment) => 
          a.status === 'completed' && new Date(a.scheduledDate).toDateString() === today
        ).length;
        
        const upcomingToday = assignmentsData.filter((a: Assignment) => 
          new Date(a.scheduledDate).toDateString() === today && 
          ['pending', 'confirmed'].includes(a.status)
        ).length;

        const monthlyEarnings = assignmentsData
          .filter((a: Assignment) => a.status === 'completed')
          .reduce((sum: number, a: Assignment) => sum + parseFloat(a.totalPrice) * 0.7, 0); // Assuming 70% commission

        setStats({
          totalAssignments: assignmentsData.length,
          completedToday,
          upcomingToday,
          monthlyEarnings,
          patientsSeen: assignmentsData.filter((a: Assignment) => a.status === 'completed').length,
          averageRating: 4.8, // Mock rating
        });
      } else {
        // API not available, use mock data
        console.warn('API not available, using mock data');
        setMockData();
      }
    } catch (err: any) {
      console.warn('API connection failed, using mock data:', err.message);
      setMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const setMockData = () => {
    // Mock data when API is not available
    const mockAssignments: Assignment[] = [
      {
        id: '1',
        serviceName: 'Home Health Check',
        patient: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          phone: '+234 801 234 5678',
        },
        status: 'confirmed',
        totalPrice: '15000',
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: '10:00 AM',
        duration: 60,
        patientAddress: '123 Main Street',
        city: 'Lagos',
        state: 'Lagos',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '+234 801 234 5679',
        medicalConditions: 'Hypertension, Diabetes',
        currentMedications: 'Lisinopril, Metformin',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        serviceName: 'Wound Care',
        patient: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+234 802 345 6789',
        },
        status: 'completed',
        totalPrice: '12000',
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: '2:00 PM',
        duration: 45,
        patientAddress: '456 Oak Avenue',
        city: 'Abuja',
        state: 'FCT',
        emergencyContactName: 'Mike Johnson',
        emergencyContactPhone: '+234 802 345 6790',
        createdAt: new Date().toISOString(),
      },
    ];

    setAssignments(mockAssignments);
    setStats({
      totalAssignments: mockAssignments.length,
      completedToday: 1,
      upcomingToday: 1,
      monthlyEarnings: 125000,
      patientsSeen: 8,
      averageRating: 4.8,
    });
  };

  useEffect(() => {
    fetchNurseData();
  }, []);

  const updateAssignmentStatus = async (assignmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${assignmentId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: 'Status Updated',
          description: `Assignment status updated to ${newStatus}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchNurseData();
      }
    } catch (err: any) {
      toast({
        title: 'Update Failed',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

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

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(parseFloat(price));
  };

  const getTodaysAssignments = () => {
    const today = new Date().toDateString();
    return assignments.filter(assignment => 
      new Date(assignment.scheduledDate).toDateString() === today
    );
  };

  if (isLoading) {
    return (
      <Box 
        bg="gray.50" 
        minH="100vh"
        bgGradient="linear(135deg, green.25, blue.25)"
        position="relative"
        overflow="hidden"
      >
        {/* Floating Background Elements */}
        <Box
          position="absolute"
          top="10%"
          left="5%"
          w="80px"
          h="80px"
          borderRadius="full"
          bgGradient="linear(45deg, green.300, blue.300)"
          opacity="0.1"
          animation="float 6s ease-in-out infinite"
          sx={{
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px) scale(1)' },
              '50%': { transform: 'translateY(-20px) scale(1.05)' },
            },
          }}
        />
        <Box
          position="absolute"
          top="60%"
          right="8%"
          w="120px"
          h="120px"
          borderRadius="full"
          bgGradient="linear(135deg, green.200, purple.200)"
          opacity="0.08"
          animation="float 8s ease-in-out infinite reverse"
          sx={{
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px) scale(1)' },
              '50%': { transform: 'translateY(-15px) scale(1.03)' },
            },
          }}
        />
        
        <Center h="100vh">
          <VStack spacing={8}>
            {/* Enhanced Loading Spinner */}
            <Box
              w="24"
              h="24"
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                position="absolute"
                w="full"
                h="full"
                borderRadius="full"
                bgGradient="linear(45deg, green.400, blue.400)"
                opacity="0.2"
                animation="pulse-glow 2s ease-in-out infinite"
                sx={{
                  '@keyframes pulse-glow': {
                    '0%, 100%': { opacity: 0.2, transform: 'scale(1)' },
                    '50%': { opacity: 0.4, transform: 'scale(1.1)' },
                  },
                }}
              />
              <CircularProgress 
                size="20" 
                isIndeterminate 
                color="green.500"
                thickness="4px"
                sx={{
                  circle: {
                    strokeLinecap: 'round',
                  }
                }}
              />
              <Box
                position="absolute"
                w="12"
                h="12"
                borderRadius="full"
                bgGradient="linear(45deg, green.500, blue.500)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaUserNurse} color="white" fontSize="xl" />
              </Box>
            </Box>
            
            {/* Loading Text with Animation */}
            <VStack spacing={3}>
              <Text 
                fontSize="2xl" 
                fontWeight="800" 
                bgGradient="linear(45deg, green.600, blue.600)"
                bgClip="text"
                sx={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                textAlign="center"
              >
                Nurse Portal Loading...
              </Text>
              <Text 
                fontSize="md" 
                color="gray.600" 
                fontWeight="500"
                textAlign="center"
                maxW="400px"
              >
                Preparing your healthcare management dashboard with patient assignments and care tools
              </Text>
              
              {/* Animated Progress Dots */}
              <HStack spacing={2} pt={4}>
                {[0, 1, 2].map((index) => (
                  <Box
                    key={index}
                    w="3"
                    h="3"
                    borderRadius="full"
                    bg="green.400"
                    animation={`bounce 1.4s ease-in-out ${index * 0.16}s infinite both`}
                    sx={{
                      '@keyframes bounce': {
                        '0%, 80%, 100%': { 
                          transform: 'scale(0.7)',
                          opacity: 0.5,
                        },
                        '40%': { 
                          transform: 'scale(1)',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                ))}
              </HStack>
            </VStack>
          </VStack>
        </Center>
      </Box>
    );
  }

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box bg="gray.50" minH="100vh" position="relative" overflow="hidden">
      {/* Background Decorative Elements */}
      <Box
        position="absolute"
        top="5%"
        right="10%"
        w="200px"
        h="200px"
        borderRadius="full"
        bgGradient="linear(45deg, green.100, blue.100)"
        opacity="0.3"
        filter="blur(60px)"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="20%"
        left="5%"
        w="150px"
        h="150px"
        borderRadius="full"
        bgGradient="linear(135deg, green.200, purple.200)"
        opacity="0.2"
        filter="blur(40px)"
        zIndex={0}
      />
      
      <Container maxW="7xl" position="relative" zIndex={1} py={{ base: 4, md: 8 }}>
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          {/* Enhanced Professional Header */}
          <Card 
            bg={cardBg} 
            borderRadius={{ base: "xl", md: "2xl" }}
            boxShadow="0 10px 40px rgba(34, 197, 94, 0.15)"
            border="3px solid"
            borderColor="green.100"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '6px',
              bgGradient: 'linear(90deg, green.500, blue.500, purple.500)',
            }}
          >
            <CardBody p={{ base: 6, md: 8 }}>
              <Stack
                direction={{ base: "column", lg: "row" }} 
                justify="space-between" 
                align={{ base: "start", lg: "center" }}
                spacing={6}
              >
                {/* Left Side - Title & Description */}
                <VStack spacing={4} align="start" flex={1}>
                  <HStack spacing={4}>
                    <Box
                      p={4}
                      borderRadius="full"
                      bgGradient="linear(45deg, green.500, blue.500)"
                      color="white"
                      boxShadow="0 6px 20px rgba(34, 197, 94, 0.3)"
                    >
                      <Icon as={FaUserNurse} fontSize="2xl" />
                    </Box>
                    <VStack align="start" spacing={1}>
                      <Heading 
                        size={{ base: "lg", md: "xl" }} 
                        bgGradient="linear(45deg, green.600, blue.600)"
                        bgClip="text"
                        sx={{
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        Professional Care Portal
                      </Heading>
                      <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} fontWeight="500">
                        Welcome back, Healthcare Professional
                      </Text>
                    </VStack>
                  </HStack>
                  <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} maxW="600px" lineHeight="1.6">
                    Manage patient assignments, track care progress, and deliver exceptional healthcare services 
                    with our comprehensive nurse management system.
                  </Text>
                </VStack>
                
                {/* Right Side - Status & Avatar */}
                <VStack spacing={4} align={{ base: "start", lg: "end" }}>
                  {/* Availability Status Card */}
                  <Card 
                    bg={isAvailable ? "green.50" : "red.50"}
                    borderColor={isAvailable ? "green.200" : "red.200"}
                    borderWidth="2px"
                    borderRadius="xl"
                    p={4}
                    boxShadow={isAvailable ? "0 4px 15px rgba(34, 197, 94, 0.1)" : "0 4px 15px rgba(239, 68, 68, 0.1)"}
                  >
                    <VStack spacing={3}>
                      <HStack spacing={3}>
                        <Avatar
                          size="lg"
                          name="Nurse Professional"
                          bgGradient="linear(45deg, green.500, blue.500)"
                          color="white"
                          icon={<Icon as={FaStethoscope} fontSize="1.5rem" />}
                          border="3px solid white"
                          boxShadow="0 4px 15px rgba(34, 197, 94, 0.2)"
                        />
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                            Current Status
                          </Text>
                          <HStack spacing={2}>
                            <Box
                              w="3"
                              h="3"
                              borderRadius="full"
                              bg={isAvailable ? "green.500" : "red.500"}
                              animation={isAvailable ? "pulse 2s ease-in-out infinite" : "none"}
                              sx={isAvailable ? {
                                '@keyframes pulse': {
                                  '0%, 100%': { opacity: 1 },
                                  '50%': { opacity: 0.5 },
                                },
                              } : {}}
                            />
                            <Text 
                              fontWeight="700" 
                              color={isAvailable ? "green.700" : "red.700"}
                              fontSize="lg"
                            >
                              {isAvailable ? 'On Duty' : 'Off Duty'}
                            </Text>
                          </HStack>
                        </VStack>
                      </HStack>
                      
                      {/* Enhanced Availability Toggle */}
                      <FormControl 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                        bg="white"
                        borderRadius="lg"
                        p={3}
                        border="1px solid"
                        borderColor="gray.200"
                      >
                        <FormLabel 
                          htmlFor="availability" 
                          mb="0" 
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                          mr={3}
                        >
                          {isAvailable ? 'Available for Assignments' : 'Currently Unavailable'}
                        </FormLabel>
                        <Switch
                          id="availability"
                          colorScheme={isAvailable ? "green" : "red"}
                          size="lg"
                          isChecked={isAvailable}
                          onChange={(e) => setIsAvailable(e.target.checked)}
                        />
                      </FormControl>
                      
                      {/* Quick Stats Preview */}
                      {!isMobile && stats && (
                        <HStack spacing={4} pt={2}>
                          <VStack spacing={0}>
                            <Text fontSize="xl" fontWeight="800" color="green.600">
                              {stats.upcomingToday}
                            </Text>
                            <Text fontSize="xs" color="gray.500" textAlign="center">
                              Today
                            </Text>
                          </VStack>
                          <Divider orientation="vertical" h="30px" />
                          <VStack spacing={0}>
                            <Text fontSize="xl" fontWeight="800" color="blue.600">
                              {stats.completedToday}
                            </Text>
                            <Text fontSize="xs" color="gray.500" textAlign="center">
                              Done
                            </Text>
                          </VStack>
                        </HStack>
                      )}
                    </VStack>
                  </Card>
                </VStack>
              </Stack>
            </CardBody>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert status="error">
              <AlertIcon />
              <Text>{error}</Text>
            </Alert>
          )}

          {/* Revolutionary Healthcare Statistics Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {/* Today's Assignments Card */}
            <Card 
              bg={cardBg}
              borderRadius="2xl"
              border="3px solid"
              borderColor="blue.100" 
              position="relative"
              overflow="hidden"
              boxShadow="0 8px 25px rgba(59, 130, 246, 0.15)"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 12px 35px rgba(59, 130, 246, 0.25)",
                borderColor: "blue.300"
              }}
              transition="all 0.3s ease-in-out"
              cursor="pointer"
              _before={{
                content: '""',
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                bgGradient: 'linear(90deg, blue.400, blue.600)',
              }}
            >
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <HStack justify="space-between" w="full">
                    <Box
                      p={3}
                      borderRadius="xl"
                      bgGradient="linear(45deg, blue.500, blue.600)"
                      color="white"
                      boxShadow="0 4px 15px rgba(59, 130, 246, 0.3)"
                    >
                      <Icon as={FaCalendarCheck} fontSize="xl" />
                    </Box>
                    <Badge
                      colorScheme="blue"
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontWeight="700"
                    >
                      Active
                    </Badge>
                  </HStack>
                  
                  <VStack align="start" spacing={1} w="full">
                    <Text fontSize="sm" fontWeight="600" color="blue.600" textTransform="uppercase" letterSpacing="wide">
                      Today's Schedule
                    </Text>
                    <Text fontSize="3xl" fontWeight="900" color="blue.700" lineHeight="1">
                      {stats?.upcomingToday || 0}
                    </Text>
                    <Text fontSize="sm" color="gray.600" fontWeight="500">
                      Patient appointments scheduled
                    </Text>
                    
                    {/* Mini Progress Indicator */}
                    <Box w="full" pt={2}>
                      <Progress 
                        value={((stats?.upcomingToday || 0) / 8) * 100} 
                        colorScheme="blue" 
                        size="sm" 
                        borderRadius="full"
                        bg="blue.50"
                      />
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {stats?.upcomingToday || 0} of 8 daily capacity
                      </Text>
                    </Box>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Completed Visits Card */}
            <Card 
              bg={cardBg}
              borderRadius="2xl"
              border="3px solid"
              borderColor="green.100"
              position="relative"
              overflow="hidden"
              boxShadow="0 8px 25px rgba(34, 197, 94, 0.15)"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 12px 35px rgba(34, 197, 94, 0.25)",
                borderColor: "green.300"
              }}
              transition="all 0.3s ease-in-out"
              cursor="pointer"
              _before={{
                content: '""',
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                bgGradient: 'linear(90deg, green.400, green.600)',
              }}
            >
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <HStack justify="space-between" w="full">
                    <Box
                      p={3}
                      borderRadius="xl"
                      bgGradient="linear(45deg, green.500, green.600)"
                      color="white"
                      boxShadow="0 4px 15px rgba(34, 197, 94, 0.3)"
                    >
                      <Icon as={FaHeartbeat} fontSize="xl" />
                    </Box>
                    <Badge
                      colorScheme="green"
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontWeight="700"
                    >
                      Success
                    </Badge>
                  </HStack>
                  
                  <VStack align="start" spacing={1} w="full">
                    <Text fontSize="sm" fontWeight="600" color="green.600" textTransform="uppercase" letterSpacing="wide">
                      Completed Today
                    </Text>
                    <Text fontSize="3xl" fontWeight="900" color="green.700" lineHeight="1">
                      {stats?.completedToday || 0}
                    </Text>
                    <Text fontSize="sm" color="gray.600" fontWeight="500">
                      Successful patient visits
                    </Text>
                    
                    {/* Achievement Indicator */}
                    <HStack spacing={2} pt={2}>
                      <Icon as={FaAward} color="green.500" fontSize="sm" />
                      <Text fontSize="xs" color="green.600" fontWeight="600">
                        Excellent care delivery
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Monthly Earnings Card */}
            <Card 
              bg={cardBg}
              borderRadius="2xl"
              border="3px solid"
              borderColor="purple.100"
              position="relative"
              overflow="hidden"
              boxShadow="0 8px 25px rgba(147, 51, 234, 0.15)"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 12px 35px rgba(147, 51, 234, 0.25)",
                borderColor: "purple.300"
              }}
              transition="all 0.3s ease-in-out"
              cursor="pointer"
              _before={{
                content: '""',
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                bgGradient: 'linear(90deg, purple.400, purple.600)',
              }}
            >
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <HStack justify="space-between" w="full">
                    <Box
                      p={3}
                      borderRadius="xl"
                      bgGradient="linear(45deg, purple.500, purple.600)"
                      color="white"
                      boxShadow="0 4px 15px rgba(147, 51, 234, 0.3)"
                    >
                      <Icon as={FaChartLine} fontSize="xl" />
                    </Box>
                    <Badge
                      colorScheme="purple"
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontWeight="700"
                    >
                      70% Rate
                    </Badge>
                  </HStack>
                  
                  <VStack align="start" spacing={1} w="full">
                    <Text fontSize="sm" fontWeight="600" color="purple.600" textTransform="uppercase" letterSpacing="wide">
                      Monthly Earnings
                    </Text>
                    <Text fontSize="2xl" fontWeight="900" color="purple.700" lineHeight="1">
                      {formatPrice(stats?.monthlyEarnings?.toString() || '0')}
                    </Text>
                    <Text fontSize="sm" color="gray.600" fontWeight="500">
                      Professional healthcare income
                    </Text>
                    
                    {/* Earnings Progress */}
                    <Box w="full" pt={2}>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="xs" color="gray.500">Monthly Goal</Text>
                        <Text fontSize="xs" color="purple.600" fontWeight="600">85%</Text>
                      </HStack>
                      <Progress 
                        value={85} 
                        colorScheme="purple" 
                        size="sm" 
                        borderRadius="full"
                        bg="purple.50"
                      />
                    </Box>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Patient Rating & Performance Card */}
            <Card 
              bg={cardBg}
              borderRadius="2xl"
              border="3px solid"
              borderColor="orange.100"
              position="relative"
              overflow="hidden"
              boxShadow="0 8px 25px rgba(251, 146, 60, 0.15)"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 12px 35px rgba(251, 146, 60, 0.25)",
                borderColor: "orange.300"
              }}
              transition="all 0.3s ease-in-out"
              cursor="pointer"
              _before={{
                content: '""',
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                bgGradient: 'linear(90deg, orange.400, orange.600)',
              }}
            >
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <HStack justify="space-between" w="full">
                    <Box
                      p={3}
                      borderRadius="xl"
                      bgGradient="linear(45deg, orange.500, orange.600)"
                      color="white"
                      boxShadow="0 4px 15px rgba(251, 146, 60, 0.3)"
                    >
                      <Icon as={FaAward} fontSize="xl" />
                    </Box>
                    <Badge
                      colorScheme="orange"
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontWeight="700"
                    >
                      Excellence
                    </Badge>
                  </HStack>
                  
                  <VStack align="start" spacing={1} w="full">
                    <Text fontSize="sm" fontWeight="600" color="orange.600" textTransform="uppercase" letterSpacing="wide">
                      Patient Rating
                    </Text>
                    <HStack spacing={2}>
                      <Text fontSize="3xl" fontWeight="900" color="orange.700" lineHeight="1">
                        {stats?.averageRating || 0}
                      </Text>
                      <Text fontSize="xl" color="orange.500" fontWeight="700">/5</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" fontWeight="500">
                      Outstanding patient satisfaction
                    </Text>
                    
                    {/* Rating Stars */}
                    <HStack spacing={1} pt={2}>
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          as={FaHeart}
                          color={i < (stats?.averageRating || 0) ? "orange.500" : "gray.300"}
                          fontSize="sm"
                        />
                      ))}
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Nurse Quick Actions & Tools */}
          <Card 
            bg={cardBg}
            borderRadius="2xl"
            boxShadow="0 8px 25px rgba(34, 197, 94, 0.12)"
            border="2px solid"
            borderColor="green.100"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              bgGradient: 'linear(90deg, green.500, blue.500, purple.500)',
            }}
          >
            <CardHeader pb={0}>
              <HStack spacing={4}>
                <Box
                  p={3}
                  borderRadius="full"
                  bgGradient="linear(45deg, green.500, blue.500)"
                  color="white"
                >
                  <Icon as={FaHandHoldingMedical} fontSize="xl" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Heading size="md" color="gray.800">
                    Professional Care Tools
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Quick access to essential nursing workflows
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            
            <CardBody>
              <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={4}>
                {[
                  { icon: FaMedkit, label: "Emergency Kit", color: "red", action: "Check emergency supplies" },
                  { icon: FaFirstAid, label: "First Aid", color: "blue", action: "Access protocols" },
                  { icon: FaSyringe, label: "Medication", color: "purple", action: "Review prescriptions" },
                  { icon: FaThermometerHalf, label: "Vitals Check", color: "orange", action: "Record vital signs" },
                  { icon: FaNotesMedical, label: "Care Notes", color: "green", action: "Document patient care" },
                  { icon: FaUserShield, label: "Safety Protocol", color: "teal", action: "Review safety measures" },
                ].map((tool, index) => (
                  <Tooltip key={index} label={tool.action} hasArrow>
                    <Card
                      bg="white"
                      borderRadius="xl"
                      border="2px solid"
                      borderColor={`${tool.color}.100`}
                      p={4}
                      textAlign="center"
                      cursor="pointer"
                      transition="all 0.2s ease-in-out"
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: `0 6px 20px rgba(var(--chakra-colors-${tool.color}-500), 0.2)`,
                        borderColor: `${tool.color}.300`,
                      }}
                    >
                      <VStack spacing={3}>
                        <Box
                          p={3}
                          borderRadius="lg"
                          bg={`${tool.color}.50`}
                          color={`${tool.color}.600`}
                        >
                          <Icon as={tool.icon} fontSize="lg" />
                        </Box>
                        <Text 
                          fontSize="xs" 
                          fontWeight="600" 
                          color="gray.700"
                          textAlign="center"
                          lineHeight="1.2"
                        >
                          {tool.label}
                        </Text>
                      </VStack>
                    </Card>
                  </Tooltip>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Professional Healthcare Management Tabs */}
          <Card 
            bg={cardBg}
            borderRadius="2xl"
            boxShadow="0 8px 30px rgba(34, 197, 94, 0.12)"
            border="2px solid"
            borderColor="green.100"
          >
            <Tabs variant="soft-rounded" colorScheme="green" p={2}>
              <TabList 
                bg="gray.50" 
                borderRadius="xl" 
                p={2} 
                border="2px solid"
                borderColor="gray.100"
                overflowX="auto"
                sx={{
                  '&::-webkit-scrollbar': {
                    height: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    bg: 'gray.100',
                    borderRadius: 'full',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    bg: 'green.300',
                    borderRadius: 'full',
                  },
                }}
              >
                <Tab 
                  _selected={{ 
                    color: "white", 
                    bg: "linear-gradient(45deg, var(--chakra-colors-green-500), var(--chakra-colors-green-600))",
                    boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)" 
                  }}
                  borderRadius="lg"
                  fontWeight="600"
                  fontSize={{ base: "sm", md: "md" }}
                  minW="fit-content"
                  whiteSpace="nowrap"
                >
                  <HStack spacing={2}>
                    <Icon as={FaCalendarAlt} />
                    <Text>Today's Schedule</Text>
                    {stats?.upcomingToday && stats.upcomingToday > 0 && (
                      <Badge 
                        colorScheme="green" 
                        borderRadius="full" 
                        fontSize="xs"
                        minW="20px"
                        textAlign="center"
                      >
                        {stats.upcomingToday}
                      </Badge>
                    )}
                  </HStack>
                </Tab>
                <Tab 
                  _selected={{ 
                    color: "white", 
                    bg: "linear-gradient(45deg, var(--chakra-colors-blue-500), var(--chakra-colors-blue-600))",
                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" 
                  }}
                  borderRadius="lg"
                  fontWeight="600"
                  fontSize={{ base: "sm", md: "md" }}
                  minW="fit-content"
                  whiteSpace="nowrap"
                >
                  <HStack spacing={2}>
                    <Icon as={FaHospitalUser} />
                    <Text>All Assignments</Text>
                    {assignments.length > 0 && (
                      <Badge 
                        colorScheme="blue" 
                        borderRadius="full" 
                        fontSize="xs"
                        minW="20px"
                        textAlign="center"
                      >
                        {assignments.length}
                      </Badge>
                    )}
                  </HStack>
                </Tab>
                <Tab 
                  _selected={{ 
                    color: "white", 
                    bg: "linear-gradient(45deg, var(--chakra-colors-purple-500), var(--chakra-colors-purple-600))",
                    boxShadow: "0 4px 15px rgba(147, 51, 234, 0.3)" 
                  }}
                  borderRadius="lg"
                  fontWeight="600"
                  fontSize={{ base: "sm", md: "md" }}
                  minW="fit-content"
                  whiteSpace="nowrap"
                >
                  <HStack spacing={2}>
                    <Icon as={FaNotesMedical} />
                    <Text>Care Documentation</Text>
                  </HStack>
                </Tab>
                <Tab 
                  _selected={{ 
                    color: "white", 
                    bg: "linear-gradient(45deg, var(--chakra-colors-orange-500), var(--chakra-colors-orange-600))",
                    boxShadow: "0 4px 15px rgba(251, 146, 60, 0.3)" 
                  }}
                  borderRadius="lg"
                  fontWeight="600"
                  fontSize={{ base: "sm", md: "md" }}
                  minW="fit-content"
                  whiteSpace="nowrap"
                >
                  <HStack spacing={2}>
                    <Icon as={FaChartLine} />
                    <Text>Performance & Earnings</Text>
                  </HStack>
                </Tab>
              </TabList>

            <TabPanels>
              {/* Today's Schedule */}
              <TabPanel p={0} pt={6}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">Today's Schedule</Heading>
                    <Text color="gray.600" fontSize="sm">
                      {new Date().toLocaleDateString('en-NG', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Text>
                  </CardHeader>
                  <CardBody>
                    {getTodaysAssignments().length === 0 ? (
                      <VStack spacing={4} py={8}>
                        <Icon as={FaCalendarAlt} fontSize="4xl" color="gray.300" />
                        <Text color="gray.500">No appointments scheduled for today</Text>
                        <Text fontSize="sm" color="gray.400">
                          Enjoy your day off or check back for new assignments
                        </Text>
                      </VStack>
                    ) : (
                      <VStack spacing={4} align="stretch">
                        {getTodaysAssignments().map((assignment) => (
                          <Card key={assignment.id} variant="outline" borderWidth="2px">
                            <CardBody>
                              <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6}>
                                <VStack align="start" spacing={3}>
                                  <HStack justify="space-between" w="full">
                                    <VStack align="start" spacing={1}>
                                      <Heading size="sm" color="green.600">
                                        {assignment.patient.firstName} {assignment.patient.lastName}
                                      </Heading>
                                      <Text fontSize="sm" color="gray.600">
                                        {assignment.serviceName}
                                      </Text>
                                    </VStack>
                                    <Badge colorScheme={getStatusColor(assignment.status)}>
                                      {assignment.status.toUpperCase()}
                                    </Badge>
                                  </HStack>

                                  <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4} w="full">
                                    <VStack align="start" spacing={1}>
                                      <HStack>
                                        <Icon as={FaClock} color="blue.500" />
                                        <Text fontWeight="medium" fontSize="sm">Time</Text>
                                      </HStack>
                                      <Text fontSize="sm">{assignment.scheduledTime}</Text>
                                      <Text fontSize="xs" color="gray.500">
                                        Duration: {assignment.duration} mins
                                      </Text>
                                    </VStack>

                                    <VStack align="start" spacing={1}>
                                      <HStack>
                                        <Icon as={FaMapMarkerAlt} color="red.500" />
                                        <Text fontWeight="medium" fontSize="sm">Location</Text>
                                      </HStack>
                                      <Text fontSize="sm">{assignment.city}, {assignment.state}</Text>
                                      <Text fontSize="xs" color="gray.500">
                                        {assignment.patientAddress}
                                      </Text>
                                    </VStack>

                                    <VStack align="start" spacing={1}>
                                      <HStack>
                                        <Icon as={FaPhoneAlt} color="green.500" />
                                        <Text fontWeight="medium" fontSize="sm">Contact</Text>
                                      </HStack>
                                      <Text fontSize="sm">{assignment.patient.phone}</Text>
                                      <Text fontSize="xs" color="gray.500">
                                        Emergency: {assignment.emergencyContactPhone}
                                      </Text>
                                    </VStack>
                                  </Grid>

                                  {assignment.medicalConditions && (
                                    <Box w="full">
                                      <Text fontWeight="medium" fontSize="sm" mb={1}>
                                        Medical Conditions:
                                      </Text>
                                      <Text fontSize="sm" color="gray.600">
                                        {assignment.medicalConditions}
                                      </Text>
                                    </Box>
                                  )}
                                </VStack>

                                <VStack spacing={4}>
                                  <Text fontSize="xl" fontWeight="bold" color="green.600">
                                    {formatPrice(assignment.totalPrice)}
                                  </Text>
                                  
                                  <VStack spacing={2} w="full">
                                    {assignment.status === 'confirmed' && (
                                      <Button
                                        colorScheme="blue"
                                        size="sm"
                                        w="full"
                                        onClick={() => updateAssignmentStatus(assignment.id, 'in_progress')}
                                      >
                                        Start Visit
                                      </Button>
                                    )}
                                    {assignment.status === 'in_progress' && (
                                      <Button
                                        colorScheme="green"
                                        size="sm"
                                        w="full"
                                        onClick={() => updateAssignmentStatus(assignment.id, 'completed')}
                                      >
                                        Complete Visit
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      w="full"
                                      onClick={() => setSelectedAssignment(assignment)}
                                    >
                                      View Details
                                    </Button>
                                  </VStack>
                                </VStack>
                              </Grid>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    )}
                  </CardBody>
                </Card>
              </TabPanel>

              {/* All Assignments */}
              <TabPanel p={0} pt={6}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">All Assignments</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box overflowX="auto">
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Patient</Th>
                            <Th>Service</Th>
                            <Th>Date & Time</Th>
                            <Th>Status</Th>
                            <Th>Amount</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {assignments.map((assignment) => (
                            <Tr key={assignment.id}>
                              <Td>
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="medium" fontSize="sm">
                                    {assignment.patient.firstName} {assignment.patient.lastName}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {assignment.patient.phone}
                                  </Text>
                                </VStack>
                              </Td>
                              <Td>
                                <Text fontSize="sm">{assignment.serviceName}</Text>
                              </Td>
                              <Td>
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="sm">
                                    {new Date(assignment.scheduledDate).toLocaleDateString()}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {assignment.scheduledTime}
                                  </Text>
                                </VStack>
                              </Td>
                              <Td>
                                <Badge colorScheme={getStatusColor(assignment.status)}>
                                  {assignment.status.toUpperCase()}
                                </Badge>
                              </Td>
                              <Td fontWeight="medium" fontSize="sm">
                                {formatPrice(assignment.totalPrice)}
                              </Td>
                              <Td>
                                <Button size="xs" colorScheme="green">
                                  View
                                </Button>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Patient Care Notes */}
              <TabPanel p={0} pt={6}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">Patient Care Notes</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel>Select Patient</FormLabel>
                        <Select placeholder="Choose a patient">
                          {assignments.map((assignment) => (
                            <option key={assignment.id} value={assignment.id}>
                              {assignment.patient.firstName} {assignment.patient.lastName} - {assignment.serviceName}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>Care Notes</FormLabel>
                        <Textarea
                          placeholder="Enter patient care notes, observations, and treatment details..."
                          rows={6}
                        />
                      </FormControl>
                      
                      <Button colorScheme="green" w="fit-content">
                        Save Notes
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Earnings */}
              <TabPanel p={0} pt={6}>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                  <Card bg={cardBg}>
                    <CardHeader>
                      <Heading size="md">Earnings Summary</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4}>
                        <Box w="full">
                          <Flex justify="space-between" mb={2}>
                            <Text>This Month</Text>
                            <Text fontWeight="bold">
                              {formatPrice(stats?.monthlyEarnings?.toString() || '0')}
                            </Text>
                          </Flex>
                          <Progress value={70} colorScheme="green" />
                          <Text fontSize="xs" color="gray.500" mt={1}>
                            70% of monthly goal
                          </Text>
                        </Box>
                        
                        <Divider />
                        
                        <VStack spacing={2} w="full">
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm">Completed Visits</Text>
                            <Text fontSize="sm" fontWeight="medium">
                              {stats?.patientsSeen || 0}
                            </Text>
                          </HStack>
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm">Average per Visit</Text>
                            <Text fontSize="sm" fontWeight="medium">
                              {stats?.patientsSeen ? 
                                formatPrice(((stats?.monthlyEarnings || 0) / stats.patientsSeen).toString()) : 
                                '₦0'
                              }
                            </Text>
                          </HStack>
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm">Commission Rate</Text>
                            <Text fontSize="sm" fontWeight="medium">70%</Text>
                          </HStack>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg}>
                    <CardHeader>
                      <Heading size="md">Performance</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4}>
                        <Box w="full" textAlign="center">
                          <Text fontSize="3xl" fontWeight="bold" color="orange.500">
                            {stats?.averageRating || 0}/5
                          </Text>
                          <Text color="gray.600">Patient Rating</Text>
                        </Box>
                        
                        <Divider />
                        
                        <VStack spacing={2} w="full">
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm">On-time Arrivals</Text>
                            <Text fontSize="sm" fontWeight="medium" color="green.500">
                              98%
                            </Text>
                          </HStack>
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm">Patient Satisfaction</Text>
                            <Text fontSize="sm" fontWeight="medium" color="green.500">
                              96%
                            </Text>
                          </HStack>
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm">Monthly Bonus</Text>
                            <Text fontSize="sm" fontWeight="medium" color="purple.500">
                              Eligible
                            </Text>
                          </HStack>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </Grid>
              </TabPanel>
            </TabPanels>
            </Tabs>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default NurseDashboard;