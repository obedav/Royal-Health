import {
  Box,
  Flex,
  HStack,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useBreakpointValue,
  Container,
  Text,
  Badge,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@chakra-ui/react'
import { HiMenuAlt3, HiChevronRight } from 'react-icons/hi'
import { 
  FaUser, 
  FaUserMd, 
  FaUserShield, 
  FaSignOutAlt, 
  FaCube,
  FaHome,
  FaCalendarAlt,
  FaFileAlt,
  FaCog,
  FaArrowLeft,
} from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../../hooks/useAuth'

type UserRole = 'client' | 'nurse' | 'admin';

const Header: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()
  const isMobile = useBreakpointValue({ base: true, md: false })

  // Determine if we're in dashboard context
  const isDashboard = location.pathname.startsWith('/dashboard') || 
                     location.pathname.startsWith('/appointments') || 
                     location.pathname.startsWith('/health-records') || 
                     location.pathname.startsWith('/profile')

  // Public navigation items with conditional Dashboard link
  const getPublicNavItems = () => {
    const baseItems = [
      { label: 'Home', path: '/' },
      { label: 'Services', path: '/services' },
      { label: 'Book Appointment', path: '/booking' },
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' },
    ];

    // Add Dashboard link for authenticated users on public pages
    if (isAuthenticated && !isDashboard) {
      // Insert Dashboard after Home but before Services
      baseItems.splice(1, 0, { 
        label: 'Dashboard', 
        path: '/dashboard', 
        icon: FaCube,
        isDashboardLink: true 
      });
    }

    return baseItems;
  };

  const publicNavItems = getPublicNavItems();

  // Dashboard navigation items based on user role
  const getDashboardNavItems = (role: UserRole = 'client') => {
    const baseItems = [
      { label: 'Home', path: '/', icon: FaHome }, // Clear Home link as first item
      { label: 'Dashboard', path: '/dashboard', icon: FaCube },
      { label: 'Appointments', path: '/appointments', icon: FaCalendarAlt },
      { label: 'Health Records', path: '/health-records', icon: FaFileAlt },
    ];

    if (role === 'admin') {
      return [
        { label: 'Home', path: '/', icon: FaHome }, // Home first for all roles
        { label: 'Dashboard', path: '/dashboard', icon: FaCube },
        { label: 'Appointments', path: '/appointments', icon: FaCalendarAlt },
        { label: 'Health Records', path: '/health-records', icon: FaFileAlt },
        { label: 'Manage Users', path: '/admin/users', icon: FaUser },
        { label: 'System Settings', path: '/admin/settings', icon: FaCog },
      ];
    }

    if (role === 'nurse') {
      return [
        { label: 'Home', path: '/', icon: FaHome }, // Home first for all roles
        { label: 'Dashboard', path: '/dashboard', icon: FaCube },
        { label: 'Appointments', path: '/appointments', icon: FaCalendarAlt },
        { label: 'Health Records', path: '/health-records', icon: FaFileAlt },
        { label: 'Patient Management', path: '/nurse/patients', icon: FaUser },
        { label: 'Schedule', path: '/nurse/schedule', icon: FaCalendarAlt },
      ];
    }

    return baseItems;
  };

  const authItems = [
    { label: 'Login', path: '/login', variant: 'ghost' },
    { label: 'Register', path: '/register', variant: 'solid' },
  ]

  // Get current nav items based on context
  const navItems = isDashboard 
    ? getDashboardNavItems(user?.role as UserRole)
    : publicNavItems

  // Get role configuration for styling
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { color: 'purple', icon: FaUserShield, label: 'Admin' };
      case 'nurse':
        return { color: 'green', icon: FaUserMd, label: 'Nurse' };
      case 'client':
      default:
        return { color: 'brand', icon: FaUser, label: 'Patient' };
    }
  };

  const currentRoleConfig = user?.role ? getRoleConfig(user.role as UserRole) : getRoleConfig('client');

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  // Generate breadcrumbs for dashboard pages
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs = [{ label: 'Home', path: '/' }];

    if (isDashboard) {
      breadcrumbs.push({ label: 'Dashboard', path: '/dashboard' });
      
      // Add additional breadcrumbs based on current path
      if (pathSegments.includes('appointments')) {
        breadcrumbs.push({ label: 'Appointments', path: '/appointments' });
      }
      if (pathSegments.includes('health-records')) {
        breadcrumbs.push({ label: 'Health Records', path: '/health-records' });
      }
      if (pathSegments.includes('profile')) {
        breadcrumbs.push({ label: 'Profile', path: '/profile' });
      }
    }

    return breadcrumbs;
  };

  const NavItems = ({ isMobile = false }) => (
    <>
      {navItems.map((item) => {
        const ItemIcon = 'icon' in item ? item.icon : null;
        const isHomeInDashboard = isDashboard && item.path === '/';
        const isDashboardInPublic = !isDashboard && 'isDashboardLink' in item && item.isDashboardLink;
        const isSpecialItem = isHomeInDashboard || isDashboardInPublic;
        
        return (
          <Button
            key={item.path}
            variant={isSpecialItem ? 'outline' : 'ghost'}
            leftIcon={(isDashboard || isDashboardInPublic) && ItemIcon ? <Icon as={ItemIcon} /> : undefined}
            onClick={() => handleNavigation(item.path)}
            color={
              isActive(item.path) ? 'brand.500' : 
              isHomeInDashboard ? 'green.600' : 
              isDashboardInPublic ? 'purple.600' :
              'gray.600'
            }
            fontWeight={isActive(item.path) ? '700' : (isSpecialItem ? '600' : '500')}
            bg={isActive(item.path) ? 'brand.50' : 'transparent'}
            borderColor={
              isHomeInDashboard ? 'green.500' : 
              isDashboardInPublic ? 'purple.500' : 
              undefined
            }
            borderRadius="lg"
            position="relative"
            _hover={{
              color: isHomeInDashboard ? 'green.700' : 
                     isDashboardInPublic ? 'purple.700' : 
                     'brand.600',
              bg: isHomeInDashboard ? 'green.50' : 
                  isDashboardInPublic ? 'purple.50' : 
                  'brand.50',
              borderColor: isHomeInDashboard ? 'green.600' : 
                          isDashboardInPublic ? 'purple.600' : 
                          undefined,
              transform: 'translateY(-1px)',
              boxShadow: `0 2px 8px rgba(${
                isHomeInDashboard ? '34, 197, 94' : 
                isDashboardInPublic ? '147, 51, 234' :
                '194, 24, 91'
              }, 0.1)`,
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            size={isMobile ? 'lg' : 'md'}
            justifyContent={isMobile ? 'flex-start' : 'center'}
            transition="all 0.2s ease-in-out"
            // Active indicator
            _after={isActive(item.path) ? {
              content: '""',
              position: 'absolute',
              bottom: '-2px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60%',
              height: '2px',
              bgGradient: 'linear(to-r, brand.500, purple.500)',
              borderRadius: 'full',
            } : {}}
          >
            {item.label}
          </Button>
        );
      })}
    </>
  )

  const AuthButtons = ({ isMobile = false }) => (
    <>
      {authItems.map((item) => (
        <Button
          key={item.path}
          variant={item.variant as 'ghost' | 'solid'}
          onClick={() => handleNavigation(item.path)}
          size={isMobile ? 'lg' : 'md'}
          width={isMobile ? 'full' : 'auto'}
          borderRadius="xl"
          fontWeight="600"
          // Enhanced styling based on variant
          {...(item.variant === 'solid' ? {
            bgGradient: 'linear(45deg, brand.500, purple.500)',
            color: 'white',
            _hover: {
              bgGradient: 'linear(45deg, brand.600, purple.600)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(194, 24, 91, 0.25)',
            },
            _active: {
              transform: 'translateY(0)',
            },
            transition: 'all 0.2s ease-in-out',
          } : {
            color: 'brand.500',
            borderColor: 'brand.500',
            borderWidth: '1px',
            _hover: {
              bg: 'brand.50',
              color: 'brand.600',
              borderColor: 'brand.600',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 8px rgba(194, 24, 91, 0.1)',
            },
            _active: {
              transform: 'translateY(0)',
            },
            transition: 'all 0.2s ease-in-out',
          })}
        >
          {item.label}
        </Button>
      ))}
    </>
  )

  // Dashboard User Menu
  const DashboardUserMenu = ({ isMobile = false }) => (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        size={isMobile ? 'lg' : 'md'}
        borderRadius="xl"
        _hover={{
          bg: 'brand.50',
          transform: 'translateY(-1px)',
        }}
        transition="all 0.2s ease-in-out"
      >
        <HStack spacing={3}>
          <Avatar
            size={isMobile ? 'md' : 'sm'}
            name={user?.firstName || 'User'}
            bg={`${currentRoleConfig.color}.500`}
            color="white"
          />
          {!isMobile && (
            <VStack spacing={0} align="start">
              <Text fontSize="sm" fontWeight="600" color="gray.700">
                {user?.firstName || 'User'}
              </Text>
              <Badge
                size="sm"
                colorScheme={currentRoleConfig.color}
                borderRadius="full"
                fontSize="xs"
              >
                <HStack spacing={1}>
                  <Icon as={currentRoleConfig.icon} fontSize="xs" />
                  <Text>{currentRoleConfig.label}</Text>
                </HStack>
              </Badge>
            </VStack>
          )}
        </HStack>
      </MenuButton>
      <MenuList borderRadius="xl" border="2px" borderColor="brand.100" boxShadow="xl">
        <MenuItem 
          icon={<Icon as={FaUser} />}
          onClick={() => handleNavigation('/profile')}
          borderRadius="lg"
          _hover={{ bg: 'brand.50' }}
        >
          Profile Settings
        </MenuItem>
        <MenuItem 
          icon={<Icon as={FaCog} />}
          onClick={() => handleNavigation('/settings')}
          borderRadius="lg"
          _hover={{ bg: 'brand.50' }}
        >
          Account Settings
        </MenuItem>
        <MenuDivider />
        <MenuItem 
          icon={<Icon as={FaHome} />}
          onClick={() => handleNavigation('/')}
          borderRadius="lg"
          _hover={{ bg: 'gray.50' }}
        >
          Back to Website
        </MenuItem>
        <MenuItem 
          icon={<Icon as={FaSignOutAlt} />}
          onClick={handleLogout}
          borderRadius="lg"
          color="red.600"
          _hover={{ bg: 'red.50' }}
        >
          Sign Out
        </MenuItem>
      </MenuList>
    </Menu>
  )

  return (
    <>
      <Box
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        bg="rgba(255, 255, 255, 0.95)"
        backdropFilter="blur(10px)"
        boxShadow="0 2px 20px rgba(194, 24, 91, 0.08)"
        borderBottom="1px"
        borderColor="brand.100"
        transition="all 0.3s ease-in-out"
      >
        <Container maxW="7xl">
          <Flex h={isDashboard ? "60px" : "80px"} alignItems="center" justifyContent="space-between">
            {/* Logo Section with Back Button for Dashboard */}
            <HStack spacing={4}>
              {isDashboard && !isMobile && (
                <Button
                  leftIcon={<Icon as={FaArrowLeft} />}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('/')}
                  color="gray.600"
                  _hover={{ color: 'brand.600', bg: 'brand.50' }}
                  transition="all 0.2s ease-in-out"
                >
                  Back to Website
                </Button>
              )}
              
              <Box
                cursor="pointer"
                transition="all 0.2s ease-in-out"
                _hover={{
                  transform: 'scale(1.02)',
                }}
                _active={{
                  transform: 'scale(0.98)',
                }}
              >
                <Logo 
                  size={isDashboard ? "md" : "md"} 
                  onClick={() => handleNavigation(isDashboard ? '/dashboard' : '/')}
                  variant="horizontal"
                />
              </Box>

              {/* Dashboard Context Indicator */}
              {isDashboard && !isMobile && (
                <Badge
                  bgGradient="linear(45deg, brand.500, purple.500)"
                  color="white"
                  borderRadius="full"
                  px={2}
                  py={0.5}
                  fontSize="xs"
                  fontWeight="700"
                  ml={2}
                >
                  <HStack spacing={1}>
                    <Icon as={FaCube} fontSize="xs" />
                    <Text>Dashboard</Text>
                  </HStack>
                </Badge>
              )}
            </HStack>

            {/* Desktop Navigation */}
            {!isMobile && (
              <HStack spacing={8}>
                <HStack spacing={6}>
                  <NavItems />
                </HStack>
                
                {/* Show different right side content based on auth status */}
                {isAuthenticated ? (
                  isDashboard ? (
                    <DashboardUserMenu />
                  ) : (
                    <HStack spacing={4}>
                      <Button
                        leftIcon={<Icon as={FaCube} />}
                        variant="solid"
                        bgGradient="linear(45deg, purple.500, purple.600)"
                        color="white"
                        size="md"
                        onClick={() => handleNavigation('/dashboard')}
                        borderRadius="xl"
                        fontWeight="600"
                        _hover={{
                          bgGradient: 'linear(45deg, purple.600, purple.700)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(147, 51, 234, 0.25)',
                        }}
                        transition="all 0.2s ease-in-out"
                      >
                        Go to Dashboard
                      </Button>
                      <DashboardUserMenu />
                    </HStack>
                  )
                ) : (
                  <HStack spacing={4}>
                    <AuthButtons />
                  </HStack>
                )}
              </HStack>
            )}

            {/* Mobile Menu Button - Enhanced */}
            {isMobile && (
              <IconButton
                aria-label="Open menu"
                icon={<HiMenuAlt3 />}
                variant="ghost"
                color="brand.500"
                onClick={onOpen}
                fontSize="22px"
                borderRadius="xl"
                _hover={{
                  bg: 'brand.50',
                  color: 'brand.600',
                  transform: 'scale(1.05)',
                }}
                _active={{
                  transform: 'scale(0.95)',
                }}
                transition="all 0.2s ease-in-out"
              />
            )}
          </Flex>
        </Container>

        {/* Breadcrumb Section for Dashboard */}
        {isDashboard && (
          <Box bg="gray.50" borderBottom="1px" borderColor="gray.200" py={1}>
            <Container maxW="7xl">
              <Breadcrumb
                spacing="8px"
                separator={<Icon as={HiChevronRight} color="gray.500" />}
                fontSize="sm"
                fontWeight="500"
              >
                {getBreadcrumbs().map((crumb, index) => (
                  <BreadcrumbItem key={crumb.path} isCurrentPage={index === getBreadcrumbs().length - 1}>
                    <BreadcrumbLink
                      onClick={() => index < getBreadcrumbs().length - 1 && handleNavigation(crumb.path)}
                      color={index === getBreadcrumbs().length - 1 ? 'brand.600' : 'gray.600'}
                      _hover={index < getBreadcrumbs().length - 1 ? { color: 'brand.600' } : {}}
                      cursor={index < getBreadcrumbs().length - 1 ? 'pointer' : 'default'}
                      fontWeight={index === getBreadcrumbs().length - 1 ? '600' : '500'}
                    >
                      {crumb.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ))}
              </Breadcrumb>
            </Container>
          </Box>
        )}
      </Box>

      {/* Mobile Drawer - Enhanced for Dashboard Context */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay bg="rgba(194, 24, 91, 0.1)" />
        <DrawerContent>
          <DrawerCloseButton 
            color="brand.500"
            _hover={{
              bg: 'brand.50',
              color: 'brand.600',
            }}
          />
          <DrawerHeader 
            borderBottomWidth="1px" 
            borderColor="brand.100"
            bg={isDashboard ? 'brand.50' : 'brand.25'}
          >
            <HStack spacing={3}>
              <Logo size="sm" variant="horizontal" />
              {isDashboard && (
                <Badge
                  bgGradient="linear(45deg, brand.500, purple.500)"
                  color="white"
                  borderRadius="full"
                  fontSize="xs"
                  px={2}
                  py={1}
                >
                  Dashboard
                </Badge>
              )}
            </HStack>
          </DrawerHeader>
          <DrawerBody bg="gray.50">
            <VStack spacing={4} align="stretch" pt={6}>
              {/* Dashboard User Info on Mobile */}
              {isDashboard && isAuthenticated && user && (
                <Box
                  bg="white"
                  p={4}
                  borderRadius="xl"
                  border="2px"
                  borderColor="brand.100"
                  boxShadow="sm"
                >
                  <HStack spacing={3}>
                    <Avatar
                      size="md"
                      name={user.firstName || 'User'}
                      bg={`${currentRoleConfig.color}.500`}
                      color="white"
                    />
                    <VStack spacing={1} align="start" flex={1}>
                      <Text fontSize="md" fontWeight="600" color="gray.700">
                        {user.firstName || 'User'}
                      </Text>
                      <Badge
                        colorScheme={currentRoleConfig.color}
                        borderRadius="full"
                        fontSize="xs"
                      >
                        <HStack spacing={1}>
                          <Icon as={currentRoleConfig.icon} fontSize="xs" />
                          <Text>{currentRoleConfig.label}</Text>
                        </HStack>
                      </Badge>
                    </VStack>
                  </HStack>
                </Box>
              )}

              {/* Navigation Items */}
              <VStack spacing={2} align="stretch">
                <NavItems isMobile />
              </VStack>

              {/* Auth Actions */}
              {isDashboard && isAuthenticated ? (
                <VStack spacing={3} align="stretch">
                  <Button
                    leftIcon={<Icon as={FaHome} />}
                    variant="outline"
                    borderColor="gray.300"
                    color="gray.600"
                    size="lg"
                    onClick={() => handleNavigation('/')}
                    borderRadius="xl"
                    _hover={{ borderColor: 'brand.500', color: 'brand.600' }}
                  >
                    Back to Website
                  </Button>
                  <Button
                    leftIcon={<Icon as={FaSignOutAlt} />}
                    colorScheme="red"
                    variant="outline"
                    size="lg"
                    onClick={handleLogout}
                    borderRadius="xl"
                  >
                    Sign Out
                  </Button>
                </VStack>
              ) : (
                <Box 
                  pt={6} 
                  borderTop="2px solid"
                  borderColor="brand.100"
                  borderRadius="md"
                  bgGradient="linear(to-r, brand.25, purple.25)"
                  p={4}
                  mt={4}
                >
                  <VStack spacing={3} align="stretch">
                    <AuthButtons isMobile />
                  </VStack>
                </Box>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Header