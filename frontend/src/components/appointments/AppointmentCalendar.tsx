import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  SimpleGrid,
  Card,
  CardBody,
  Select,
  Input,
  Flex,
  IconButton,
  Tooltip,
  useToast,
  Alert,
  AlertIcon,
  Divider,
} from '@chakra-ui/react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'en-US': enUS,
  },
});

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  patientName: string;
  email: string;
  phone: string;
  serviceType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  urgencyLevel: 'routine' | 'urgent' | 'emergency';
  location: 'home' | 'office' | 'online';
  symptoms?: string;
  notes?: string;
}

interface AppointmentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (appointmentId: string, newStatus: string) => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onStatusUpdate,
}) => {
  const [status, setStatus] = useState(appointment?.status || 'pending');
  const [notes, setNotes] = useState(appointment?.notes || '');
  const toast = useToast();

  useEffect(() => {
    if (appointment) {
      setStatus(appointment.status);
      setNotes(appointment.notes || '');
    }
  }, [appointment]);

  const handleUpdateStatus = async () => {
    if (!appointment) return;

    try {
      const response = await fetch(`/api/v1/bookings/${appointment.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });

      if (response.ok) {
        onStatusUpdate(appointment.id, status);
        toast({
          title: 'Appointment Updated',
          description: 'Appointment status has been updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        throw new Error('Failed to update appointment');
      }
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update appointment status. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!appointment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'green';
      case 'completed': return 'blue';
      case 'cancelled': return 'red';
      default: return 'yellow';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'red';
      case 'urgent': return 'orange';
      default: return 'green';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack justify="space-between">
            <Text>Appointment Details</Text>
            <Badge colorScheme={getStatusColor(appointment.status)} textTransform="capitalize">
              {appointment.status}
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={2} spacing={4}>
              <Box>
                <Text fontWeight="semibold" color="gray.600">Patient Name</Text>
                <Text>{appointment.patientName}</Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" color="gray.600">Service</Text>
                <Text>{appointment.serviceType}</Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" color="gray.600">Date & Time</Text>
                <Text>{format(appointment.start, 'MMM dd, yyyy')}</Text>
                <Text fontSize="sm" color="gray.500">
                  {format(appointment.start, 'hh:mm a')} - {format(appointment.end, 'hh:mm a')}
                </Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" color="gray.600">Contact</Text>
                <Text fontSize="sm">{appointment.email}</Text>
                <Text fontSize="sm">{appointment.phone}</Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" color="gray.600">Location</Text>
                <Badge colorScheme="blue" textTransform="capitalize">
                  {appointment.location}
                </Badge>
              </Box>
              <Box>
                <Text fontWeight="semibold" color="gray.600">Urgency</Text>
                <Badge colorScheme={getUrgencyColor(appointment.urgencyLevel)} textTransform="capitalize">
                  {appointment.urgencyLevel}
                </Badge>
              </Box>
            </SimpleGrid>

            {appointment.symptoms && (
              <Box>
                <Text fontWeight="semibold" color="gray.600">Symptoms</Text>
                <Text fontSize="sm" p={2} bg="gray.50" borderRadius="md">
                  {appointment.symptoms}
                </Text>
              </Box>
            )}

            <Divider />

            <Box>
              <Text fontWeight="semibold" mb={2}>Update Status</Text>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                mb={2}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </Box>

            <Box>
              <Text fontWeight="semibold" mb={2}>Notes</Text>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes or comments..."
              />
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleUpdateStatus}>
            Update Appointment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const AppointmentCalendar: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.WEEK);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/bookings');
      if (response.ok) {
        const data = await response.json();
        const formattedAppointments: Appointment[] = data.map((booking: any) => ({
          id: booking.id,
          title: `${booking.patientName} - ${booking.serviceType}`,
          start: new Date(booking.appointmentDateTime),
          end: addDays(new Date(booking.appointmentDateTime), 0),
          patientName: booking.patientName,
          email: booking.email,
          phone: booking.phone,
          serviceType: booking.serviceType,
          status: booking.status,
          urgencyLevel: booking.urgencyLevel || 'routine',
          location: booking.location || 'home',
          symptoms: booking.symptoms,
          notes: booking.notes,
        }));
        setAppointments(formattedAppointments);
      } else {
        throw new Error('Failed to fetch appointments');
      }
    } catch (error) {
      // Mock data for demo purposes
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          title: 'John Doe - General Consultation',
          start: new Date(2025, 8, 2, 9, 0),
          end: new Date(2025, 8, 2, 10, 0),
          patientName: 'John Doe',
          email: 'john@example.com',
          phone: '+234 800 123 4567',
          serviceType: 'General Consultation',
          status: 'confirmed',
          urgencyLevel: 'routine',
          location: 'home',
          symptoms: 'General checkup and health assessment',
        },
        {
          id: '2',
          title: 'Jane Smith - Blood Pressure Check',
          start: new Date(2025, 8, 2, 14, 0),
          end: new Date(2025, 8, 2, 15, 0),
          patientName: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+234 800 234 5678',
          serviceType: 'Blood Pressure Monitoring',
          status: 'pending',
          urgencyLevel: 'urgent',
          location: 'office',
          symptoms: 'High blood pressure monitoring',
        },
        {
          id: '3',
          title: 'Robert Johnson - Diabetes Management',
          start: new Date(2025, 8, 3, 11, 0),
          end: new Date(2025, 8, 3, 12, 0),
          patientName: 'Robert Johnson',
          email: 'robert@example.com',
          phone: '+234 800 345 6789',
          serviceType: 'Diabetes Management',
          status: 'completed',
          urgencyLevel: 'routine',
          location: 'online',
          symptoms: 'Regular diabetes checkup and management',
        },
      ];
      setAppointments(mockAppointments);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleSelectEvent = (event: Appointment) => {
    setSelectedAppointment(event);
    onOpen();
  };

  const handleStatusUpdate = (appointmentId: string, newStatus: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: newStatus as any } : apt
      )
    );
  };

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setCurrentView(newView);
  };

  const eventStyleGetter = (event: Appointment) => {
    let backgroundColor = '#3174ad';
    
    switch (event.status) {
      case 'confirmed':
        backgroundColor = '#38a169';
        break;
      case 'pending':
        backgroundColor = '#d69e2e';
        break;
      case 'completed':
        backgroundColor = '#3182ce';
        break;
      case 'cancelled':
        backgroundColor = '#e53e3e';
        break;
    }

    if (event.urgencyLevel === 'emergency') {
      backgroundColor = '#e53e3e';
    } else if (event.urgencyLevel === 'urgent') {
      backgroundColor = '#dd6b20';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const filteredAppointments = appointments.filter(apt => 
    filterStatus === 'all' || apt.status === filterStatus
  );

  const getStatusCounts = () => {
    const counts = {
      total: appointments.length,
      pending: appointments.filter(apt => apt.status === 'pending').length,
      confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <Box p={6} maxW="7xl" mx="auto">
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              Appointment Calendar
            </Text>
            <Text color="gray.600">
              Manage and view all appointments
            </Text>
          </Box>
          
          <HStack spacing={4}>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              w="150px"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            
            <Button
              colorScheme="blue"
              onClick={fetchAppointments}
              isLoading={isLoading}
            >
              Refresh
            </Button>
          </HStack>
        </Flex>

        {/* Statistics Cards */}
        <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
          <Card>
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {statusCounts.total}
              </Text>
              <Text fontSize="sm" color="gray.600">Total</Text>
            </CardBody>
          </Card>
          <Card>
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                {statusCounts.pending}
              </Text>
              <Text fontSize="sm" color="gray.600">Pending</Text>
            </CardBody>
          </Card>
          <Card>
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                {statusCounts.confirmed}
              </Text>
              <Text fontSize="sm" color="gray.600">Confirmed</Text>
            </CardBody>
          </Card>
          <Card>
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                {statusCounts.completed}
              </Text>
              <Text fontSize="sm" color="gray.600">Completed</Text>
            </CardBody>
          </Card>
          <Card>
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="red.500">
                {statusCounts.cancelled}
              </Text>
              <Text fontSize="sm" color="gray.600">Cancelled</Text>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Calendar */}
        <Card>
          <CardBody>
            <Box height="600px">
              <Calendar
                localizer={localizer}
                events={filteredAppointments}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelectEvent}
                onNavigate={handleNavigate}
                onView={handleViewChange}
                view={currentView}
                date={currentDate}
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day']}
                step={30}
                showMultiDayTimes
                components={{
                  toolbar: ({ label, onNavigate, onView, view }) => (
                    <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
                      <HStack>
                        <IconButton
                          aria-label="Previous"
                          icon={<ChevronLeftIcon />}
                          onClick={() => onNavigate('PREV')}
                          size="sm"
                        />
                        <Text fontSize="lg" fontWeight="semibold" minW="200px" textAlign="center">
                          {label}
                        </Text>
                        <IconButton
                          aria-label="Next"
                          icon={<ChevronRightIcon />}
                          onClick={() => onNavigate('NEXT')}
                          size="sm"
                        />
                        <Button
                          size="sm"
                          onClick={() => onNavigate('TODAY')}
                        >
                          Today
                        </Button>
                      </HStack>
                      
                      <HStack>
                        <Button
                          size="sm"
                          variant={view === 'month' ? 'solid' : 'ghost'}
                          onClick={() => onView('month')}
                        >
                          Month
                        </Button>
                        <Button
                          size="sm"
                          variant={view === 'week' ? 'solid' : 'ghost'}
                          onClick={() => onView('week')}
                        >
                          Week
                        </Button>
                        <Button
                          size="sm"
                          variant={view === 'day' ? 'solid' : 'ghost'}
                          onClick={() => onView('day')}
                        >
                          Day
                        </Button>
                      </HStack>
                    </Flex>
                  ),
                }}
              />
            </Box>
          </CardBody>
        </Card>

        {/* Legend */}
        <Card>
          <CardBody>
            <Text fontWeight="semibold" mb={3}>Status Legend</Text>
            <HStack spacing={4} wrap="wrap">
              <HStack>
                <Box w={4} h={4} bg="#d69e2e" borderRadius="sm" />
                <Text fontSize="sm">Pending</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#38a169" borderRadius="sm" />
                <Text fontSize="sm">Confirmed</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#3182ce" borderRadius="sm" />
                <Text fontSize="sm">Completed</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#e53e3e" borderRadius="sm" />
                <Text fontSize="sm">Cancelled/Emergency</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#dd6b20" borderRadius="sm" />
                <Text fontSize="sm">Urgent</Text>
              </HStack>
            </HStack>
          </CardBody>
        </Card>
      </VStack>

      {/* Appointment Details Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={isOpen}
        onClose={onClose}
        onStatusUpdate={handleStatusUpdate}
      />
    </Box>
  );
};

export default AppointmentCalendar;