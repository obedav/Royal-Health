import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Badge,
  Icon,
  SimpleGrid,
  Button,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Input,
  Select,
} from '@chakra-ui/react'
import { FaStethoscope, FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEye, FaCheck, FaClock } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { HEALTHCARE_SERVICES } from '../utils/constants'

interface ConsultationRequest {
  id: string
  name: string
  phone: string
  email?: string
  age: number
  gender: 'male' | 'female' | 'other'
  serviceType: string
  state: string
  city: string
  address: string
  healthConcerns?: string
  preferredDate: string
  preferredTime: 'morning' | 'afternoon' | 'evening'
  submittedAt: string
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled'
}

const AdminConsultations: React.FC = () => {
  const [requests, setRequests] = useState<ConsultationRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<ConsultationRequest[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // Mock data - In real app, this would come from API/backend
  useEffect(() => {
    // Simulate loading consultation requests
    const mockRequests: ConsultationRequest[] = [
      {
        id: '1',
        name: 'John Doe',
        phone: '+2348012345678',
        email: 'john@example.com',
        age: 45,
        gender: 'male',
        serviceType: 'general-health-assessment',
        state: 'lagos',
        city: 'Lagos',
        address: '123 Victoria Island, Lagos',
        healthConcerns: 'High blood pressure concerns',
        preferredDate: '2024-01-15',
        preferredTime: 'morning',
        submittedAt: '2024-01-10T10:30:00Z',
        status: 'pending'
      },
      {
        id: '2',
        name: 'Mary Johnson',
        phone: '+2348087654321',
        age: 60,
        gender: 'female',
        serviceType: 'elderly-care-assessment',
        state: 'ogun',
        city: 'Abeokuta',
        address: '456 Oke Mosan, Abeokuta',
        preferredDate: '2024-01-16',
        preferredTime: 'afternoon',
        submittedAt: '2024-01-11T14:15:00Z',
        status: 'contacted'
      },
      {
        id: '3',
        name: 'Ahmad Hassan',
        phone: '+2347012345678',
        email: 'ahmad@example.com',
        age: 35,
        gender: 'male',
        serviceType: 'mental-health-screening',
        state: 'fct',
        city: 'Abuja',
        address: '789 Garki Area, Abuja',
        healthConcerns: 'Stress and anxiety management',
        preferredDate: '2024-01-17',
        preferredTime: 'evening',
        submittedAt: '2024-01-12T09:45:00Z',
        status: 'scheduled'
      }
    ]
    setRequests(mockRequests)
    setFilteredRequests(mockRequests)
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = requests

    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.phone.includes(searchTerm) ||
        req.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredRequests(filtered)
  }, [requests, statusFilter, searchTerm])

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'yellow',
      contacted: 'blue',
      scheduled: 'green',
      completed: 'gray',
      cancelled: 'red'
    }
    return colors[status as keyof typeof colors] || 'gray'
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: FaClock,
      contacted: FaPhone,
      scheduled: FaCalendarAlt,
      completed: FaCheck,
      cancelled: FaClock
    }
    return icons[status as keyof typeof icons] || FaClock
  }

  const updateRequestStatus = (id: string, newStatus: string) => {
    setRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: newStatus as ConsultationRequest['status'] } : req
    ))
  }

  const getServiceName = (serviceId: string) => {
    const service = HEALTHCARE_SERVICES.find(s => s.id === serviceId)
    return service?.name || serviceId
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    const timeMap = {
      morning: '8AM - 12PM',
      afternoon: '12PM - 5PM',
      evening: '5PM - 8PM'
    }
    return timeMap[time as keyof typeof timeMap] || time
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Icon as={FaStethoscope} fontSize="4xl" color="brand.500" mb={4} />
            <Heading
              size="xl"
              mb={4}
              bgGradient="linear(45deg, brand.600, purple.600)"
              bgClip="text"
              sx={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Consultation Requests - Admin Panel
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Monitor and manage health consultation requests
            </Text>
          </Box>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            {[
              { label: 'Total Requests', value: requests.length, color: 'blue', icon: FaUser },
              { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, color: 'yellow', icon: FaClock },
              { label: 'Contacted', value: requests.filter(r => r.status === 'contacted').length, color: 'blue', icon: FaPhone },
              { label: 'Scheduled', value: requests.filter(r => r.status === 'scheduled').length, color: 'green', icon: FaCalendarAlt },
            ].map((stat, index) => (
              <Card key={index} bg={cardBg} borderColor={borderColor} borderWidth="2px">
                <CardBody p={6} textAlign="center">
                  <VStack spacing={3}>
                    <Box
                      w={12}
                      h={12}
                      bgGradient={`linear(45deg, ${stat.color}.100, ${stat.color}.200)`}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={stat.icon} color={`${stat.color}.600`} fontSize="xl" />
                    </Box>
                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                      {stat.value}
                    </Text>
                    <Text fontSize="sm" color="gray.600" fontWeight="500">
                      {stat.label}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Filters */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="2px">
            <CardBody p={6}>
              <Flex gap={4} flexWrap="wrap">
                <Input
                  placeholder="Search by name, phone, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  maxW="300px"
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  maxW="200px"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </Flex>
            </CardBody>
          </Card>

          {/* Requests Table */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="2px">
            <CardBody p={0}>
              <TableContainer>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Patient Info</Th>
                      <Th>Service Type</Th>
                      <Th>Location</Th>
                      <Th>Preferred Schedule</Th>
                      <Th>Status</Th>
                      <Th>Submitted</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredRequests.map((request) => (
                      <Tr key={request.id} _hover={{ bg: 'gray.50' }}>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="bold" fontSize="sm">
                              {request.name}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {request.phone}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              Age: {request.age}, {request.gender}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Text fontSize="sm" fontWeight="500">
                            {getServiceName(request.serviceType)}
                          </Text>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" fontWeight="500">
                              {request.city}, {request.state}
                            </Text>
                            <Text fontSize="xs" color="gray.600" noOfLines={1} maxW="200px">
                              {request.address}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" fontWeight="500">
                              {formatDate(request.preferredDate)}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {formatTime(request.preferredTime)}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={getStatusColor(request.status)}
                            variant="subtle"
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            {request.status}
                          </Badge>
                        </Td>
                        <Td>
                          <Text fontSize="xs" color="gray.600">
                            {formatDate(request.submittedAt)}
                          </Text>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Select
                              size="sm"
                              value={request.status}
                              onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                              minW="120px"
                            >
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </Select>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              {filteredRequests.length === 0 && (
                <Box textAlign="center" py={12}>
                  <Text color="gray.500" fontSize="lg">
                    No consultation requests found
                  </Text>
                  <Text color="gray.400" fontSize="sm" mt={2}>
                    Try adjusting your search or filter criteria
                  </Text>
                </Box>
              )}
            </CardBody>
          </Card>

          {/* Instructions */}
          <Card bg="blue.50" borderColor="blue.200" borderWidth="2px">
            <CardBody p={6}>
              <VStack spacing={3} align="start">
                <Heading size="md" color="blue.800">
                  Admin Instructions
                </Heading>
                <Text color="blue.700" fontSize="sm">
                  1. Monitor incoming consultation requests in real-time
                </Text>
                <Text color="blue.700" fontSize="sm">
                  2. Update status as you contact and schedule patients
                </Text>
                <Text color="blue.700" fontSize="sm">
                  3. Use search and filters to manage large volumes of requests
                </Text>
                <Text color="blue.700" fontSize="sm">
                  4. Contact patients within 24 hours of their submission
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  )
}

export default AdminConsultations