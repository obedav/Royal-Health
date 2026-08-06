import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box, Container, Heading, Text, VStack, HStack, Flex, Spacer,
  Card, CardBody, Icon, SimpleGrid, Button, IconButton,
  Input, InputGroup, InputLeftElement, Select, Center,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalCloseButton, ModalFooter,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay,
  useDisclosure, useToast, Tooltip, Badge, Skeleton,
  Divider, Textarea, useColorModeValue,
} from '@chakra-ui/react'
import {
  FaEnvelope, FaSearch, FaSync, FaEye, FaHeartbeat,
  FaPhone, FaUser, FaInbox, FaCheckDouble, FaLock,
} from 'react-icons/fa'
import AdminLayout from '../components/admin/AdminLayout'
import { getAdminToken, signOut } from '../utils/adminAuth'
import { API_CONFIG } from '../config/api.config'

interface ContactMessage {
  id: string
  reference_id?: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  status: 'new' | 'read' | 'replied' | 'closed'
  admin_notes?: string
  submitted_at: string
  replied_at?: string
}

interface Counts {
  total: number
  new: number
  read: number
  replied: number
}

const STATUS_CONFIG = {
  new:     { color: 'orange', icon: FaInbox,       label: 'New' },
  read:    { color: 'blue',   icon: FaEye,          label: 'Read' },
  replied: { color: 'green',  icon: FaCheckDouble,  label: 'Replied' },
  closed:  { color: 'gray',   icon: FaLock,         label: 'Closed' },
} as const

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateTime(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
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
    {[140, 160, 120, 80, 90, 70].map((w, i) => (
      <Td key={i}><Skeleton h="14px" w={`${w}px`} borderRadius="md" /></Td>
    ))}
    <Td><Skeleton h="26px" w="60px" borderRadius="md" /></Td>
    <Td><Skeleton h="26px" w="26px" borderRadius="md" /></Td>
  </Tr>
)

