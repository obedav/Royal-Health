import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Button,
  Icon,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  HStack,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Stack,
  useBreakpointValue,
  CircularProgress,
  CircularProgressLabel,
  Progress,
  Tooltip,
  Flex,
  Avatar,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
} from '@chakra-ui/react';
import {
  FaUsers,
  FaUserMd,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserPlus,
  FaFileExport,
  FaEye,
  FaEdit,
  FaExclamationTriangle,
  FaUserShield,
  FaCrown,
  FaChartLine,
  FaHeartbeat,
  FaHospital,
  FaClipboardCheck,
  FaBell,
  FaCog,
  FaDatabase,
  FaShieldAlt,
  FaUsers as FaUsersGroup,
  FaChartBar,
  FaTachometerAlt,
  FaGlobeAmericas,
  FaAward,
  FaRocket,
  FaBuilding,
  FaLock,
  FaUserTie,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

// Types
interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  revenue: number;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  phone: string;
  createdAt: string;
}

interface Booking {
  id: string;
  serviceType: string;
  serviceName: string;
  status: string;
  totalPrice: number;
  scheduledDate: string;
  scheduledTime: string;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  // Use the main auth system
  const { user, isAuthenticated, logout } = useAuth();
  
  // State
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Theme
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const toast = useToast();

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

