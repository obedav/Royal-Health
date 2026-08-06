import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box, Container, Heading, Text, VStack, HStack, Flex, Spacer,
  Card, CardBody, Badge, Icon, SimpleGrid, Button, IconButton,
  Input, InputGroup, InputLeftElement, Select, Center,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay,
  useDisclosure, useToast, Tooltip, Tag, Skeleton,
  Divider, useColorModeValue,
} from '@chakra-ui/react'
import {
  FaCalendarCheck, FaSearch, FaClock, FaCheckCircle,
  FaTimesCircle, FaTrash, FaSync, FaUser, FaPhone,
  FaEnvelope, FaHeartbeat,
} from 'react-icons/fa'
import AdminLayout from '../components/admin/AdminLayout'
import { getAdminToken, signOut } from '../utils/adminAuth'
import { API_CONFIG } from '../config/api.config'

interface Booking {
  id: string
  confirmation_code: string
  booking_type: string
  service_id: string
  patient_name: string
  patient_email?: string
  patient_phone: string
  patient_address?: string
  scheduled_date: string
  scheduled_time: string
  total_amount: number
  payment_status: string
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  created_at: string
}

interface Counts {
  total: number
  confirmed: number
  in_progress: number
  completed: number
  cancelled: number
}

const STATUS_CONFIG = {
  confirmed:    { color: 'blue',   icon: FaClock,       label: 'Confirmed' },
  'in-progress':{ color: 'purple', icon: FaUser,         label: 'In Progress' },
  completed:    { color: 'green',  icon: FaCheckCircle,  label: 'Completed' },
  cancelled:    { color: 'red',    icon: FaTimesCircle,  label: 'Cancelled' },
} as const

const PAY_COLOR: Record<string, string> = { pending: 'orange', paid: 'green', refunded: 'gray' }

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatServiceName(id: string) {
  return id
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

const StatCard: React.FC<{
  label: string; value: number; icon: React.ElementType
  gradient: string; loading: boolean
}> = ({ label, value, icon, gradient, loading }) => (
  <Card borderRadius="xl" overflow="hidden" boxShadow="sm" border="1px solid" borderColor="gray.100">
    <CardBody p={0}>
      <Box bgGradient={gradient} p={4}>
        <HStack justify="space-between" align="start">
          <Box>
            {loading
              ? <Skeleton h="32px" w="48px" mb={1} startColor="whiteAlpha.400" endColor="whiteAlpha.700" />
              : <Text fontSize="3xl" fontWeight="800" color="white" lineHeight="1">{value}</Text>
            }
            <Text fontSize="xs" color="whiteAlpha.800" fontWeight="600" mt={1}>{label}</Text>
          </Box>
          <Box bg="whiteAlpha.200" p={2} borderRadius="lg">
            <Icon as={icon} color="white" fontSize="lg" />
          </Box>
        </HStack>
      </Box>
    </CardBody>
  </Card>
)

const RowSkeleton = () => (
  <Tr>
    {[160, 100, 110, 90, 80, 70, 80, 70].map((w, i) => (
      <Td key={i}><Skeleton h="14px" w={`${w}px`} borderRadius="md" /></Td>
    ))}
    <Td><Skeleton h="26px" w="26px" borderRadius="md" /></Td>
  </Tr>
)

const AdminBookings: React.FC = () => {
  const [bookings, setBookings]         = useState<Booking[]>([])
  const [counts, setCounts]             = useState<Counts>({ total: 0, confirmed: 0, in_progress: 0, completed: 0, cancelled: 0 })
  const [loading, setLoading]           = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch]             = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null)
  const [deleting, setDeleting]         = useState(false)
  const [updatingId, setUpdatingId]     = useState<string | null>(null)

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const toast     = useToast()

  const cardBg  = useColorModeValue('white', 'gray.800')
  const tableBg = useColorModeValue('gray.50', 'gray.700')

  const fetchBookings = useCallback(async (showSpinner = true) => {
    const token = getAdminToken()
    if (!token) { signOut(); return }
    if (showSpinner) setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '100' })
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (search.trim()) params.set('search', search.trim())

      const res  = await fetch(`${API_CONFIG.BASE_URL}/admin/bookings?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to load')
      const payload = json.data ?? json
      setBookings(payload.bookings ?? [])
      if (payload.counts) setCounts(payload.counts)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not load bookings'
      toast({ title: 'Load error', description: msg, status: 'error', duration: 4000, isClosable: true })
    } finally {
      setLoading(false)
    }
  }, [statusFilter, search, toast])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const handleStatusChange = async (booking: Booking, newStatus: string) => {
    const token = getAdminToken()
    if (!token) { signOut(); return }
    setUpdatingId(booking.id)
    try {
      const res  = await fetch(`${API_CONFIG.BASE_URL}/admin/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Update failed')
      setBookings(prev =>
        prev.map(b => b.id === booking.id ? { ...b, status: newStatus as Booking['status'] } : b)
      )
      toast({ title: 'Status updated', status: 'success', duration: 2000 })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed'
      toast({ title: 'Update failed', description: msg, status: 'error', duration: 3000 })
    } finally {
      setUpdatingId(null)
    }
  }

  const confirmDelete = (b: Booking) => { setDeleteTarget(b); onDeleteOpen() }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const token = getAdminToken()
    if (!token) { signOut(); return }
    setDeleting(true)
    try {
      const res  = await fetch(`${API_CONFIG.BASE_URL}/admin/bookings/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Delete failed')
      setBookings(prev => prev.filter(b => b.id !== deleteTarget.id))
      setCounts(prev => ({ ...prev, total: prev.total - 1 }))
      toast({ title: 'Booking deleted', status: 'success', duration: 2000 })
      onDeleteClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed'
      toast({ title: 'Delete failed', description: msg, status: 'error', duration: 3000 })
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const stats = [
    { label: 'Total Bookings', value: counts.total,       icon: FaHeartbeat,    gradient: 'linear(135deg, #1565C0, #1976D2)' },
    { label: 'Confirmed',      value: counts.confirmed,   icon: FaClock,        gradient: 'linear(135deg, #6A1B9A, #8E24AA)' },
    { label: 'Completed',      value: counts.completed,   icon: FaCheckCircle,  gradient: 'linear(135deg, #2E7D32, #43A047)' },
    { label: 'Cancelled',      value: counts.cancelled,   icon: FaTimesCircle,  gradient: 'linear(135deg, #B71C1C, #C62828)' },
  ]

  return (
    <AdminLayout>
      <Container maxW="7xl" py={8}>
        <VStack spacing={6} align="stretch">

          {/* Page title */}
          <Flex align="center">
            <HStack spacing={3}>
              <Box bg="blue.500" p={2} borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
                <Icon as={FaCalendarCheck} color="white" fontSize="md" />
              </Box>
              <Box>
                <Heading size="lg" color="gray.800">Bookings</Heading>
                <Text fontSize="xs" color="gray.500">Manage all patient bookings</Text>
              </Box>
            </HStack>
            <Spacer />
            <Tooltip label="Refresh">
              <IconButton
                aria-label="Refresh"
                icon={<Icon as={FaSync} />}
                size="sm"
                variant="ghost"
                colorScheme="gray"
                isLoading={loading}
                onClick={() => fetchBookings(false)}
              />
            </Tooltip>
          </Flex>

          {/* Stat cards */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            {stats.map(s => <StatCard key={s.label} {...s} loading={loading} />)}
          </SimpleGrid>

          {/* Table */}
          <Card bg={cardBg} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
            <CardBody p={0}>

              {/* Toolbar */}
              <Flex p={4} gap={3} flexWrap="wrap" borderBottom="1px solid" borderColor="gray.100" align="center">
                <InputGroup maxW="280px">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSearch} color="gray.400" fontSize="sm" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search name, phone, ref…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    size="sm"
                    borderRadius="lg"
                    focusBorderColor="blue.500"
                  />
                </InputGroup>
                <Select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  maxW="160px"
                  size="sm"
                  borderRadius="lg"
                  focusBorderColor="blue.500"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
                <Spacer />
                <Text fontSize="xs" color="gray.400" alignSelf="center">
                  {loading ? '…' : `${bookings.length} record${bookings.length !== 1 ? 's' : ''}`}
                </Text>
              </Flex>

              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead bg={tableBg}>
                    <Tr>
                      <Th py={3} fontSize="xs">Patient</Th>
                      <Th py={3} fontSize="xs">Service</Th>
                      <Th py={3} fontSize="xs">Scheduled</Th>
                      <Th py={3} fontSize="xs">Ref Code</Th>
                      <Th py={3} fontSize="xs">Payment</Th>
                      <Th py={3} fontSize="xs">Booked</Th>
                      <Th py={3} fontSize="xs">Status</Th>
                      <Th py={3} fontSize="xs" w="40px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                    ) : bookings.length === 0 ? (
                      <Tr>
                        <Td colSpan={8}>
                          <Center py={16}>
                            <VStack spacing={3}>
                              <Box p={5} bg="blue.50" borderRadius="full">
                                <Icon as={FaCalendarCheck} fontSize="3xl" color="blue.300" />
                              </Box>
                              <Text fontWeight="600" color="gray.500">No bookings found</Text>
                              <Text fontSize="sm" color="gray.400">
                                {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Patient bookings will appear here'}
                              </Text>
                            </VStack>
                          </Center>
                        </Td>
                      </Tr>
                    ) : (
                      bookings.map(b => {
                        const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.confirmed
                        return (
                          <Tr key={b.id} _hover={{ bg: 'gray.50' }} transition="background 0.15s">
                            <Td py={3}>
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="600" fontSize="sm" noOfLines={1}>{b.patient_name}</Text>
                                {b.patient_phone && (
                                  <HStack spacing={1}>
                                    <Icon as={FaPhone} fontSize="9px" color="gray.400" />
                                    <Text fontSize="xs" color="gray.500">{b.patient_phone}</Text>
                                  </HStack>
                                )}
                                {b.patient_email && (
                                  <HStack spacing={1}>
                                    <Icon as={FaEnvelope} fontSize="9px" color="gray.400" />
                                    <Text fontSize="xs" color="gray.500" noOfLines={1}>{b.patient_email}</Text>
                                  </HStack>
                                )}
                              </VStack>
                            </Td>
                            <Td py={3}>
                              <Text fontSize="sm" color="gray.700" noOfLines={2} maxW="140px">
                                {formatServiceName(b.service_id)}
                              </Text>
                            </Td>
                            <Td py={3}>
                              <VStack align="start" spacing={0}>
                                <Text fontSize="sm" fontWeight="500">{formatDate(b.scheduled_date)}</Text>
                                <Text fontSize="xs" color="gray.500">{b.scheduled_time}</Text>
                              </VStack>
                            </Td>
                            <Td py={3}>
                              <Tag size="sm" colorScheme="blue" fontFamily="mono" fontSize="9px">
                                {b.confirmation_code}
                              </Tag>
                            </Td>
                            <Td py={3}>
                              <Badge
                                colorScheme={PAY_COLOR[b.payment_status] ?? 'gray'}
                                fontSize="9px"
                                borderRadius="full"
                                px={2}
                              >
                                {b.payment_status}
                              </Badge>
                            </Td>
                            <Td py={3}>
                              <Text fontSize="xs" color="gray.500">{formatDate(b.created_at)}</Text>
                            </Td>
                            <Td py={3}>
                              <Select
                                size="xs"
                                value={b.status}
                                onChange={e => handleStatusChange(b, e.target.value)}
                                borderRadius="md"
                                focusBorderColor="blue.500"
                                isDisabled={updatingId === b.id}
                                minW="110px"
                              >
                                {Object.entries(STATUS_CONFIG).map(([val, c]) => (
                                  <option key={val} value={val}>{c.label}</option>
                                ))}
                              </Select>
                            </Td>
                            <Td py={3}>
                              <Tooltip label="Delete booking" placement="left">
                                <IconButton
                                  aria-label="Delete"
                                  icon={<Icon as={FaTrash} />}
                                  size="xs"
                                  variant="ghost"
                                  colorScheme="red"
                                  onClick={() => confirmDelete(b)}
                                />
                              </Tooltip>
                            </Td>
                          </Tr>
                        )
                      })
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>

          <HStack justify="center" spacing={2}>
            <Icon as={FaHeartbeat} color="brand.400" fontSize="sm" />
            <Text fontSize="xs" color="gray.400">
              Royal Health Admin · Booking records
            </Text>
          </HStack>

        </VStack>
      </Container>

      {/* Delete dialog */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="2xl" mx={4}>
            <AlertDialogHeader pb={0}>
              <HStack spacing={3}>
                <Box bg="red.100" p={2} borderRadius="lg">
                  <Icon as={FaTrash} color="red.500" />
                </Box>
                <Text fontWeight="700" fontSize="lg">Delete Booking</Text>
              </HStack>
            </AlertDialogHeader>
            <AlertDialogBody py={4}>
              <Text color="gray.600">
                Permanently delete the booking for{' '}
                <Text as="span" fontWeight="700">{deleteTarget?.patient_name}</Text>?
              </Text>
              {deleteTarget?.confirmation_code && (
                <Tag mt={2} size="sm" colorScheme="gray" fontFamily="mono">
                  {deleteTarget.confirmation_code}
                </Tag>
              )}
              <Text fontSize="sm" color="red.500" mt={3} fontWeight="500">
                This action cannot be undone.
              </Text>
            </AlertDialogBody>
            <Divider />
            <AlertDialogFooter gap={2}>
              <Button ref={cancelRef} onClick={onDeleteClose} variant="ghost" size="sm">Cancel</Button>
              <Button
                colorScheme="red"
                size="sm"
                onClick={handleDelete}
                isLoading={deleting}
                loadingText="Deleting…"
                borderRadius="lg"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AdminLayout>
  )
}

export default AdminBookings