const AdminContacts: React.FC = () => {
  const [messages, setMessages]         = useState<ContactMessage[]>([])
  const [counts, setCounts]             = useState<Counts>({ total: 0, new: 0, read: 0, replied: 0 })
  const [loading, setLoading]           = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch]             = useState('')
  const [selected, setSelected]         = useState<ContactMessage | null>(null)
  const [adminNotes, setAdminNotes]     = useState('')
  const [saving, setSaving]             = useState(false)
  const [updatingId, setUpdatingId]     = useState<string | null>(null)

  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const toast     = useToast()

  const tableBg = useColorModeValue('gray.50', 'gray.700')
  const cardBg  = useColorModeValue('white', 'gray.800')

  const fetchMessages = useCallback(async (showSpinner = true) => {
    const token = getAdminToken()
    if (!token) { signOut(); return }
    if (showSpinner) setLoading(true)
    try {
      const filter = statusFilter !== 'all' ? `/${statusFilter}` : ''
      const res    = await fetch(`${API_CONFIG.BASE_URL}/admin/contact-messages${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to load')
      const payload = json.data ?? json
      let msgs: ContactMessage[] = payload.messages ?? []
      if (search.trim()) {
        const q = search.toLowerCase()
        msgs = msgs.filter(m =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.subject ?? '').toLowerCase().includes(q) ||
          (m.phone ?? '').includes(q)
        )
      }
      setMessages(msgs)
      if (payload.counts) setCounts(payload.counts)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not load messages'
      toast({ title: 'Load error', description: msg, status: 'error', duration: 4000, isClosable: true })
    } finally {
      setLoading(false)
    }
  }, [statusFilter, search, toast])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  const openMessage = async (m: ContactMessage) => {
    setSelected(m)
    setAdminNotes(m.admin_notes ?? '')
    onViewOpen()
    // Auto-mark as read if new
    if (m.status === 'new') {
      await updateStatus(m.id, 'read', m.admin_notes)
      setMessages(prev => prev.map(x => x.id === m.id ? { ...x, status: 'read' } : x))
      setCounts(prev => ({ ...prev, new: Math.max(0, prev.new - 1), read: prev.read + 1 }))
    }
  }

  const updateStatus = async (id: string, status: string, notes?: string) => {
    const token = getAdminToken()
    if (!token) { signOut(); return }
    setUpdatingId(id)
    try {
      const body: Record<string, string> = { status }
      if (notes !== undefined) body.admin_notes = notes
      const res  = await fetch(`${API_CONFIG.BASE_URL}/admin/contact-messages/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Update failed')
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: status as ContactMessage['status'] } : m))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed'
      toast({ title: 'Update failed', description: msg, status: 'error', duration: 3000 })
    } finally {
      setUpdatingId(null)
    }
  }

  const handleSaveNotes = async () => {
    if (!selected) return
    setSaving(true)
    await updateStatus(selected.id, selected.status, adminNotes)
    setSaving(false)
    toast({ title: 'Notes saved', status: 'success', duration: 2000 })
    onViewClose()
  }

  const handleMarkReplied = async () => {
    if (!selected) return
    setSaving(true)
    await updateStatus(selected.id, 'replied', adminNotes)
    setSelected(prev => prev ? { ...prev, status: 'replied' } : prev)
    setSaving(false)
    toast({ title: 'Marked as replied', status: 'success', duration: 2000 })
    onViewClose()
  }

  const filteredMessages = messages

  const stats = [
    { label: 'Total Messages', value: counts.total,   icon: FaEnvelope,    gradient: 'linear(135deg, #2E7D32, #43A047)' },
    { label: 'New',            value: counts.new,     icon: FaInbox,       gradient: 'linear(135deg, #E65100, #FF8F00)' },
    { label: 'Read',           value: counts.read,    icon: FaEye,         gradient: 'linear(135deg, #1565C0, #1976D2)' },
    { label: 'Replied',        value: counts.replied, icon: FaCheckDouble, gradient: 'linear(135deg, #6A1B9A, #8E24AA)' },
  ]

  return (
    <AdminLayout messageBadge={counts.new}>
      <Container maxW="7xl" py={8}>
        <VStack spacing={6} align="stretch">

          {/* Page title */}
          <Flex align="center">
            <HStack spacing={3}>
              <Box bg="green.500" p={2} borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
                <Icon as={FaEnvelope} color="white" fontSize="md" />
              </Box>
              <Box>
                <Heading size="lg" color="gray.800">Contact Messages</Heading>
                <Text fontSize="xs" color="gray.500">Messages from the website contact form</Text>
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
                onClick={() => fetchMessages(false)}
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
                    placeholder="Search name, email, subject…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    size="sm"
                    borderRadius="lg"
                    focusBorderColor="green.500"
                  />
                </InputGroup>
                <Select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  maxW="160px"
                  size="sm"
                  borderRadius="lg"
                  focusBorderColor="green.500"
                >
                  <option value="all">All Messages</option>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </Select>
                <Spacer />
                <Text fontSize="xs" color="gray.400" alignSelf="center">
                  {loading ? '…' : `${filteredMessages.length} message${filteredMessages.length !== 1 ? 's' : ''}`}
                </Text>
              </Flex>

              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead bg={tableBg}>
                    <Tr>
                      <Th py={3} fontSize="xs">Sender</Th>
                      <Th py={3} fontSize="xs">Subject</Th>
                      <Th py={3} fontSize="xs">Preview</Th>
                      <Th py={3} fontSize="xs">Phone</Th>
                      <Th py={3} fontSize="xs">Received</Th>
                      <Th py={3} fontSize="xs">Status</Th>
                      <Th py={3} fontSize="xs" w="50px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                    ) : filteredMessages.length === 0 ? (
                      <Tr>
                        <Td colSpan={7}>
                          <Center py={16}>
                            <VStack spacing={3}>
                              <Box p={5} bg="green.50" borderRadius="full">
                                <Icon as={FaEnvelope} fontSize="3xl" color="green.300" />
                              </Box>
                              <Text fontWeight="600" color="gray.500">No messages found</Text>
                              <Text fontSize="sm" color="gray.400">
                                {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Contact form messages will appear here'}
                              </Text>
                            </VStack>
                          </Center>
                        </Td>
                      </Tr>
                    ) : (
                      filteredMessages.map(m => {
                        const cfg   = STATUS_CONFIG[m.status] ?? STATUS_CONFIG.new
                        const isNew = m.status === 'new'
                        return (
                          <Tr
                            key={m.id}
                            _hover={{ bg: 'gray.50' }}
                            transition="background 0.15s"
                            fontWeight={isNew ? '600' : '400'}
                            cursor="pointer"
                            onClick={() => openMessage(m)}
                          >
                            <Td py={3}>
                              <HStack spacing={2}>
                                <Box
                                  w={2}
                                  h={2}
                                  borderRadius="full"
                                  bg={isNew ? 'orange.400' : 'transparent'}
                                  flexShrink={0}
                                />
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="sm" fontWeight={isNew ? '700' : '500'} noOfLines={1}>
                                    {m.name}
                                  </Text>
                                  <HStack spacing={1}>
                                    <Icon as={FaEnvelope} fontSize="9px" color="gray.400" />
                                    <Text fontSize="xs" color="gray.500" noOfLines={1}>{m.email}</Text>
                                  </HStack>
                                </VStack>
                              </HStack>
                            </Td>
                            <Td py={3}>
                              <Text fontSize="sm" noOfLines={1} maxW="160px" color="gray.700">
                                {m.subject || '(no subject)'}
                              </Text>
                            </Td>
                            <Td py={3}>
                              <Text fontSize="xs" color="gray.500" noOfLines={1} maxW="180px">
                                {m.message}
                              </Text>
                            </Td>
                            <Td py={3}>
                              <Text fontSize="xs" color="gray.600">{m.phone || '—'}</Text>
                            </Td>
                            <Td py={3}>
                              <Text fontSize="xs" color="gray.500">{formatDate(m.submitted_at)}</Text>
                            </Td>
                            <Td py={3}>
                              <Badge
                                colorScheme={cfg.color}
                                fontSize="9px"
                                borderRadius="full"
                                px={2}
                              >
                                {cfg.label}
                              </Badge>
                            </Td>
                            <Td py={3} onClick={e => e.stopPropagation()}>
                              <Select
                                size="xs"
                                value={m.status}
                                onChange={e => updateStatus(m.id, e.target.value)}
                                borderRadius="md"
                                focusBorderColor="green.500"
                                isDisabled={updatingId === m.id}
                                minW="90px"
                              >
                                {Object.entries(STATUS_CONFIG).map(([val, c]) => (
                                  <option key={val} value={val}>{c.label}</option>
                                ))}
                              </Select>
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
              Royal Health Admin · Contact messages
            </Text>
          </HStack>

        </VStack>
      </Container>

      {/* Message view modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg" isCentered scrollBehavior="inside">
        <ModalOverlay bg="blackAlpha.400" />
        <ModalContent borderRadius="2xl" mx={4}>
          <ModalHeader pb={2}>
            <HStack spacing={3}>
              <Box bg="green.100" p={2} borderRadius="lg">
                <Icon as={FaEnvelope} color="green.600" />
              </Box>
              <Box>
                <Text fontWeight="700" fontSize="md" noOfLines={1}>
                  {selected?.subject || '(no subject)'}
                </Text>
                <HStack spacing={2} mt={0.5}>
                  {selected && (
                    <Badge
                      colorScheme={STATUS_CONFIG[selected.status]?.color ?? 'gray'}
                      fontSize="9px"
                      borderRadius="full"
                      px={2}
                    >
                      {STATUS_CONFIG[selected.status]?.label ?? selected.status}
                    </Badge>
                  )}
                </HStack>
              </Box>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody py={5}>
            {selected && (
              <VStack spacing={4} align="stretch">
                {/* Sender info */}
                <Box bg="gray.50" borderRadius="xl" p={4}>
                  <SimpleGrid columns={2} spacing={3}>
                    <HStack spacing={2}>
                      <Icon as={FaUser} fontSize="xs" color="gray.400" />
                      <Box>
                        <Text fontSize="10px" color="gray.400" textTransform="uppercase" letterSpacing="wide">Name</Text>
                        <Text fontSize="sm" fontWeight="600">{selected.name}</Text>
                      </Box>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon as={FaEnvelope} fontSize="xs" color="gray.400" />
                      <Box>
                        <Text fontSize="10px" color="gray.400" textTransform="uppercase" letterSpacing="wide">Email</Text>
                        <Text fontSize="sm" color="blue.600">
                          <a href={`mailto:${selected.email}`}>{selected.email}</a>
                        </Text>
                      </Box>
                    </HStack>
                    {selected.phone && (
                      <HStack spacing={2}>
                        <Icon as={FaPhone} fontSize="xs" color="gray.400" />
                        <Box>
                          <Text fontSize="10px" color="gray.400" textTransform="uppercase" letterSpacing="wide">Phone</Text>
                          <Text fontSize="sm">{selected.phone}</Text>
                        </Box>
                      </HStack>
                    )}
                    <Box>
                      <Text fontSize="10px" color="gray.400" textTransform="uppercase" letterSpacing="wide">Received</Text>
                      <Text fontSize="sm">{formatDateTime(selected.submitted_at)}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                {/* Message body */}
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="600" mb={2} textTransform="uppercase" letterSpacing="wide">
                    Message
                  </Text>
                  <Box
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="xl"
                    p={4}
                    fontSize="sm"
                    color="gray.700"
                    lineHeight="1.7"
                    whiteSpace="pre-wrap"
                  >
                    {selected.message}
                  </Box>
                </Box>

                {/* Admin notes */}
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="600" mb={2} textTransform="uppercase" letterSpacing="wide">
                    Admin Notes
                  </Text>
                  <Textarea
                    value={adminNotes}
                    onChange={e => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this message…"
                    size="sm"
                    borderRadius="xl"
                    focusBorderColor="green.500"
                    rows={3}
                    resize="vertical"
                  />
                </Box>
              </VStack>
            )}
          </ModalBody>
          <Divider />
          <ModalFooter gap={2}>
            <Button variant="ghost" size="sm" onClick={onViewClose}>Close</Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="green"
              onClick={handleSaveNotes}
              isLoading={saving}
              loadingText="Saving…"
            >
              Save Notes
            </Button>
            {selected?.status !== 'replied' && selected?.status !== 'closed' && (
              <Button
                size="sm"
                colorScheme="green"
                leftIcon={<Icon as={FaCheckDouble} />}
                onClick={handleMarkReplied}
                isLoading={saving}
              >
                Mark Replied
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminLayout>
  )
}

export default AdminContacts