  // Debug user info
  useEffect(() => {
    console.log('🔍 DEBUG: Current user data:', user);
    console.log('🔍 DEBUG: User role:', user?.role);
    console.log('🔍 DEBUG: Is authenticated:', isAuthenticated);
    
    // Check localStorage data
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    
    console.log('🔍 DEBUG: Stored user:', storedUser ? JSON.parse(storedUser) : null);
    console.log('🔍 DEBUG: Has token:', !!storedToken);
    
    if (storedToken) {
      console.log('🔍 DEBUG: Token (first 50 chars):', storedToken.substring(0, 50) + '...');
      
      // Decode JWT payload to see what's inside (just for debugging)
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        console.log('🔍 DEBUG: JWT payload:', payload);
      } catch (e) {
        console.log('🔍 DEBUG: Could not decode JWT');
      }
    }
  }, [user, isAuthenticated]);

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  // Fetch data from APIs
  const fetchData = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      setError('Please log in to access admin dashboard');
      return;
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      setLoading(false);
      setError(`Access denied. This dashboard requires admin privileges. Your current role: ${user.role}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔄 Fetching admin dashboard data...');
      console.log('🔍 Using API URL:', API_BASE_URL);
      console.log('🔍 User role:', user.role);

      // Fetch booking statistics
      try {
        console.log('📊 Fetching booking stats...');
        const statsResponse = await fetch(`${API_BASE_URL}/bookings/stats`, {
          headers: getAuthHeaders(),
        });

        console.log('📊 Stats response status:', statsResponse.status);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log('✅ Real booking stats:', statsData);
          setStats(statsData);
        } else if (statsResponse.status === 401) {
          throw new Error('Authentication expired');
        } else if (statsResponse.status === 403) {
          console.warn('⚠️ Stats endpoint returned 403 - insufficient permissions');
          setError('Insufficient permissions for booking stats');
        } else {
          console.warn('⚠️ Stats endpoint returned:', statsResponse.status);
        }
      } catch (err) {
        console.error('❌ Failed to fetch stats:', err);
      }

      // Fetch all bookings
      try {
        console.log('📅 Fetching all bookings...');
        const bookingsResponse = await fetch(`${API_BASE_URL}/bookings/all`, {
          headers: getAuthHeaders(),
        });

        console.log('📅 Bookings response status:', bookingsResponse.status);

        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          console.log('✅ Real bookings data:', bookingsData);
          setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        } else if (bookingsResponse.status === 401) {
          throw new Error('Authentication expired');
        } else if (bookingsResponse.status === 403) {
          console.warn('⚠️ Bookings endpoint returned 403 - insufficient permissions');
          setError('Insufficient permissions for bookings data');
        } else {
          console.warn('⚠️ Bookings endpoint returned:', bookingsResponse.status);
        }
      } catch (err) {
        console.error('❌ Failed to fetch bookings:', err);
      }

      // Fetch users
      try {
        console.log('👥 Fetching all users...');
        const usersResponse = await fetch(`${API_BASE_URL}/users`, {
          headers: getAuthHeaders(),
        });

        console.log('👥 Users response status:', usersResponse.status);

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          console.log('✅ Real users data:', usersData);
          setUsers(Array.isArray(usersData) ? usersData : []);
        } else if (usersResponse.status === 401) {
          throw new Error('Authentication expired');
        } else if (usersResponse.status === 403) {
          console.warn('⚠️ Users endpoint returned 403 - insufficient permissions');
          setError('Insufficient permissions for users data');
        } else {
          console.warn('⚠️ Users endpoint returned:', usersResponse.status);
        }
      } catch (err) {
        console.error('❌ Failed to fetch users:', err);
      }

    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      if (err instanceof Error && err.message === 'Authentication expired') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated, user]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show access denied if not admin
  if (user && user.role !== 'admin') {
    return (
      <Box bg={bg} minH="100vh">
        <Container maxW="md" py={20}>
          <VStack spacing={8} align="center">
            <Icon as={FaExclamationTriangle} fontSize="6xl" color="red.500" />
            <VStack spacing={4} textAlign="center">
              <Heading size="lg" color="gray.700">
                Access Denied
              </Heading>
              <Text color="gray.600">
                This dashboard requires admin privileges.
              </Text>
              <Text color="gray.500" fontSize="sm">
                Your current role: <Badge colorScheme="blue">{user.role}</Badge>
              </Text>
            </VStack>
            
            <VStack spacing={4}>
              <Button colorScheme="purple" onClick={() => window.history.back()}>
                Go Back
              </Button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </VStack>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Calculate derived stats
  const totalPatients = users.filter(user => user.role === 'client' || user.role === 'patient').length;
  const totalNurses = users.filter(user => user.role === 'nurse' || user.role === 'healthcare_professional').length;
  const todayBookings = bookings.filter(booking => {
    const today = new Date().toISOString().split('T')[0];
    return booking.scheduledDate === today;
  }).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'yellow';
      case 'confirmed':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  if (loading) {
    return (
      <Box 
        bg="gray.50" 
        minH="100vh"
        bgGradient="linear(135deg, purple.25, blue.25)"
        position="relative"
        overflow="hidden"
      >
        {/* Executive Background Elements */}
        <Box
          position="absolute"
          top="8%"
          left="3%"
          w="120px"
          h="120px"
          borderRadius="full"
          bgGradient="linear(45deg, purple.300, blue.300)"
          opacity="0.1"
          animation="float-executive 8s ease-in-out infinite"
          sx={{
            '@keyframes float-executive': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
              '33%': { transform: 'translateY(-15px) rotate(120deg) scale(1.05)' },
              '66%': { transform: 'translateY(-5px) rotate(240deg) scale(0.95)' },
            },
          }}
        />
        <Box
          position="absolute"
          top="70%"
          right="5%"
          w="80px"
          h="80px"
          borderRadius="full"
          bgGradient="linear(135deg, purple.200, indigo.200)"
          opacity="0.08"
          animation="float-executive 10s ease-in-out infinite reverse"
        />
        <Box
          position="absolute"
          bottom="10%"
          left="15%"
          w="100px"
          h="100px"
          borderRadius="full"
          bgGradient="linear(90deg, indigo.200, purple.200)"
          opacity="0.06"
          animation="pulse-glow-executive 6s ease-in-out infinite"
          sx={{
            '@keyframes pulse-glow-executive': {
              '0%, 100%': { opacity: 0.06, transform: 'scale(1)' },
              '50%': { opacity: 0.12, transform: 'scale(1.2)' },
            },
          }}
        />
        
        <Center h="100vh">
          <VStack spacing={10}>
            {/* Executive Loading Indicator */}
            <Box
              w="32"
              h="32"
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {/* Outer Ring */}
              <Box
                position="absolute"
                w="full"
                h="full"
                borderRadius="full"
                bgGradient="linear(45deg, purple.400, blue.400)"
                opacity="0.2"
                animation="pulse-glow-executive 3s ease-in-out infinite"
              />
              {/* Middle Ring */}
              <Box
                position="absolute"
                w="28"
                h="28"
                borderRadius="full"
                border="3px solid"
                borderColor="purple.300"
                opacity="0.4"
                animation="rotate-slow 8s linear infinite"
                sx={{
                  '@keyframes rotate-slow': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              {/* Circular Progress */}
              <CircularProgress 
                size="24" 
                isIndeterminate 
                color="purple.500"
                thickness="3px"
                sx={{
                  circle: {
                    strokeLinecap: 'round',
                  }
                }}
              />
              {/* Center Icon */}
              <Box
                position="absolute"
                w="16"
                h="16"
                borderRadius="full"
                bgGradient="linear(45deg, purple.600, indigo.600)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 8px 25px rgba(147, 51, 234, 0.3)"
              >
                <Icon as={FaCrown} color="white" fontSize="2xl" />
              </Box>
            </Box>
            
            {/* Executive Loading Text */}
            <VStack spacing={4}>
              <Text 
                fontSize="3xl" 
                fontWeight="900" 
                bgGradient="linear(45deg, purple.600, indigo.600)"
                bgClip="text"
                sx={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                textAlign="center"
                letterSpacing="tight"
              >
                Executive Command Center
              </Text>
              <Text 
                fontSize="lg" 
                color="gray.600" 
                fontWeight="600"
                textAlign="center"
                maxW="500px"
                lineHeight="1.6"
              >
                Initializing administrative dashboard with real-time healthcare analytics and system management tools
              </Text>
              
              {/* Executive Progress Indicators */}
              <VStack spacing={3} pt={6} w="400px">
                <Progress
                  value={85}
                  size="sm"
                  colorScheme="purple"
                  borderRadius="full"
                  bg="purple.100"
                  isAnimated
                  hasStripe
                />
                <HStack justify="space-between" w="full" fontSize="sm" color="gray.500">
                  <Text>Loading system metrics...</Text>
                  <Text fontWeight="600">85%</Text>
                </HStack>
              </VStack>
              
              {/* Animated Status Dots */}
              <HStack spacing={3} pt={4}>
                {[0, 1, 2, 3].map((index) => (
                  <Box
                    key={index}
                    w="4"
                    h="4"
                    borderRadius="full"
                    bg="purple.500"
                    animation={`bounce-executive 1.6s ease-in-out ${index * 0.2}s infinite both`}
                    sx={{
                      '@keyframes bounce-executive': {
                        '0%, 80%, 100%': { 
                          transform: 'scale(0.6)',
                          opacity: 0.4,
                        },
                        '40%': { 
                          transform: 'scale(1.2)',
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

  return (
    <Box bg="gray.50" minH="100vh" position="relative" overflow="hidden">
      {/* Executive Background Elements */}
      <Box
        position="absolute"
        top="3%"
        right="8%"
        w="250px"
        h="250px"
        borderRadius="full"
        bgGradient="linear(45deg, purple.100, indigo.100)"
        opacity="0.3"
        filter="blur(80px)"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="10%"
        left="5%"
        w="200px"
        h="200px"
        borderRadius="full"
        bgGradient="linear(135deg, purple.200, blue.200)"
        opacity="0.2"
        filter="blur(60px)"
        zIndex={0}
      />
      
      <Container maxW="7xl" position="relative" zIndex={1} py={{ base: 4, md: 8 }}>
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          {/* Executive Command Header */}
          <Card 
            bg={cardBg} 
            borderRadius={{ base: "xl", md: "2xl" }}
            boxShadow="0 12px 50px rgba(147, 51, 234, 0.15)"
            border="3px solid"
            borderColor="purple.100"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '8px',
              bgGradient: 'linear(90deg, purple.500, indigo.500, blue.500)',
            }}
          >
            <CardBody p={{ base: 6, md: 10 }}>
              <Stack
                direction={{ base: "column", lg: "row" }} 
                justify="space-between" 
                align={{ base: "start", lg: "center" }}
                spacing={8}
              >
                {/* Executive Info Section */}
                <VStack spacing={6} align="start" flex={1}>
                  <HStack spacing={6}>
                    <Box
                      p={5}
                      borderRadius="full"
                      bgGradient="linear(45deg, purple.600, indigo.600)"
                      color="white"
                      boxShadow="0 8px 30px rgba(147, 51, 234, 0.4)"
                      position="relative"
                      _before={{
                        content: '""',
                        position: 'absolute',
                        top: '-3px',
                        left: '-3px',
                        right: '-3px',
                        bottom: '-3px',
                        borderRadius: 'full',
                        bgGradient: 'linear(45deg, purple.400, indigo.400)',
                        zIndex: -1,
                        opacity: 0.3,
                      }}
                    >
                      <Icon as={FaCrown} fontSize="3xl" />
                    </Box>
                    <VStack align="start" spacing={2}>
                      <Heading 
                        size={{ base: "lg", md: "2xl" }} 
                        bgGradient="linear(45deg, purple.700, indigo.700)"
                        bgClip="text"
                        sx={{
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                        letterSpacing="tight"
                      >
                        Executive Command Center
                      </Heading>
                      <HStack spacing={4}>
                        <Text color="gray.600" fontSize={{ base: "md", md: "lg" }} fontWeight="600">
                          Welcome back, {user?.firstName} {user?.lastName}
                        </Text>
                        <Badge
                          colorScheme="purple"
                          fontSize="sm"
                          px={4}
                          py={2}
                          borderRadius="full"
                          fontWeight="700"
                          textTransform="uppercase"
                          letterSpacing="wide"
                        >
                          <HStack spacing={2}>
                            <Icon as={FaUserShield} />
                            <Text>Administrator</Text>
                          </HStack>
                        </Badge>
                      </HStack>
                    </VStack>
                  </HStack>
                  
                  <Text color="gray.700" fontSize={{ base: "sm", md: "md" }} maxW="700px" lineHeight="1.7" fontWeight="500">
                    <Text as="span" fontWeight="800" color="purple.700">Royal Health Command Suite:</Text>
                    {" "}Comprehensive healthcare system administration with real-time analytics, user management, 
                    and operational oversight for optimal patient care delivery.
                  </Text>
                  
                  {/* Quick Status Indicators */}
                  {!isMobile && (
                    <HStack spacing={8} pt={2}>
                      <VStack spacing={1}>
                        <HStack spacing={2}>
                          <Box w="3" h="3" borderRadius="full" bg="green.500" animation="pulse 2s ease-in-out infinite" />
                          <Text fontSize="sm" color="green.700" fontWeight="700">System Online</Text>
                        </HStack>
                        <Text fontSize="xs" color="gray.500">All services operational</Text>
                      </VStack>
                      <Divider orientation="vertical" h="40px" />
                      <VStack spacing={1}>
                        <HStack spacing={2}>
                          <Box w="3" h="3" borderRadius="full" bg="blue.500" animation="pulse 2s ease-in-out infinite 0.5s" />
                          <Text fontSize="sm" color="blue.700" fontWeight="700">Live Data</Text>
                        </HStack>
                        <Text fontSize="xs" color="gray.500">Real-time updates</Text>
                      </VStack>
                      <Divider orientation="vertical" h="40px" />
                      <VStack spacing={1}>
                        <HStack spacing={2}>
                          <Box w="3" h="3" borderRadius="full" bg="purple.500" animation="pulse 2s ease-in-out infinite 1s" />
                          <Text fontSize="sm" color="purple.700" fontWeight="700">Secure Access</Text>
                        </HStack>
                        <Text fontSize="xs" color="gray.500">End-to-end encryption</Text>
                      </VStack>
                    </HStack>
                  )}
                </VStack>
                
                {/* Executive Actions Panel */}
                <VStack spacing={6} align={{ base: "start", lg: "end" }}>
                  {/* Admin Avatar & Info */}
                  <Card 
                    bg="white"
                    borderRadius="xl"
                    p={6}
                    border="2px solid"
                    borderColor="purple.100"
                    boxShadow="0 8px 25px rgba(147, 51, 234, 0.1)"
                  >
                    <VStack spacing={4}>
                      <Avatar
                        size="xl"
                        name={`${user?.firstName} ${user?.lastName}`}
                        bgGradient="linear(45deg, purple.600, indigo.600)"
                        color="white"
                        border="4px solid white"
                        boxShadow="0 8px 25px rgba(147, 51, 234, 0.2)"
                      />
                      <VStack spacing={2}>
                        <Text fontWeight="800" fontSize="lg" color="gray.800" textAlign="center">
                          {user?.firstName} {user?.lastName}
                        </Text>
                        <Badge
                          colorScheme="purple"
                          fontSize="xs"
                          px={3}
                          py={1}
                          borderRadius="full"
                          textTransform="uppercase"
                          letterSpacing="wide"
                        >
                          Chief Administrator
                        </Badge>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          Royal Health Systems
                        </Text>
                      </VStack>
                    </VStack>
                  </Card>
                  
                  {/* Executive Actions */}
                  <HStack spacing={4}>
                    <Tooltip label="Export comprehensive system reports" hasArrow>
                      <Button
                        leftIcon={<FaFileExport />}
                        bgGradient="linear(45deg, purple.500, purple.600)"
                        color="white"
                        size="lg"
                        borderRadius="xl"
                        fontWeight="700"
                        boxShadow="0 6px 20px rgba(147, 51, 234, 0.3)"
                        _hover={{
                          bgGradient: "linear(45deg, purple.600, purple.700)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 30px rgba(147, 51, 234, 0.4)"
                        }}
                        transition="all 0.2s ease-in-out"
                        onClick={() => toast({
                          title: 'Executive Report Export',
                          description: 'Comprehensive analytics report generation initiated',
                          status: 'info',
                          duration: 4000,
                        })}
                      >
                        Export Analytics
                      </Button>
                    </Tooltip>
                    
                    <Tooltip label="System configuration and settings" hasArrow>
                      <Button
                        leftIcon={<FaCog />}
                        variant="outline"
                        borderColor="purple.500"
                        color="purple.600"
                        size="lg"
                        borderRadius="xl"
                        fontWeight="700"
                        borderWidth="2px"
                        _hover={{
                          bg: "purple.50",
                          color: "purple.700",
                          transform: "translateY(-2px)",
                          borderColor: "purple.600"
                        }}
                        transition="all 0.2s ease-in-out"
                      >
                        Settings
                      </Button>
                    </Tooltip>
                  </HStack>
                </VStack>
              </Stack>
            </CardBody>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert status="warning">
              <AlertIcon />
              <Box>
                <AlertTitle>Notice</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
            </Alert>
          )}

          {/* Executive Healthcare Analytics Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {/* Total Patient Network */}
            <Card 
              bg={cardBg}
              borderRadius="2xl"
              border="3px solid"
              borderColor="blue.100" 
              position="relative"
              overflow="hidden"
              boxShadow="0 10px 40px rgba(59, 130, 246, 0.15)"
              _hover={{
                transform: "translateY(-6px)",
                boxShadow: "0 16px 50px rgba(59, 130, 246, 0.25)",
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
                height: '5px',
                bgGradient: 'linear(90deg, blue.400, blue.600)',
              }}
            >
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack justify="space-between" w="full">
                    <Box
                      p={4}
                      borderRadius="xl"
                      bgGradient="linear(45deg, blue.500, blue.600)"
                      color="white"
                      boxShadow="0 6px 20px rgba(59, 130, 246, 0.3)"
                    >
                      <Icon as={FaHospital} fontSize="2xl" />
                    </Box>
                    <Badge
                      colorScheme="blue"
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontWeight="700"
                    >
                      Active Network
                    </Badge>
                  </HStack>
                  
                  <VStack align="start" spacing={3} w="full">
                    <Text fontSize="sm" fontWeight="600" color="blue.600" textTransform="uppercase" letterSpacing="wide">
                      Patient Network
                    </Text>
                    <Text fontSize="4xl" fontWeight="900" color="blue.700" lineHeight="1">
                      {totalPatients}
                    </Text>
                    <Text fontSize="sm" color="gray.600" fontWeight="500">
                      Registered healthcare members
                    </Text>
                    
                    {/* Growth Indicator */}
                    <HStack spacing={2} pt={2}>
                      <Icon as={FaChartLine} color="green.500" fontSize="sm" />
                      <Text fontSize="xs" color="green.600" fontWeight="600">
                        +12% growth this month
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Healthcare Professionals */}
            <Card 
              bg={cardBg}
              borderRadius="2xl"
              border="3px solid"
              borderColor="green.100"
              position="relative"
              overflow="hidden"
              boxShadow="0 10px 40px rgba(34, 197, 94, 0.15)"
              _hover={{
                transform: "translateY(-6px)",
                boxShadow: "0 16px 50px rgba(34, 197, 94, 0.25)",
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
                height: '5px',
                bgGradient: 'linear(90deg, green.400, green.600)',
              }}
            >
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack justify="space-between" w="full">
                    <Box
                      p={4}
                      borderRadius="xl"
                      bgGradient="linear(45deg, green.500, green.600)"
                      color="white"
                      boxShadow="0 6px 20px rgba(34, 197, 94, 0.3)"
                    >
                      <Icon as={FaUserMd} fontSize="2xl" />
                    </Box>
                    <Badge
                      colorScheme="green"
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontWeight="700"
                    >
                      On Duty
                    </Badge>
                  </HStack>
                  
                  <VStack align="start" spacing={3} w="full">
                    <Text fontSize="sm" fontWeight="600" color="green.600" textTransform="uppercase" letterSpacing="wide">
                      Medical Staff
                    </Text>
                    <Text fontSize="4xl" fontWeight="900" color="green.700" lineHeight="1">
                      {totalNurses}
                    </Text>
                    <Text fontSize="sm" color="gray.600" fontWeight="500">
                      Healthcare professionals active
                    </Text>
                    
                    {/* Staff Utilization */}
                    <Box w="full" pt={2}>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="xs" color="gray.500">Staff Utilization</Text>
                        <Text fontSize="xs" color="green.600" fontWeight="600">92%</Text>
                      </HStack>
                      <Progress 
                        value={92} 
                        colorScheme="green" 
                        size="sm" 
                        borderRadius="full"
                        bg="green.50"
                      />
                    </Box>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Daily Operations */}
            <Card 
              bg={cardBg}
              borderRadius="2xl"
              border="3px solid"
              borderColor="orange.100"
              position="relative"
              overflow="hidden"
              boxShadow="0 10px 40px rgba(251, 146, 60, 0.15)"
              _hover={{
                transform: "translateY(-6px)",
                boxShadow: "0 16px 50px rgba(251, 146, 60, 0.25)",
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
                height: '5px',
                bgGradient: 'linear(90deg, orange.400, orange.600)',
              }}
            >
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack justify="space-between" w="full">
                    <Box
                      p={4}
                      borderRadius="xl"
                      bgGradient="linear(45deg, orange.500, orange.600)"
                      color="white"
                      boxShadow="0 6px 20px rgba(251, 146, 60, 0.3)"
                    >
                      <Icon as={FaCalendarAlt} fontSize="2xl" />
                    </Box>
                    <Badge
                      colorScheme="orange"
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontWeight="700"
                    >
                      Today
                    </Badge>
                  </HStack>
                  
                  <VStack align="start" spacing={3} w="full">
                    <Text fontSize="sm" fontWeight="600" color="orange.600" textTransform="uppercase" letterSpacing="wide">
                      Daily Operations
                    </Text>
                    <Text fontSize="4xl" fontWeight="900" color="orange.700" lineHeight="1">
                      {todayBookings}
                    </Text>
                    <Text fontSize="sm" color="gray.600" fontWeight="500">
                      Appointments scheduled today
                    </Text>
                    
                    {/* Operational Efficiency */}
                    <HStack spacing={2} pt={2}>
                      <CircularProgress
                        value={88}
                        size="20px"
                        color="orange.500"
                        thickness="8px"
                      />
                      <Text fontSize="xs" color="orange.600" fontWeight="600">
                        88% efficiency rate
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Revenue Analytics */}
            <Card 
              bg={cardBg}
              borderRadius="2xl"
              border="3px solid"
              borderColor="purple.100"
              position="relative"
              overflow="hidden"
              boxShadow="0 10px 40px rgba(147, 51, 234, 0.15)"
              _hover={{
                transform: "translateY(-6px)",
                boxShadow: "0 16px 50px rgba(147, 51, 234, 0.25)",
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
                height: '5px',
                bgGradient: 'linear(90deg, purple.400, purple.600)',
              }}
            >
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack justify="space-between" w="full">
                    <Box
                      p={4}
                      borderRadius="xl"
                      bgGradient="linear(45deg, purple.500, purple.600)"
                      color="white"
                      boxShadow="0 6px 20px rgba(147, 51, 234, 0.3)"
                    >
                      <Icon as={FaChartBar} fontSize="2xl" />
                    </Box>
                    <Badge
                      colorScheme="purple"
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontWeight="700"
                    >
                      Growth
                    </Badge>
                  </HStack>
                  
                  <VStack align="start" spacing={3} w="full">
                    <Text fontSize="sm" fontWeight="600" color="purple.600" textTransform="uppercase" letterSpacing="wide">
                      Revenue Analytics
                    </Text>
                    <Text fontSize="3xl" fontWeight="900" color="purple.700" lineHeight="1">
                      {formatCurrency(stats?.revenue || 0)}
                    </Text>
                    <Text fontSize="sm" color="gray.600" fontWeight="500">
                      Total healthcare revenue
                    </Text>
                    
                    {/* Revenue Trend */}
                    <Box w="full" pt={2}>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="xs" color="gray.500">Monthly Target</Text>
                        <Text fontSize="xs" color="purple.600" fontWeight="600">95%</Text>
                      </HStack>
                      <Progress 
                        value={95} 
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
          </SimpleGrid>

          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
            {/* Booking Statistics */}
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardHeader>
                <Heading size="md" color="gray.700">
                  Booking Statistics
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {stats ? (
                    <>
                      <HStack justify="space-between">
                        <Text>Total Bookings</Text>
                        <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                          {stats.total}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Pending</Text>
                        <Badge colorScheme="yellow" fontSize="md" px={3} py={1}>
                          {stats.pending}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Confirmed</Text>
                        <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                          {stats.confirmed}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Completed</Text>
                        <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                          {stats.completed}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Cancelled</Text>
                        <Badge colorScheme="red" fontSize="md" px={3} py={1}>
                          {stats.cancelled}
                        </Badge>
                      </HStack>
                    </>
                  ) : (
                    <Center py={8}>
                      <Text color="gray.500">No booking statistics available</Text>
                    </Center>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardHeader>
                <Heading size="md" color="gray.700">
                  Quick Actions
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Button
                    leftIcon={<FaUserPlus />}
                    colorScheme="purple"
                    variant="outline"
                    onClick={() => toast({
                      title: 'Add Nurse',
                      description: 'Redirect to add nurse form',
                      status: 'info',
                      duration: 3000,
                    })}
                  >
                    Add Healthcare Professional
                  </Button>
                  
                  <Button
                    leftIcon={<FaCalendarAlt />}
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => toast({
                      title: 'View Calendar',
                      description: 'Opening appointment calendar',
                      status: 'info',
                      duration: 3000,
                    })}
                  >
                    View Appointment Calendar
                  </Button>
                  
                  <Button
                    leftIcon={<FaFileExport />}
                    colorScheme="green"
                    variant="outline"
                    onClick={() => toast({
                      title: 'Generate Report',
                      description: 'Creating monthly report',
                      status: 'info',
                      duration: 3000,
                    })}
                  >
                    Generate Monthly Report
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </Grid>

          {/* Recent Bookings */}
          <Card bg={cardBg} shadow="lg" borderRadius="xl">
            <CardHeader>
              <Heading size="md" color="gray.700">
                Recent Bookings ({bookings.length} total)
              </Heading>
            </CardHeader>
            <CardBody>
              {bookings.length > 0 ? (
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Patient</Th>
                        <Th>Service</Th>
                        <Th>Date & Time</Th>
                        <Th>Amount</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {bookings.slice(0, 10).map((booking) => (
                        <Tr key={booking.id}>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium">
                                {booking.patient.firstName} {booking.patient.lastName}
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                {booking.patient.email}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium">{booking.serviceName}</Text>
                              <Text fontSize="sm" color="gray.500">
                                {booking.serviceType}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text>{new Date(booking.scheduledDate).toLocaleDateString()}</Text>
                              <Text fontSize="sm" color="gray.500">
                                {booking.scheduledTime}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <Text fontWeight="bold" color="green.600">
                              {formatCurrency(booking.totalPrice)}
                            </Text>
                          </Td>
                          <Td>
                            <Badge 
                              colorScheme={getStatusColor(booking.status)}
                              textTransform="capitalize"
                            >
                              {booking.status}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Button size="sm" variant="ghost" colorScheme="blue">
                                <FaEye />
                              </Button>
                              <Button size="sm" variant="ghost" colorScheme="green">
                                <FaEdit />
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Center py={8}>
                  <VStack spacing={4}>
                    <Icon as={FaCalendarAlt} fontSize="4xl" color="gray.400" />
                    <Text color="gray.500">No bookings found</Text>
                    <Text fontSize="sm" color="gray.400">
                      Bookings will appear here once patients start making appointments
                    </Text>
                  </VStack>
                </Center>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminDashboard;