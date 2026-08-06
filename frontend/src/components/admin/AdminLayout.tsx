import React from 'react'
import {
  Box, Flex, VStack, HStack, Text, Icon, IconButton,
  Drawer, DrawerOverlay, DrawerContent, DrawerBody,
  useDisclosure, Divider, Badge,
} from '@chakra-ui/react'
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom'
import {
  FaHeartbeat, FaStethoscope, FaCalendarCheck, FaEnvelope,
  FaSignOutAlt, FaTachometerAlt, FaBars, FaTimes,
} from 'react-icons/fa'
import { signOut } from '../../utils/adminAuth'

const SIDEBAR_W = '220px'
const SIDEBAR_BG = '#0D1629'

interface NavItemDef {
  label: string
  to: string
  icon: React.ElementType
  badge?: number
}

const NAV_ITEMS: NavItemDef[] = [
  { label: 'Dashboard',     to: '/admin/dashboard',     icon: FaTachometerAlt },
  { label: 'Consultations', to: '/admin/consultations', icon: FaStethoscope },
  { label: 'Bookings',      to: '/admin/bookings',       icon: FaCalendarCheck },
  { label: 'Messages',      to: '/admin/contacts',       icon: FaEnvelope },
]

const NavItem: React.FC<NavItemDef & { onClick?: () => void }> = ({
  to, icon, label, badge, onClick,
}) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <RouterNavLink to={to} onClick={onClick} style={{ width: '100%', textDecoration: 'none' }}>
      <HStack
        spacing={3}
        px={4}
        py={3}
        borderRadius="lg"
        bg={isActive ? 'rgba(255,255,255,0.09)' : 'transparent'}
        borderLeft="3px solid"
        borderLeftColor={isActive ? 'brand.400' : 'transparent'}
        _hover={{ bg: 'rgba(255,255,255,0.07)', borderLeftColor: 'brand.400' }}
        transition="all 0.15s ease"
        cursor="pointer"
        position="relative"
      >
        <Icon as={icon} color={isActive ? 'brand.400' : 'whiteAlpha.500'} fontSize="sm" flexShrink={0} />
        <Text
          fontSize="sm"
          fontWeight={isActive ? '600' : '400'}
          color={isActive ? 'white' : 'whiteAlpha.600'}
          flex={1}
        >
          {label}
        </Text>
        {badge != null && badge > 0 && (
          <Badge
            bg="red.500"
            color="white"
            fontSize="9px"
            borderRadius="full"
            minW="16px"
            h="16px"
            lineHeight="16px"
            textAlign="center"
            px={1}
          >
            {badge > 99 ? '99+' : badge}
          </Badge>
        )}
      </HStack>
    </RouterNavLink>
  )
}

const SidebarContent: React.FC<{ onClose?: () => void; messageBadge?: number }> = ({
  onClose,
  messageBadge,
}) => {
  const items = NAV_ITEMS.map(item =>
    item.to === '/admin/contacts' ? { ...item, badge: messageBadge } : item
  )

  return (
    <Flex flexDir="column" h="100%" py={6} px={3}>
      {/* Brand */}
      <HStack spacing={3} px={3} mb={8}>
        <Box
          w="36px"
          h="36px"
          bgGradient="linear(135deg, brand.500, purple.500)"
          borderRadius="xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          boxShadow="0 4px 12px rgba(196,30,58,0.4)"
        >
          <Icon as={FaHeartbeat} color="white" fontSize="sm" />
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="700" color="white" lineHeight="1.1">
            Royal Health
          </Text>
          <Text fontSize="9px" color="whiteAlpha.400" letterSpacing="0.12em" textTransform="uppercase">
            Admin Panel
          </Text>
        </Box>
      </HStack>

      {/* Divider */}
      <Box px={3} mb={4}>
        <Divider borderColor="whiteAlpha.100" />
      </Box>

      {/* Nav */}
      <VStack spacing={1} align="stretch" flex={1}>
        {items.map(item => (
          <NavItem key={item.to} {...item} onClick={onClose} />
        ))}
      </VStack>

      {/* Sign out */}
      <Box pt={4}>
        <Divider borderColor="whiteAlpha.100" mb={4} />
        <HStack
          spacing={3}
          px={4}
          py={3}
          borderRadius="lg"
          _hover={{ bg: 'rgba(229,62,62,0.12)' }}
          transition="all 0.15s ease"
          cursor="pointer"
          onClick={signOut}
          role="button"
          aria-label="Sign out"
        >
          <Icon as={FaSignOutAlt} color="red.400" fontSize="sm" />
          <Text fontSize="sm" color="red.400" fontWeight="500">Sign Out</Text>
        </HStack>
      </Box>
    </Flex>
  )
}

interface Props {
  children: React.ReactNode
  messageBadge?: number
}

const AdminLayout: React.FC<Props> = ({ children, messageBadge }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex minH="100vh">
      {/* Desktop Sidebar */}
      <Box
        display={{ base: 'none', lg: 'flex' }}
        w={SIDEBAR_W}
        minW={SIDEBAR_W}
        position="fixed"
        top={0}
        left={0}
        h="100vh"
        flexDir="column"
        zIndex={20}
        bg={SIDEBAR_BG}
        borderRight="1px solid rgba(255,255,255,0.06)"
        boxShadow="4px 0 32px rgba(0,0,0,0.4)"
      >
        <SidebarContent messageBadge={messageBadge} />
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay bg="blackAlpha.700" />
        <DrawerContent bg={SIDEBAR_BG} maxW={SIDEBAR_W} borderRight="1px solid rgba(255,255,255,0.06)">
          <Box position="absolute" top={3} right={3} zIndex={1}>
            <IconButton
              aria-label="Close menu"
              icon={<Icon as={FaTimes} />}
              size="sm"
              variant="ghost"
              color="whiteAlpha.600"
              _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
              onClick={onClose}
            />
          </Box>
          <DrawerBody p={0}>
            <SidebarContent onClose={onClose} messageBadge={messageBadge} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Content area */}
      <Box
        ml={{ base: 0, lg: SIDEBAR_W }}
        flex={1}
        minH="100vh"
        bg="gray.50"
        minW={0}
      >
        {/* Mobile top bar */}
        <Flex
          display={{ base: 'flex', lg: 'none' }}
          bg="white"
          borderBottom="1px solid"
          borderColor="gray.200"
          px={4}
          py={3}
          align="center"
          position="sticky"
          top={0}
          zIndex={10}
          boxShadow="sm"
        >
          <IconButton
            aria-label="Open menu"
            icon={<Icon as={FaBars} />}
            size="sm"
            variant="ghost"
            colorScheme="gray"
            onClick={onOpen}
          />
          <HStack spacing={2} ml={3}>
            <Box
              w={6}
              h={6}
              bgGradient="linear(135deg, brand.500, purple.500)"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FaHeartbeat} color="white" fontSize="10px" />
            </Box>
            <Text fontWeight="700" fontSize="sm" color="gray.800">Royal Health Admin</Text>
          </HStack>
        </Flex>

        {children}
      </Box>
    </Flex>
  )
}

export default AdminLayout
