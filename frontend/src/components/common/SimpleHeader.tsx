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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Icon,
} from '@chakra-ui/react'
import { HiMenuAlt3 } from 'react-icons/hi'
import {
  FaChevronDown,
  FaHome,
  FaStethoscope,
  FaUserNurse,
  FaWheelchair,
  FaCalendarAlt,
  FaPhone
} from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'
import ConsultationModal from '../modals/ConsultationModal'

const SimpleHeader: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isConsultationOpen, onOpen: onConsultationOpen, onClose: onConsultationClose } = useDisclosure()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useBreakpointValue({ base: true, md: false })

  // Service categories for dropdown
  const serviceCategories = [
    {
      label: 'Home Care Services',
      path: '/services?category=homecare',
      icon: FaHome,
      description: 'Nursing and personal care at home'
    },
    {
      label: 'Health Assessments',
      path: '/services?category=assessments',
      icon: FaStethoscope,
      description: 'Professional health consultations'
    },
    {
      label: 'Specialized Care',
      path: '/services?category=specialized',
      icon: FaWheelchair,
      description: 'Expert care for specific conditions'
    }
  ]

  // Public navigation items - guest-first approach
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1000}
      bg="white"
      boxShadow="sm"
      borderBottom="1px"
      borderColor="gray.100"
    >
      <Container maxW="7xl">
        <Flex h="80px" alignItems="center" justifyContent="space-between">
          {/* Logo Section */}
          <Box cursor="pointer" onClick={() => handleNavigation('/')}>
            <Logo size="md" variant="horizontal" />
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <HStack spacing={6}>
              {/* Home Button */}
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/')}
                color={isActive('/') ? 'brand.500' : 'gray.600'}
                bg={isActive('/') ? 'brand.50' : 'transparent'}
                fontWeight={isActive('/') ? '600' : '500'}
                _hover={{
                  color: 'brand.600',
                  bg: 'brand.50',
                  transform: 'translateY(-1px)',
                }}
                borderRadius="lg"
                px={4}
                py={2}
              >
                Home
              </Button>

              {/* Book Consultation Button */}
              <Button
                onClick={onConsultationOpen}
                bgGradient="linear(45deg, brand.500, purple.500)"
                color="white"
                fontWeight="600"
                px={6}
                py={2}
                borderRadius="lg"
                _hover={{
                  bgGradient: "linear(45deg, brand.600, purple.600)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 15px rgba(194, 24, 91, 0.25)"
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.2s ease-in-out"
                boxShadow="0 2px 10px rgba(194, 24, 91, 0.15)"
              >
                Book Consultation
              </Button>

              {/* Services Dropdown */}
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  rightIcon={<FaChevronDown />}
                  color={location.pathname.startsWith('/services') ? 'brand.500' : 'gray.600'}
                  bg={location.pathname.startsWith('/services') ? 'brand.50' : 'transparent'}
                  fontWeight={location.pathname.startsWith('/services') ? '600' : '500'}
                  _hover={{
                    color: 'brand.600',
                    bg: 'brand.50',
                    transform: 'translateY(-1px)',
                  }}
                  _active={{
                    bg: 'brand.100',
                  }}
                  borderRadius="lg"
                  px={4}
                  py={2}
                >
                  Services
                </MenuButton>
                <MenuList
                  bg="white"
                  borderColor="gray.200"
                  borderWidth="2px"
                  borderRadius="xl"
                  boxShadow="0 10px 25px rgba(0, 0, 0, 0.15)"
                  py={2}
                  minW="280px"
                >
                  {/* Quick Actions */}
                  <MenuItem
                    onClick={() => handleNavigation('/services')}
                    fontWeight="600"
                    color="brand.600"
                    bg="brand.25"
                    _hover={{ bg: 'brand.50' }}
                    px={4}
                    py={3}
                    mb={2}
                  >
                    <HStack spacing={3}>
                      <Icon as={FaStethoscope} />
                      <Box>
                        <Text>All Services</Text>
                      </Box>
                    </HStack>
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      onConsultationOpen()
                      onClose() // Close the services dropdown
                    }}
                    fontWeight="600"
                    color="green.600"
                    bg="green.25"
                    _hover={{ bg: 'green.50' }}
                    px={4}
                    py={3}
                    mb={2}
                  >
                    <HStack spacing={3}>
                      <Icon as={FaCalendarAlt} />
                      <Box>
                        <Text>Book Consultation</Text>
                      </Box>
                    </HStack>
                  </MenuItem>

                  <MenuDivider borderColor="gray.200" />

                  {/* Service Categories */}
                  {serviceCategories.map((category) => (
                    <MenuItem
                      key={category.path}
                      onClick={() => handleNavigation(category.path)}
                      _hover={{ bg: 'gray.50' }}
                      px={4}
                      py={3}
                    >
                      <HStack spacing={3}>
                        <Icon as={category.icon} color="gray.600" />
                        <Box>
                          <Text fontWeight="500" color="gray.800">
                            {category.label}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {category.description}
                          </Text>
                        </Box>
                      </HStack>
                    </MenuItem>
                  ))}

                  <MenuDivider borderColor="gray.200" />

                  {/* Contact Option */}
                  <MenuItem
                    onClick={() => window.open('tel:+2347063325184', '_self')}
                    _hover={{ bg: 'blue.25' }}
                    px={4}
                    py={3}
                  >
                    <HStack spacing={3}>
                      <Icon as={FaPhone} color="blue.500" />
                      <Box>
                        <Text fontWeight="500" color="blue.600">
                          Call Now
                        </Text>
                        <Text fontSize="xs" color="blue.400">
                          +234 706 332 5184
                        </Text>
                      </Box>
                    </HStack>
                  </MenuItem>
                </MenuList>
              </Menu>

              {/* Other Navigation Items */}
              {navItems.slice(1).map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => handleNavigation(item.path)}
                  color={isActive(item.path) ? 'brand.500' : 'gray.600'}
                  bg={isActive(item.path) ? 'brand.50' : 'transparent'}
                  fontWeight={isActive(item.path) ? '600' : '500'}
                  _hover={{
                    color: 'brand.600',
                    bg: 'brand.50',
                    transform: 'translateY(-1px)',
                  }}
                  borderRadius="lg"
                  px={4}
                  py={2}
                >
                  {item.label}
                </Button>
              ))}
            </HStack>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              aria-label="Open menu"
              icon={<HiMenuAlt3 />}
              variant="ghost"
              onClick={onOpen}
              size="lg"
              color="brand.500"
            />
          )}
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay bg="rgba(194, 24, 91, 0.1)" />
        <DrawerContent>
          <DrawerCloseButton color="brand.500" size="lg" />
          <DrawerHeader
            borderBottomWidth="1px"
            borderColor="brand.100"
            bg="brand.25"
          >
            <Logo size="sm" variant="horizontal" />
          </DrawerHeader>

          <DrawerBody bg="gray.50">
            <VStack spacing={4} align="stretch" pt={6}>
              {/* Main Navigation */}
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? 'solid' : 'ghost'}
                  colorScheme={isActive(item.path) ? 'brand' : undefined}
                  onClick={() => handleNavigation(item.path)}
                  size="lg"
                  justifyContent="flex-start"
                  borderRadius="xl"
                  fontWeight="600"
                >
                  {item.label}
                </Button>
              ))}

              {/* Services Section */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="700"
                  color="gray.500"
                  mb={3}
                  px={4}
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Services
                </Text>

                <VStack spacing={2} align="stretch">
                  {/* All Services */}
                  <Button
                    variant={location.pathname === '/services' ? 'solid' : 'ghost'}
                    colorScheme={location.pathname === '/services' ? 'brand' : undefined}
                    onClick={() => handleNavigation('/services')}
                    size="lg"
                    justifyContent="flex-start"
                    borderRadius="xl"
                    fontWeight="600"
                    leftIcon={<FaStethoscope />}
                  >
                    All Services
                  </Button>

                  {/* Book Consultation */}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onConsultationOpen()
                      onClose() // Close mobile drawer
                    }}
                    size="lg"
                    justifyContent="flex-start"
                    borderRadius="xl"
                    fontWeight="600"
                    leftIcon={<FaCalendarAlt />}
                    color="green.600"
                    _hover={{ bg: 'green.50' }}
                  >
                    Book Consultation
                  </Button>

                  {/* Service Categories */}
                  {serviceCategories.map((category) => (
                    <Button
                      key={category.path}
                      variant="ghost"
                      onClick={() => handleNavigation(category.path)}
                      size="md"
                      justifyContent="flex-start"
                      borderRadius="lg"
                      fontWeight="500"
                      leftIcon={<Icon as={category.icon} />}
                      pl={8}
                    >
                      <Box textAlign="left">
                        <Text>{category.label}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {category.description}
                        </Text>
                      </Box>
                    </Button>
                  ))}
                </VStack>
              </Box>

              {/* Book Consultation Button */}
              <Button
                onClick={() => {
                  onConsultationOpen()
                  onClose() // Close mobile drawer
                }}
                bgGradient="linear(45deg, brand.500, purple.500)"
                color="white"
                size="lg"
                borderRadius="xl"
                fontWeight="700"
                mt={4}
                mb={2}
                boxShadow="0 4px 20px rgba(194, 24, 91, 0.25)"
                _hover={{
                  bgGradient: "linear(45deg, brand.600, purple.600)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 25px rgba(194, 24, 91, 0.35)"
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.2s ease-in-out"
              >
                Book Consultation
              </Button>

              {/* Contact Button */}
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={() => window.open('tel:+2347063325184', '_self')}
                size="lg"
                borderRadius="xl"
                fontWeight="600"
                leftIcon={<FaPhone />}
              >
                Call +234 706 332 5184
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={onConsultationClose}
      />
    </Box>
  )
}

export default SimpleHeader