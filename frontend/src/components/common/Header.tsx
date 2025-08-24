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
} from '@chakra-ui/react'
import { HiMenuAlt3 } from 'react-icons/hi'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'

const Header: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Book Appointment', path: '/booking' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ]

  const authItems = [
    { label: 'Login', path: '/login', variant: 'ghost' },
    { label: 'Register', path: '/register', variant: 'solid' },
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  const isActive = (path: string) => location.pathname === path

  const NavItems = ({ isMobile = false }) => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          onClick={() => handleNavigation(item.path)}
          color={isActive(item.path) ? 'brand.500' : 'gray.600'}
          fontWeight={isActive(item.path) ? '700' : '500'}
          bg={isActive(item.path) ? 'brand.50' : 'transparent'}
          borderRadius="lg"
          position="relative"
          _hover={{
            color: 'brand.600',
            bg: 'brand.50',
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(194, 24, 91, 0.1)',
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
      ))}
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

  return (
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
        <Flex h="80px" alignItems="center" justifyContent="space-between">
          {/* Logo with enhanced hover effect */}
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
              size="md" 
              onClick={() => handleNavigation('/')}
              variant="horizontal"
            />
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <HStack spacing={8}>
              <HStack spacing={6}>
                <NavItems />
              </HStack>
              <HStack spacing={4}>
                <AuthButtons />
              </HStack>
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

      {/* Mobile Drawer - Enhanced */}
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
            bg="brand.25"
          >
            <Logo size="sm" variant="horizontal" />
          </DrawerHeader>
          <DrawerBody bg="gray.50">
            <VStack spacing={4} align="stretch" pt={6}>
              <VStack spacing={2} align="stretch">
                <NavItems isMobile />
              </VStack>
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
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Header