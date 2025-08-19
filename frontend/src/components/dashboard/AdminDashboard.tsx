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

  if (loading) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="purple.500" thickness="4px" />
          <Text>Loading admin dashboard...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box bg={bg} minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={2}>
              <Heading size="xl" color="purple.600">
                Admin Dashboard
              </Heading>
              <Text color="gray.600">
                Welcome back, {user?.firstName} {user?.lastName}
              </Text>
              <Badge colorScheme="green">Role: {user?.role}</Badge>
            </VStack>
            
            <HStack spacing={4}>
              <Badge colorScheme="green" px={3} py={1}>
                Live Data
              </Badge>
              <Button
                leftIcon={<FaFileExport />}
                colorScheme="purple"
                variant="outline"
                onClick={() => toast({
                  title: 'Export Started',
                  description: 'Report will be ready shortly',
                  status: 'info',
                  duration: 3000,
                })}
              >
                Export Report
              </Button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </HStack>
          </HStack>

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

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {/* Total Patients */}
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <StatLabel color="gray.600" fontSize="sm">
                        Total Patients
                      </StatLabel>
                      <StatNumber fontSize="3xl" color="blue.600">
                        {totalPatients}
                      </StatNumber>
                      <StatLabel color="blue.500" fontSize="sm">
                        Registered users
                      </StatLabel>
                    </VStack>
                    <Icon as={FaUsers} fontSize="3xl" color="blue.500" />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>

            {/* Active Nurses */}
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <StatLabel color="gray.600" fontSize="sm">
                        Healthcare Professionals
                      </StatLabel>
                      <StatNumber fontSize="3xl" color="green.600">
                        {totalNurses}
                      </StatNumber>
                      <StatLabel color="green.500" fontSize="sm">
                        Active staff
                      </StatLabel>
                    </VStack>
                    <Icon as={FaUserMd} fontSize="3xl" color="green.500" />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>

            {/* Today's Appointments */}
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <StatLabel color="gray.600" fontSize="sm">
                        Today's Appointments
                      </StatLabel>
                      <StatNumber fontSize="3xl" color="orange.600">
                        {todayBookings}
                      </StatNumber>
                      <StatLabel color="orange.500" fontSize="sm">
                        Scheduled for today
                      </StatLabel>
                    </VStack>
                    <Icon as={FaCalendarAlt} fontSize="3xl" color="orange.500" />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>

            {/* Total Revenue */}
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <StatLabel color="gray.600" fontSize="sm">
                        Total Revenue
                      </StatLabel>
                      <StatNumber fontSize="3xl" color="purple.600">
                        {formatCurrency(stats?.revenue || 0)}
                      </StatNumber>
                      <StatLabel color="purple.500" fontSize="sm">
                        From bookings
                      </StatLabel>
                    </VStack>
                    <Icon as={FaMoneyBillWave} fontSize="3xl" color="purple.500" />
                  </HStack>
                </Stat>
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