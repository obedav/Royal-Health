import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Text,
  Alert,
  AlertIcon,
  useToast,
  SimpleGrid,
  Badge,
  Card,
  CardBody,
  Divider,
} from '@chakra-ui/react';

interface AppointmentData {
  patientName: string;
  email: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  symptoms: string;
  urgencyLevel: 'routine' | 'urgent' | 'emergency';
  location: 'home' | 'office' | 'online';
}

const AppointmentBooking: React.FC = () => {
  const [formData, setFormData] = useState<AppointmentData>({
    patientName: '',
    email: '',
    phone: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    symptoms: '',
    urgencyLevel: 'routine',
    location: 'home',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const services = [
    'General Consultation',
    'Health Checkup',
    'Immunization',
    'Wound Care',
    'Blood Pressure Monitoring',
    'Diabetes Management',
    'Physiotherapy',
    'Mental Health Counseling',
    'Nutrition Consultation',
    'Elderly Care',
    'Post-Surgery Care',
    'Chronic Disease Management'
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = ['patientName', 'email', 'phone', 'serviceType', 'preferredDate', 'preferredTime'];
    for (const field of requiredFields) {
      if (!formData[field as keyof AppointmentData]) {
        toast({
          title: 'Validation Error',
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          appointmentDateTime: `${formData.preferredDate}T${formData.preferredTime}:00`,
          status: 'pending'
        }),
      });

      if (response.ok) {
        toast({
          title: 'Appointment Booked Successfully!',
          description: 'You will receive a confirmation email shortly.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Reset form
        setFormData({
          patientName: '',
          email: '',
          phone: '',
          serviceType: '',
          preferredDate: '',
          preferredTime: '',
          symptoms: '',
          urgencyLevel: 'routine',
          location: 'home',
        });
      } else {
        throw new Error('Failed to book appointment');
      }
    } catch (error) {
      toast({
        title: 'Booking Failed',
        description: 'There was an error booking your appointment. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box p={6} maxW="4xl" mx="auto">
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="blue.600" mb={2}>
            Book Your Appointment
          </Text>
          <Text color="gray.600">
            Schedule a consultation with our healthcare professionals
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            {/* Patient Information */}
            <Card>
              <CardBody>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Patient Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+234 800 123 4567"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Service Type</FormLabel>
                    <Select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      placeholder="Select a service"
                    >
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </CardBody>
            </Card>

            {/* Appointment Details */}
            <Card>
              <CardBody>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Appointment Details
                </Text>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Preferred Date</FormLabel>
                      <Input
                        name="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Preferred Time</FormLabel>
                      <Select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        placeholder="Select time"
                      >
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Urgency Level</FormLabel>
                      <Select
                        name="urgencyLevel"
                        value={formData.urgencyLevel}
                        onChange={handleInputChange}
                      >
                        <option value="routine">Routine</option>
                        <option value="urgent">Urgent</option>
                        <option value="emergency">Emergency</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Consultation Location</FormLabel>
                      <Select
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                      >
                        <option value="home">Home Visit</option>
                        <option value="office">Clinic Visit</option>
                        <option value="online">Online Consultation</option>
                      </Select>
                    </FormControl>
                  </VStack>
                </SimpleGrid>
              </CardBody>
            </Card>

            {/* Symptoms & Notes */}
            <Card>
              <CardBody>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Symptoms & Additional Information
                </Text>
                <FormControl>
                  <FormLabel>Describe your symptoms or reason for visit</FormLabel>
                  <Textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    placeholder="Please describe your symptoms, concerns, or reason for the appointment..."
                    rows={4}
                  />
                </FormControl>
              </CardBody>
            </Card>

            {/* Urgency Alert */}
            {formData.urgencyLevel === 'emergency' && (
              <Alert status="warning">
                <AlertIcon />
                For medical emergencies, please call emergency services immediately or visit the nearest hospital.
              </Alert>
            )}

            {/* Summary */}
            {formData.patientName && formData.serviceType && formData.preferredDate && formData.preferredTime && (
              <Card>
                <CardBody>
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>
                    Appointment Summary
                  </Text>
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">Patient:</Text>
                      <Text>{formData.patientName}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">Service:</Text>
                      <Text>{formData.serviceType}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">Date & Time:</Text>
                      <Text>{new Date(formData.preferredDate).toLocaleDateString()} at {formData.preferredTime}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">Location:</Text>
                      <Badge colorScheme="blue" textTransform="capitalize">
                        {formData.location.replace('_', ' ')}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">Urgency:</Text>
                      <Badge 
                        colorScheme={
                          formData.urgencyLevel === 'emergency' ? 'red' :
                          formData.urgencyLevel === 'urgent' ? 'orange' : 'green'
                        }
                        textTransform="capitalize"
                      >
                        {formData.urgencyLevel}
                      </Badge>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            )}

            <Divider />

            {/* Submit Button */}
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={isSubmitting}
              loadingText="Booking Appointment..."
              w={{ base: 'full', md: 'auto' }}
              alignSelf="center"
            >
              Book Appointment
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default AppointmentBooking;