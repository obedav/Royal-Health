// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Center,
  useColorModeValue,
  Badge,
  Avatar,
} from '@chakra-ui/react'
import { FaUser, FaUserMd, FaUserShield, FaSignOutAlt, FaDashcube, FaHome } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

// Import all dashboard components
import PatientDashboard from '../components/dashboard/PatientDashboard'
import AdminDashboard from '../components/dashboard/AdminDashboard'
import NurseDashboard from '../components/dashboard/NurseDashboard'
import { useAuth } from '../hooks/useAuth'

type UserRole = 'client' | 'nurse' | 'admin'

interface DashboardUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardUser, setDashboardUser] = useState<DashboardUser | null>(null)

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      try {
        // In a real app, this would fetch user data from your API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (isAuthenticated && user) {
          // Mock user data based on auth state
          const mockUser: DashboardUser = {
            id: user.id || '1',
            name: `${user.firstName || 'John'} ${user.lastName || 'Doe'}`,
            email: user.email || 'user@example.com',
            role: user.role as UserRole || 'client',
            avatar: undefined
          }
          setDashboardUser(mockUser)
        } else {
          // Redirect to login if not authenticated
          navigate('/login')
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        navigate('/login')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [isAuthenticated, user, navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleRoleSwitch = (role: UserRole) => {
    // For demo purposes, allow role switching
    if (dashboardUser) {
      setDashboardUser({
        ...dashboardUser,
        role
      })
    }
  }

  // Get role-specific styling
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          color: 'purple',
          bgGradient: 'linear(135deg, purple.500, purple.600)',
          icon: FaUserShield,
          title: 'Admin Panel',
          description: 'Manage system and oversee operations'
        }
      case 'nurse':
        return {
          color: 'green',
          bgGradient: 'linear(135deg, green.500, green.600)',
          icon: FaUserMd,
          title: 'Nurse Portal',
          description: 'Manage appointments and patient care'
        }
      case 'client':
      default:
        return {
          color: 'brand',
          bgGradient: 'linear(135deg, brand.500, brand.600)',
          icon: FaUser,
          title: 'Patient Portal',
          description: 'Manage your health and appointments'
        }
    }
  }

  const currentRoleConfig = dashboardUser ? getRoleConfig(dashboardUser.role) : getRoleConfig('client')

  // Loading state - Enhanced
  if (isLoading) {
    return (
      <Box 
        bg="gray.50" 
        minH="100vh"
        bgGradient="linear(135deg, brand.25, purple.25)"
      >
        <Center h="100vh">
          <VStack spacing={6}>
            <Box
              w="20"
              h="20"
              bgGradient="linear(45deg, brand.500, purple.500)"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                right: '-4px',
                bottom: '-4px',
                bgGradient: 'linear(45deg, brand.400, purple.400)',
                borderRadius: 'full',
                zIndex: -1,
                opacity: 0.3,
              }}
            >
              <Spinner size="lg" color="white" thickness="3px" />
            </Box>
            <VStack spacing={2}>
              <Text fontSize="xl" fontWeight="700" color="gray.800">
                Loading your dashboard...
              </Text>
              <Text fontSize="sm" color="gray.600" fontWeight="500">
                Please wait while we prepare your personalized experience
              </Text>
            </VStack>
          </VStack>
        </Center>
      </Box>
    )
  }

  // Not authenticated or no user data - Enhanced
  if (!dashboardUser) {
    return (
      <Box 
        bg="gray.50" 
        minH="100vh" 
        py={8}
        bgGradient="linear(135deg, red.25, red.50)"
      >
        <Container maxW="4xl">
          <Center minH="80vh">
            <VStack spacing={8}>
              <Alert 
                status="error" 
                borderRadius="2xl"
                p={8}
                maxW="md"
                flexDirection="column"
                textAlign="center"
                border="2px solid"
                borderColor="red.300"
                bg="red.50"
                boxShadow="0 10px 25px rgba(220, 38, 38, 0.15)"
              >
                <AlertIcon boxSize="3rem" />
                <Box>
                  <AlertTitle fontSize="xl" fontWeight="800" mb={2}>
                    Access Denied!
                  </AlertTitle>
                  <AlertDescription fontSize="md" fontWeight="500">
                    You need to be logged in to access the dashboard.
                  </AlertDescription>
                </Box>
              </Alert>
              <VStack spacing={4}>
                <Button 
                  bgGradient="linear(45deg, brand.500, purple.500)"
                  color="white"
                  size="lg"
                  onClick={() => navigate('/login')}
                  borderRadius="xl"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="700"
                  boxShadow="0 8px 25px rgba(194, 24, 91, 0.25)"
                  _hover={{
                    bgGradient: "linear(45deg, brand.600, purple.600)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(194, 24, 91, 0.35)"
                  }}
                  transition="all 0.2s ease-in-out"
                >
                  Go to Login
                </Button>
                <Button 
                  variant="outline"
                  borderColor="brand.500"
                  color="brand.500"
                  size="lg"
                  onClick={() => navigate('/')}
                  borderRadius="xl"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="600"
                  borderWidth="2px"
                  _hover={{
                    bg: "brand.50",
                    borderColor: "brand.600",
                    color: "brand.600",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s ease-in-out"
                  leftIcon={<FaHome />}
                >
                  Go Home
                </Button>
              </VStack>
            </VStack>
          </Center>
        </Container>
      </Box>
    )
  }

  // Role-based dashboard rendering
  const renderDashboard = () => {
    console.log('🎯 Rendering dashboard for role:', dashboardUser.role) // Debug log
    
    switch (dashboardUser.role) {
      case 'admin':
        console.log('📊 Loading AdminDashboard component')
        return <AdminDashboard />
      case 'nurse':
        console.log('🏥 Loading NurseDashboard component')
        return <NurseDashboard />
      case 'client':
      default:
        console.log('👤 Loading PatientDashboard component')
        return <PatientDashboard />
    }
  }

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Dashboard Header - Enhanced */}
      <Box 
        bg="white" 
        borderBottom="3px solid" 
        borderColor="brand.200"
        py={6}
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '4px',
          bgGradient: 'linear(90deg, brand.500, purple.500)',
        }}
        boxShadow="0 4px 20px rgba(194, 24, 91, 0.08)"
      >
        <Container maxW="7xl">
          <HStack justify="space-between" align="center">
            {/* User Info Section - Enhanced */}
            <HStack spacing={4}>
              <Avatar
                size="lg"
                name={dashboardUser.name}
                bg={currentRoleConfig.bgGradient}
                color="white"
                fontWeight="bold"
                border="3px solid"
                borderColor="white"
                boxShadow="0 4px 15px rgba(194, 24, 91, 0.2)"
              />
              
              <VStack spacing={1} align="start">
                <HStack spacing={3} align="center">
                  <Heading size="lg" color="gray.800" fontWeight="800">
                    {currentRoleConfig.title}
                  </Heading>
                  <Badge
                    bgGradient={currentRoleConfig.bgGradient}
                    color="white"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="700"
                    textTransform="capitalize"
                  >
                    <HStack spacing={1}>
                      <Icon as={currentRoleConfig.icon} fontSize="xs" />
                      <Text>{dashboardUser.role}</Text>
                    </HStack>
                  </Badge>
                </HStack>
                <VStack spacing={0} align="start">
                  <Text fontSize="md" color="gray.600" fontWeight="600">
                    Welcome back, {dashboardUser.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500" fontWeight="500">
                    {currentRoleConfig.description}
                  </Text>
                </VStack>
              </VStack>
            </HStack>

            <HStack spacing={6}>
              {/* Demo Role Switcher - Enhanced */}
              <VStack spacing={3}>
                <Text fontSize="xs" color="gray.500" fontWeight="700" textTransform="uppercase" letterSpacing="wide">
                  Demo: Switch Role
                </Text>
                <HStack spacing={3}>
                  <Button
                    size="md"
                    variant={dashboardUser.role === 'client' ? 'solid' : 'outline'}
                    bgGradient={dashboardUser.role === 'client' ? "linear(45deg, brand.500, brand.600)" : undefined}
                    color={dashboardUser.role === 'client' ? "white" : "brand.600"}
                    borderColor="brand.500"
                    borderWidth="2px"
                    leftIcon={<FaUser />}
                    onClick={() => handleRoleSwitch('client')}
                    borderRadius="xl"
                    fontWeight="700"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: dashboardUser.role === 'client' 
                        ? "0 6px 20px rgba(194, 24, 91, 0.3)" 
                        : "0 4px 12px rgba(194, 24, 91, 0.15)",
                      ...(dashboardUser.role !== 'client' && {
                        bg: "brand.50",
                        color: "brand.700"
                      })
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    Patient
                  </Button>
                  
                  <Button
                    size="md"
                    variant={dashboardUser.role === 'nurse' ? 'solid' : 'outline'}
                    bgGradient={dashboardUser.role === 'nurse' ? "linear(45deg, green.500, green.600)" : undefined}
                    color={dashboardUser.role === 'nurse' ? "white" : "green.600"}
                    borderColor="green.500"
                    borderWidth="2px"
                    leftIcon={<FaUserMd />}
                    onClick={() => handleRoleSwitch('nurse')}
                    borderRadius="xl"
                    fontWeight="700"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: dashboardUser.role === 'nurse' 
                        ? "0 6px 20px rgba(34, 197, 94, 0.3)" 
                        : "0 4px 12px rgba(34, 197, 94, 0.15)",
                      ...(dashboardUser.role !== 'nurse' && {
                        bg: "green.50",
                        color: "green.700"
                      })
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    Nurse
                  </Button>
                  
                  <Button
                    size="md"
                    variant={dashboardUser.role === 'admin' ? 'solid' : 'outline'}
                    bgGradient={dashboardUser.role === 'admin' ? "linear(45deg, purple.500, purple.600)" : undefined}
                    color={dashboardUser.role === 'admin' ? "white" : "purple.600"}
                    borderColor="purple.500"
                    borderWidth="2px"
                    leftIcon={<FaUserShield />}
                    onClick={() => handleRoleSwitch('admin')}
                    borderRadius="xl"
                    fontWeight="700"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: dashboardUser.role === 'admin' 
                        ? "0 6px 20px rgba(147, 51, 234, 0.3)" 
                        : "0 4px 12px rgba(147, 51, 234, 0.15)",
                      ...(dashboardUser.role !== 'admin' && {
                        bg: "purple.50",
                        color: "purple.700"
                      })
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    Admin
                  </Button>
                </HStack>
              </VStack>

              {/* Logout Button - Enhanced */}
              <Button
                leftIcon={<FaSignOutAlt />}
                variant="outline"
                borderColor="red.500"
                color="red.600"
                borderWidth="2px"
                size="md"
                onClick={handleLogout}
                borderRadius="xl"
                fontWeight="700"
                _hover={{
                  bg: "red.50",
                  color: "red.700",
                  borderColor: "red.600",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)"
                }}
                transition="all 0.2s ease-in-out"
              >
                Logout
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Dashboard Content */}
      <Box position="relative">
        {/* Background Decorative Elements */}
        <Box
          position="absolute"
          top="5%"
          right="5%"
          w="100px"
          h="100px"
          borderRadius="full"
          bgGradient={currentRoleConfig.bgGradient}
          opacity="0.05"
          filter="blur(40px)"
          zIndex={0}
        />
        <Box
          position="absolute"
          bottom="10%"
          left="10%"
          w="150px"
          h="150px"
          borderRadius="full"
          bgGradient="linear(45deg, purple.200, brand.200)"
          opacity="0.03"
          filter="blur(60px)"
          zIndex={0}
        />
        
        {/* Dashboard Content */}
        <Box position="relative" zIndex={1}>
          {renderDashboard()}
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard