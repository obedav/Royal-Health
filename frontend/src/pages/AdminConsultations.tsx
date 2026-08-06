import {
  Box, Container, Heading, Text, VStack, HStack, Flex, Spacer,
  Card, CardBody, Badge, Icon, SimpleGrid, Button, IconButton,
  Input, InputGroup, InputLeftElement, Select, Spinner, Center,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, useDisclosure,
  useToast, Tooltip, Avatar, Tag, Skeleton, SkeletonText,
  Divider, useColorModeValue,
} from '@chakra-ui/react'
import {
  FaStethoscope, FaSearch, FaClock, FaPhone, FaCalendarAlt,
  FaCheckCircle, FaTimesCircle, FaTrash, FaSync, FaSignOutAlt,
  FaUser, FaMapMarkerAlt, FaEnvelope, FaHeartbeat,
} from 'react-icons/fa'
import { useState, useEffect, useRef, useCallback } from 'react'
import { API_CONFIG } from '../config/api.config'
import AdminLayout from '../components/admin/AdminLayout'
import { getAdminToken, signOut } from '../utils/adminAuth'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Consultation {
  id: string
  reference_id: string
  name: string
  phone: string
  email?: string
  age: number
  gender: string
  service_type: string
  selected_service?: string
  state: string
  city: string
  address: string
  health_concerns?: string
  preferred_date: string
  preferred_time: string
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled'
  submitted_at: string
}

interface Summary {
  total: number
  pending: number
  contacted: number
  scheduled: number
  completed: number
  cancelled: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending:   { color: 'orange', icon: FaClock,       label: 'Pending' },
  contacted: { color: 'blue',   icon: FaPhone,        label: 'Contacted' },
  scheduled: { color: 'purple', icon: FaCalendarAlt,  label: 'Scheduled' },
  completed: { color: 'green',  icon: FaCheckCircle,  label: 'Completed' },
  cancelled: { color: 'red',    icon: FaTimesCircle,  label: 'Cancelled' },
} as const

const TIME_LABELS: Record<string, string> = {
  morning: '8AM – 12PM', afternoon: '12PM – 5PM', evening: '5PM – 8PM',
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string; value: number; icon: React.ElementType
  gradient: string; loading: boolean
}> = ({ label, value, icon, gradient, loading }) => (
  <Card borderRadius="xl" overflow="hidden" boxShadow="sm" border="1px solid" borderColor="gray.100">
    <CardBody p={0}>
      <Box bgGradient={gradient} p={4} pb={3}>
        <HStack justify="space-between" align="start">
          <Box>
            {loading ? (
              <Skeleton h="32px" w="48px" mb={1} startColor="whiteAlpha.400" endColor="whiteAlpha.700" />
            ) : (
              <Text fontSize="3xl" fontWeight="800" color="white" lineHeight="1">{value}</Text>
            )}
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

// ─── Row Skeleton ─────────────────────────────────────────────────────────────

const RowSkeleton = () => (
  <Tr>
    {[180, 130, 120, 100, 90, 80].map((w, i) => (
      <Td key={i}><Skeleton h="16px" w={`${w}px`} borderRadius="md" /></Td>
    ))}
    <Td><Skeleton h="28px" w="60px" borderRadius="md" /></Td>
    <Td><Skeleton h="28px" w="28px" borderRadius="md" /></Td>
  </Tr>
)

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminConsultations: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [summary, setSummary] = useState<Summary>({ total: 0, pending: 0, contacted: 0, scheduled: 0, completed: 0, cancelled: 0 })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Consultation | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const toast = useToast()

  const cardBg  = useColorModeValue('white', 'gray.800')
  const tableBg = useColorModeValue('gray.50', 'gray.700')

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchConsultations = useCallback(async (showSpinner = true) => {
    const token = getAdminToken()
    if (!token) { signOut(); return }
    if (showSpinner) setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '100' })
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (search.trim()) params.set('search', search.trim())

      const res = await fetch(`${API_CONFIG.BASE_URL}/consultations/list?${params}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to load')
      setConsultations(json.data?.consultations ?? [])
      if (json.data?.summary) setSummary(json.data.summary)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not load consultations'
      toast({ title: 'Load error', description: msg, status: 'error', duration: 4000, isClosable: true })
    } finally {
      setLoading(false)
    }
  }, [statusFilter, search, toast])

  useEffect(() => { fetchConsultations() }, [fetchConsultations])

  // ── Status update ──────────────────────────────────────────────────────────

  const handleStatusChange = async (consultation: Consultation, newStatus: string) => {
    const token = getAdminToken()
    if (!token) { signOut(); return }
    setUpdatingId(consultation.id)
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/consultations/${consultation.id}/status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Update failed')
      setConsultations(prev =>
        prev.map(c => c.id === consultation.id ? { ...c, status: newStatus as Consultation['status'] } : c)
      )
      setSummary(prev => {
        const next = { ...prev }
        if (consultation.status in next) (next as any)[consultation.status]--
        if (newStatus in next) (next as any)[newStatus]++
        return next
      })
      toast({ title: 'Status updated', status: 'success', duration: 2000 })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed'
      toast({ title: 'Update failed', description: msg, status: 'error', duration: 3000 })
    } finally {
      setUpdatingId(null)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  const confirmDelete = (c: Consultation) => { setDeleteTarget(c); onDeleteOpen() }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const token = getAdminToken()
    if (!token) { signOut(); return }
    setDeleting(true)
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/consultations/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Delete failed')
      setConsultations(prev => prev.filter(c => c.id !== deleteTarget.id))
      setSummary(prev => {
        const next = { ...prev, total: prev.total - 1 }
        if (deleteTarget.status in next) (next as any)[deleteTarget.status]--
        return next
      })
      toast({ title: 'Lead deleted', status: 'success', duration: 2000 })
      onDeleteClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed'
      toast({ title: 'Delete failed', description: msg, status: 'error', duration: 3000 })
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const stats = [
    { label: 'Total Leads',  value: summary.total,     icon: FaHeartbeat,   gradient: 'linear(135deg, #C2185B, #7B1FA2)' },
    { label: 'Pending',      value: summary.pending,    icon: FaClock,        gradient: 'linear(135deg, #E65100, #FF8F00)' },
    { label: 'Contacted',    value: summary.contacted,  icon: FaPhone,        gradient: 'linear(135deg, #1565C0, #1976D2)' },
    { label: 'Scheduled',    value: summary.scheduled,  icon: FaCalendarAlt,  gradient: 'linear(135deg, #6A1B9A, #8E24AA)' },
    { label: 'Completed',    value: summary.completed,  icon: FaCheckCircle,  gradient: 'linear(135deg, #2E7D32, #43A047)' },
  ]

  return (
    <AdminLayout>
      <Container maxW="7xl" py={8}>
        <VStack spacing={6} align="stretch">

          {/* Page title */}
          <Flex align="center">
            <HStack spacing={3}>
              <Box bg="brand.500" p={2} borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
                <Icon as={FaStethoscope} color="white" fontSize="md" />
              </Box>
              <Box>
                <Heading size="lg" color="gray.800">Consultations</Heading>
                <Text fontSize="xs" color="gray.500">Manage all patient consultation requests</Text>
              </Box>
            </HStack>
            <Spacer />
            <Tooltip label="Refresh data">
              <IconButton
                aria-label="Refresh"
                icon={<Icon as={FaSync} />}
                size="sm"
                variant="ghost"
                colorScheme="gray"
                isLoading={loading}
                onClick={() => fetchConsultations(false)}
              />
            </Tooltip>
          </Flex>

          {/* Stats */}
          <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
            {stats.map(s => (
              <StatCard key={s.label} {...s} loading={loading} />
            ))}
          </SimpleGrid>

          {/* Table Card */}
          <Card bg={cardBg} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
            <CardBody p={0}>

              {/* Toolbar */}
              <Flex p={4} gap={3} flexWrap="wrap" borderBottom="1px solid" borderColor="gray.100" align="center">
                <InputGroup maxW="300px">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSearch} color="gray.400" fontSize="sm" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search name, phone, city…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    size="sm"
                    borderRadius="lg"
                    focusBorderColor="brand.500"
                  />
                </InputGroup>
                <Select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  maxW="160px"
                  size="sm"
                  borderRadius="lg"
                  focusBorderColor="brand.500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
                <Spacer />
                <Text fontSize="xs" color="gray.400" alignSelf="center">
                  {loading ? '…' : `${consultations.length} record${consultations.length !== 1 ? 's' : ''}`}
                </Text>
              </Flex>

              {/* Table */}
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead bg={tableBg}>
                    <Tr>
                      <Th py={3} fontSize="xs">Patient</Th>
                      <Th py={3} fontSize="xs">Service</Th>
                      <Th py={3} fontSize="xs">Location</Th>
                      <Th py={3} fontSize="xs">Schedule</Th>
                      <Th py={3} fontSize="xs">Ref ID</Th>
                      <Th py={3} fontSize="xs">Submitted</Th>
                      <Th py={3} fontSize="xs">Status</Th>
                      <Th py={3} fontSize="xs" w="40px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                    ) : consultations.length === 0 ? (
                      <Tr>
                        <Td colSpan={8}>
                          <Center py={16}>
                            <VStack spacing={3}>
                              <Box p={5} bg="gray.100" borderRadius="full">
                                <Icon as={FaStethoscope} fontSize="3xl" color="gray.400" />
                              </Box>
                              <Text fontWeight="600" color="gray.500">No consultations found</Text>
                              <Text fontSize="sm" color="gray.400">
                                {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'New leads will appear here'}
                              </Text>
                            </VStack>
                          </Center>
                        </Td>
                      </Tr>
                    ) : (
                      consultations.map(c => {
                        const cfg = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.pending
                        return (
                          <Tr key={c.id} _hover={{ bg: 'gray.50' }} transition="background 0.15s">
                            {/* Patient */}
                            <Td py={3}>
                              <HStack spacing={2}>
                                <Avatar size="xs" name={c.name} bg="brand.100" color="brand.700" />
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="600" fontSize="sm" noOfLines={1}>{c.name}</Text>
                                  <HStack spacing={1}>
                                    <Icon as={FaPhone} fontSize="9px" color="gray.400" />
                                    <Text fontSize="xs" color="gray.500">{c.phone}</Text>
                                  </HStack>
                                  {c.email && (
                                    <HStack spacing={1}>
                                      <Icon as={FaEnvelope} fontSize="9px" color="gray.400" />
                                      <Text fontSize="xs" color="gray.500" noOfLines={1}>{c.email}</Text>
                                    </HStack>
                                  )}
                                  <Text fontSize="xs" color="gray.400">{c.age}y · {c.gender}</Text>
                                </VStack>
                              </HStack>
                            </Td>

                            {/* Service */}
                            <Td py={3}>
                              <Text fontSize="sm" fontWeight="500" noOfLines={2} maxW="160px">
                                {c.selected_service || c.service_type}
                              </Text>
                            </Td>

                            {/* Location */}
                            <Td py={3}>
                              <HStack spacing={1} align="start">
                                <Icon as={FaMapMarkerAlt} fontSize="10px" color="gray.400" mt="3px" />
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="sm" fontWeight="500">{c.city}, {c.state}</Text>
                                  <Text fontSize="xs" color="gray.500" noOfLines={1} maxW="140px">{c.address}</Text>
                                </VStack>
                              </HStack>
                            </Td>

                            {/* Schedule */}
                            <Td py={3}>
                              <VStack align="start" spacing={0}>
                                <Text fontSize="sm" fontWeight="500">{formatDate(c.preferred_date)}</Text>
                                <Text fontSize="xs" color="gray.500">{TIME_LABELS[c.preferred_time] ?? c.preferred_time}</Text>
                              </VStack>
                            </Td>

                            {/* Ref ID */}
                            <Td py={3}>
                              <Tag size="sm" colorScheme="gray" fontFamily="mono" fontSize="10px">
                                {c.reference_id ?? '—'}
                              </Tag>
                            </Td>

                            {/* Submitted */}
                            <Td py={3}>
                              <Text fontSize="xs" color="gray.500">{formatDate(c.submitted_at)}</Text>
                            </Td>

                            {/* Status */}
                            <Td py={3}>
                              <Select
                                size="xs"
                                value={c.status}
                                onChange={e => handleStatusChange(c, e.target.value)}
                                borderRadius="md"
                                focusBorderColor="brand.500"
                                isDisabled={updatingId === c.id}
                                minW="110px"
                              >
                                {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                                  <option key={val} value={val}>{cfg.label}</option>
                                ))}
                              </Select>
                            </Td>

                            {/* Delete */}
                            <Td py={3}>
                              <Tooltip label="Delete lead" placement="left">
                                <IconButton
                                  aria-label="Delete"
                                  icon={<Icon as={FaTrash} />}
                                  size="xs"
                                  variant="ghost"
                                  colorScheme="red"
                                  onClick={() => confirmDelete(c)}
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

          {/* Footer info */}
          <HStack justify="center" spacing={2}>
            <Icon as={FaHeartbeat} color="brand.400" fontSize="sm" />
            <Text fontSize="xs" color="gray.400">
              Royal Health Admin · Data refreshes on page load and after each action
            </Text>
          </HStack>

        </VStack>
      </Container>

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="2xl" mx={4}>
            <AlertDialogHeader pb={0}>
              <HStack spacing={3}>
                <Box bg="red.100" p={2} borderRadius="lg">
                  <Icon as={FaTrash} color="red.500" />
                </Box>
                <Text fontWeight="700" fontSize="lg">Delete Lead</Text>
              </HStack>
            </AlertDialogHeader>
            <AlertDialogBody py={4}>
              <Text color="gray.600">
                Permanently delete the consultation from{' '}
                <Text as="span" fontWeight="700">{deleteTarget?.name}</Text>?
              </Text>
              {deleteTarget?.reference_id && (
                <Tag mt={2} size="sm" colorScheme="gray" fontFamily="mono">
                  {deleteTarget.reference_id}
                </Tag>
              )}
              <Text fontSize="sm" color="red.500" mt={3} fontWeight="500">
                This action cannot be undone.
              </Text>
            </AlertDialogBody>
            <Divider />
            <AlertDialogFooter gap={2}>
              <Button ref={cancelRef} onClick={onDeleteClose} variant="ghost" size="sm">
                Cancel
              </Button>
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

export default AdminConsultations
