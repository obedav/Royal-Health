import React, { useEffect, useState, useCallback } from 'react'
import {
  Box, Container, Heading, Text, VStack, HStack, SimpleGrid,
  Card, CardBody, Icon, Flex, Skeleton, Badge, Table, Thead,
  Tbody, Tr, Th, Td, TableContainer, Tag, useColorModeValue,
} from '@chakra-ui/react'
import {
  FaStethoscope, FaCalendarCheck, FaEnvelope, FaClock,
  FaCheckCircle, FaHeartbeat, FaChartBar,
} from 'react-icons/fa'
import AdminLayout from '../components/admin/AdminLayout'
import { getAdminToken, signOut } from '../utils/adminAuth'
import { API_CONFIG } from '../config/api.config'

interface DashboardData {
  consultations: { total: number; pending: number; scheduled: number; completed: number }
  bookings: { total: number; confirmed: number; completed: number; cancelled: number }
  messages: { total: number; new: number; replied: number }
  recentConsultations: Array<{ id: string; name: string; phone: string; service_type: string; status: string; submitted_at: string }>
  recentBookings: Array<{ id: string; confirmation_code: string; patient_name: string; service_id: string; status: string; created_at: string }>
}

const CONSULTATION_STATUS_COLOR: Record<string, string> = {
  pending: 'orange', contacted: 'blue', scheduled: 'purple', completed: 'green', cancelled: 'red',
}

const BOOKING_STATUS_COLOR: Record<string, string> = {
  confirmed: 'blue', 'in-progress': 'purple', completed: 'green', cancelled: 'red',
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const StatCard: React.FC<{
  label: string; value: number; sub?: string; icon: React.ElementType
  gradient: string; loading: boolean
}> = ({ label, value, sub, icon, gradient, loading }) => (
  <Card borderRadius="xl" overflow="hidden" boxShadow="sm" border="1px solid" borderColor="gray.100">
    <CardBody p={0}>
      <Box bgGradient={gradient} p={5}>
        <Flex justify="space-between" align="start">
          <Box>
            {loading ? (
              <Skeleton h="36px" w="56px" mb={1} startColor="whiteAlpha.400" endColor="whiteAlpha.700" />
            ) : (
              <Text fontSize="4xl" fontWeight="800" color="white" lineHeight="1">{value}</Text>
            )}
            <Text fontSize="xs" color="whiteAlpha.800" fontWeight="600" mt={1}>{label}</Text>
            {sub && <Text fontSize="10px" color="whiteAlpha.600" mt={0.5}>{sub}</Text>}
          </Box>
          <Box bg="whiteAlpha.200" p={3} borderRadius="xl">
            <Icon as={icon} color="white" fontSize="xl" />
          </Box>
        </Flex>
      </Box>
    </CardBody>
  </Card>
)

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const tableBg = useColorModeValue('gray.50', 'gray.700')

  const fetchDashboard = useCallback(async () => {
    const token = getAdminToken()
    if (!token) { signOut(); return }
    setLoading(true)
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed')
      setData(json.data ?? json)
    } catch {
      // fail silently — cards will show 0
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])

  const statRows = [
    {
      label: 'Consultations', value: data?.consultations.total ?? 0,
      sub: `${data?.consultations.pending ?? 0} pending`,
      icon: FaStethoscope, gradient: 'linear(135deg, #C2185B, #7B1FA2)',
    },
    {
      label: 'Bookings', value: data?.bookings.total ?? 0,
      sub: `${data?.bookings.confirmed ?? 0} confirmed`,
      icon: FaCalendarCheck, gradient: 'linear(135deg, #1565C0, #1976D2)',
    },
    {
      label: 'Messages', value: data?.messages.total ?? 0,
      sub: `${data?.messages.new ?? 0} new`,
      icon: FaEnvelope, gradient: 'linear(135deg, #2E7D32, #43A047)',
    },
    {
      label: 'Pending Review', value: (data?.consultations.pending ?? 0) + (data?.messages.new ?? 0),
      sub: 'consultations + messages',
      icon: FaClock, gradient: 'linear(135deg, #E65100, #FF8F00)',
    },
  ]

  return (
    <AdminLayout messageBadge={data?.messages.new}>
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">

          {/* Page title */}
          <Box>
            <HStack spacing={3} mb={1}>
              <Box bg="brand.500" p={2} borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
                <Icon as={FaChartBar} color="white" fontSize="md" />
              </Box>
              <Heading size="lg" color="gray.800">Dashboard</Heading>
            </HStack>
            <Text color="gray.500" fontSize="sm" pl={1}>Overview of Royal Health activity</Text>
          </Box>

          {/* Stat cards */}
          <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing={5}>
            {statRows.map(s => (
              <StatCard key={s.label} {...s} loading={loading} />
            ))}
          </SimpleGrid>

          {/* Recent tables */}
          <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>

            {/* Recent Consultations */}
            <Card borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
              <CardBody p={0}>
                <HStack px={5} py={4} borderBottom="1px solid" borderColor="gray.100" spacing={2}>
                  <Icon as={FaStethoscope} color="brand.500" fontSize="sm" />
                  <Text fontWeight="700" fontSize="md" color="gray.800">Recent Consultations</Text>
                </HStack>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg={tableBg}>
                      <Tr>
                        <Th fontSize="10px">Patient</Th>
                        <Th fontSize="10px">Service</Th>
                        <Th fontSize="10px">Date</Th>
                        <Th fontSize="10px">Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {loading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <Tr key={i}>
                              {[120, 100, 70, 60].map((w, j) => (
                                <Td key={j}><Skeleton h="12px" w={`${w}px`} borderRadius="sm" /></Td>
                              ))}
                            </Tr>
                          ))
                        : (data?.recentConsultations ?? []).length === 0
                        ? (
                            <Tr>
                              <Td colSpan={4} textAlign="center" py={8}>
                                <Text fontSize="sm" color="gray.400">No consultations yet</Text>
                              </Td>
                            </Tr>
                          )
                        : data!.recentConsultations.map(c => (
                            <Tr key={c.id} _hover={{ bg: 'gray.50' }}>
                              <Td py={2}>
                                <Text fontSize="sm" fontWeight="500" noOfLines={1}>{c.name}</Text>
                                <Text fontSize="10px" color="gray.500">{c.phone}</Text>
                              </Td>
                              <Td py={2}>
                                <Text fontSize="xs" color="gray.600" noOfLines={1} maxW="120px">
                                  {c.service_type}
                                </Text>
                              </Td>
                              <Td py={2}>
                                <Text fontSize="xs" color="gray.500">{formatDate(c.submitted_at)}</Text>
                              </Td>
                              <Td py={2}>
                                <Badge
                                  colorScheme={CONSULTATION_STATUS_COLOR[c.status] ?? 'gray'}
                                  fontSize="9px"
                                  borderRadius="full"
                                  px={2}
                                >
                                  {c.status}
                                </Badge>
                              </Td>
                            </Tr>
                          ))
                      }
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

            {/* Recent Bookings */}
            <Card borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
              <CardBody p={0}>
                <HStack px={5} py={4} borderBottom="1px solid" borderColor="gray.100" spacing={2}>
                  <Icon as={FaCalendarCheck} color="blue.500" fontSize="sm" />
                  <Text fontWeight="700" fontSize="md" color="gray.800">Recent Bookings</Text>
                </HStack>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg={tableBg}>
                      <Tr>
                        <Th fontSize="10px">Patient</Th>
                        <Th fontSize="10px">Ref</Th>
                        <Th fontSize="10px">Date</Th>
                        <Th fontSize="10px">Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {loading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <Tr key={i}>
                              {[120, 80, 70, 60].map((w, j) => (
                                <Td key={j}><Skeleton h="12px" w={`${w}px`} borderRadius="sm" /></Td>
                              ))}
                            </Tr>
                          ))
                        : (data?.recentBookings ?? []).length === 0
                        ? (
                            <Tr>
                              <Td colSpan={4} textAlign="center" py={8}>
                                <Text fontSize="sm" color="gray.400">No bookings yet</Text>
                              </Td>
                            </Tr>
                          )
                        : data!.recentBookings.map(b => (
                            <Tr key={b.id} _hover={{ bg: 'gray.50' }}>
                              <Td py={2}>
                                <Text fontSize="sm" fontWeight="500" noOfLines={1}>{b.patient_name}</Text>
                              </Td>
                              <Td py={2}>
                                <Tag size="sm" colorScheme="gray" fontFamily="mono" fontSize="9px">
                                  {b.confirmation_code}
                                </Tag>
                              </Td>
                              <Td py={2}>
                                <Text fontSize="xs" color="gray.500">{formatDate(b.created_at)}</Text>
                              </Td>
                              <Td py={2}>
                                <Badge
                                  colorScheme={BOOKING_STATUS_COLOR[b.status] ?? 'gray'}
                                  fontSize="9px"
                                  borderRadius="full"
                                  px={2}
                                >
                                  {b.status}
                                </Badge>
                              </Td>
                            </Tr>
                          ))
                      }
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

          </SimpleGrid>

          {/* Footer */}
          <HStack justify="center" spacing={2}>
            <Icon as={FaHeartbeat} color="brand.400" fontSize="sm" />
            <Text fontSize="xs" color="gray.400">
              Royal Health Admin · Showing latest data
            </Text>
          </HStack>

        </VStack>
      </Container>
    </AdminLayout>
  )
}

export default AdminDashboard
