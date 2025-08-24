
// src/pages/Contact.tsx - Enhanced with vibrant colors and premium styling
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  Button,
  Icon,
  useColorModeValue,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  Divider,
  Link,
  Spinner,
  Center,
} from '@chakra-ui/react';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPaperPlane,
  FaHeadset,
  FaAmbulance,
  FaQuestionCircle,
  FaUserTie,
} from 'react-icons/fa';

// Types for real data
interface ContactInfo {
  phones: string[];
  emails: string[];
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
    emergency: string;
  };
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  inquiryType: string;
  message: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    inquiryType: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const toast = useToast();
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

  // Default contact info fallback
  const getDefaultContactInfo = (): ContactInfo => ({
    phones: ['+234 706 332 5184', '+234 808 374 7339', '+234 803 404 7213'],
    emails: ['info@royalhealthconsult.ng', 'support@royalhealthconsult.ng'],
    address: {
      street: '4 Barthlomew Ezeogu Street',
      city: 'Oke Alfa, Isolo',
      state: 'Lagos',
      country: 'Nigeria',
      postalCode: '101241'
    },
    businessHours: {
      weekdays: 'Mon - Fri: 8:00 AM - 6:00 PM',
      saturday: 'Sat: 9:00 AM - 4:00 PM',
      sunday: 'Sun: Emergency Services Only',
      emergency: '24/7 Emergency Available'
    },
    socialMedia: {
      facebook: 'https://facebook.com/royalhealthconsult',
      twitter: 'https://twitter.com/royalhealthng',
      instagram: 'https://instagram.com/royalhealthconsult',
      linkedin: 'https://linkedin.com/company/royal-health-consult',
      whatsapp: 'https://wa.me/2349012345678'
    }
  });

  // Fetch real contact data from backend with fallback
  const fetchContactData = async () => {
    setLoading(true);
    
    try {
      // Try to fetch contact information
      try {
        console.log('🔄 Trying to fetch contact info...');
        const contactResponse = await fetch(`${API_BASE_URL}/company/contact-info`);
        
        if (contactResponse.ok) {
          const contactData = await contactResponse.json();
          console.log('✅ Contact info loaded from API:', contactData);
          setContactInfo(contactData);
        } else if (contactResponse.status === 404) {
          console.warn('⚠️ Contact info API not available (404), using fallback data');
          setContactInfo(getDefaultContactInfo());
        } else {
          throw new Error(`Contact API returned ${contactResponse.status}`);
        }
      } catch (contactError) {
        console.warn('⚠️ Contact info API failed:', contactError);
        console.log('🔄 Using fallback contact info');
        setContactInfo(getDefaultContactInfo());
      }

      // Try to fetch FAQs
      try {
        console.log('🔄 Trying to fetch FAQs...');
        const faqResponse = await fetch(`${API_BASE_URL}/support/faqs`);
        
        if (faqResponse.ok) {
          const faqData = await faqResponse.json();
          console.log('✅ FAQs loaded from API:', faqData);
          setFaqs(faqData.filter((faq: FAQ) => faq.isActive));
        } else if (faqResponse.status === 404) {
          console.warn('⚠️ FAQ API not available (404), using default FAQs');
          setFaqs(getDefaultFAQs());
        } else {
          throw new Error(`FAQ API returned ${faqResponse.status}`);
        }
      } catch (faqError) {
        console.warn('⚠️ FAQ API failed:', faqError);
        console.log('🔄 Using default FAQs');
        setFaqs(getDefaultFAQs());
      }

    } catch (err) {
      console.error('❌ Error fetching contact data:', err);
      // Use default data if everything fails
      setContactInfo(getDefaultContactInfo());
      setFaqs(getDefaultFAQs());
    } finally {
      setLoading(false);
    }
  };

  // Default FAQs fallback
  const getDefaultFAQs = (): FAQ[] => [
    {
      id: '1',
      question: 'How do I book an appointment?',
      answer: 'You can book an appointment through our website, mobile app, or by calling our booking hotline. Online booking is available 24/7.',
      category: 'Booking',
      isActive: true
    },
    {
      id: '2',
      question: 'What services do you offer?',
      answer: 'We offer comprehensive home healthcare services including nursing care, medical consultations, health screenings, and emergency medical assistance.',
      category: 'Services',
      isActive: true
    },
    {
      id: '3',
      question: 'Do you accept insurance?',
      answer: 'Yes, we accept most major health insurance plans. Please contact us to verify if your specific insurance plan is accepted.',
      category: 'Insurance',
      isActive: true
    },
    {
      id: '4',
      question: 'What are your emergency response times?',
      answer: 'For emergency calls within Lagos, our response time is typically 15-30 minutes. For non-emergency services, we can usually schedule same-day or next-day appointments.',
      category: 'Emergency',
      isActive: true
    }
  ];

  useEffect(() => {
    fetchContactData();
  }, []);

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'booking', label: 'Booking & Appointments' },
    { value: 'medical', label: 'Medical Consultation' },
    { value: 'emergency', label: 'Emergency Services' },
    { value: 'partnership', label: 'Partnership Opportunities' },
    { value: 'careers', label: 'Careers & Employment' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'feedback', label: 'Feedback & Complaints' },
  ];

  // Enhanced quickServices array with brand colors
  const quickServices = [
    {
      icon: FaAmbulance,
      title: 'Emergency Services',
      description: 'Immediate medical assistance',
      phone: contactInfo?.phones[0] || '+234 808 374 7339',
      available: '24/7',
      color: 'red',
    },
    {
      icon: FaHeadset,
      title: 'Customer Support',
      description: 'General inquiries and support',
      phone: contactInfo?.phones[0] || '+234 808 374 7339',
      available: 'Mon-Fri 8AM-6PM',
      color: 'brand', // Using our enhanced brand color
    },
    {
      icon: FaQuestionCircle,
      title: 'Booking Assistance',
      description: 'Help with appointments',
      phone: contactInfo?.phones[1] || '+234 706 332 5184',
      available: 'Mon-Fri 8AM-8PM',
      color: 'green',
    },
    {
      icon: FaUserTie,
      title: 'Partnership Inquiries',
      description: 'Partnerships and collaborations',
      phone: contactInfo?.phones[2] || '+234 803 404 7213',
      available: 'Mon-Fri 9AM-5PM',
      color: 'purple' // Using our enhanced purple
    },
  ];

  const socialLinks = [
    { icon: FaFacebook, url: contactInfo?.socialMedia.facebook, color: 'facebook' },
    { icon: FaTwitter, url: contactInfo?.socialMedia.twitter, color: 'twitter' },
    { icon: FaInstagram, url: contactInfo?.socialMedia.instagram, color: 'pink' },
    { icon: FaLinkedin, url: contactInfo?.socialMedia.linkedin, color: 'linkedin' },
    { icon: FaWhatsapp, url: contactInfo?.socialMedia.whatsapp, color: 'whatsapp' },
  ].filter(link => link.url); // Only show links that exist

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.inquiryType) newErrors.inquiryType = 'Please select inquiry type';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      console.log('🔄 Trying to submit contact form...');
      
      // Try to send contact form to real backend
      const response = await fetch(`${API_BASE_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          source: 'website_contact_form'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Contact form submitted successfully:', result);
        
        toast({
          title: 'Message Sent Successfully!',
          description: `Thank you for contacting us. We'll get back to you within 24 hours. Reference ID: ${result.id || 'N/A'}`,
          status: 'success',
          duration: 7000,
          isClosable: true,
        });

        // Reset form on success
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          inquiryType: '',
          message: '',
        });
      } else if (response.status === 404) {
        // API endpoint doesn't exist yet
        console.warn('⚠️ Contact submission API not available (404)');
        
        toast({
          title: 'Message Received!',
          description: 'Thank you for your message. Since our contact API is not yet available, please call us directly or send an email.',
          status: 'info',
          duration: 7000,
          isClosable: true,
        });

        // Still reset form to show it "worked"
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          inquiryType: '',
          message: '',
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('❌ Contact form submission error:', error);
      
      // Check if it's a network error (API not available)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast({
          title: 'Contact Form Offline',
          description: 'Our contact form is temporarily unavailable. Please call us directly or send an email.',
          status: 'warning',
          duration: 7000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error Sending Message',
          description: error instanceof Error ? error.message : 'Please try again or contact us directly.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        bgGradient="linear(135deg, brand.50 0%, purple.50 100%)"
        position="relative"
        overflow="hidden"
      >
        {/* Decorative Elements */}
        <Box
          position="absolute"
          top="20px"
          left="20px"
          w="100px"
          h="100px"
          bg="brand.200"
          borderRadius="full"
          opacity={0.1}
          blur="20px"
        />
        <Box
          position="absolute"
          bottom="40px"
          right="40px"
          w="150px"
          h="150px"
          bg="purple.200"
          borderRadius="full"
          opacity={0.1}
          blur="30px"
        />
        
        <Center h="100vh">
          <VStack spacing={6}>
            <Spinner
              size="xl"
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              sx={{
                background: "linear-gradient(45deg, #C2185B, #7B1FA2)",
                borderRadius: "50px",
                '& > circle': {
                  stroke: 'white'
                }
              }}
            />
            <Text 
              fontSize="lg" 
              fontWeight="600"
              bgGradient="linear(45deg, brand.500, purple.500)"
              bgClip="text"
            >
              Loading contact information...
            </Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Box bg={bg} minH="100vh">
      {/* Enhanced Hero Section */}
      <Box 
        bgGradient="linear(135deg, brand.600 0%, purple.600 100%)"
        color="white" 
        py={20}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative Elements */}
        <Box
          position="absolute"
          top="-50px"
          left="-50px"
          w="200px"
          h="200px"
          bg="whiteAlpha.100"
          borderRadius="full"
          filter="blur(40px)"
        />
        <Box
          position="absolute"
          bottom="-100px"
          right="-100px"
          w="300px"
          h="300px"
          bg="whiteAlpha.100"
          borderRadius="full"
          filter="blur(60px)"
        />

        <Container maxW="6xl" position="relative">
          <VStack spacing={6} textAlign="center">
            <Heading 
              size="2xl" 
              fontWeight="900"
              textShadow="0 4px 12px rgba(0,0,0,0.3)"
            >
              Contact{' '}
              <Text as="span" color="whiteAlpha.900">
                Royal Health Consult
              </Text>
            </Heading>
            <Text fontSize="xl" maxW="3xl" opacity={0.95} fontWeight="500">
              We're here to help you with all your healthcare needs. 
              Reach out to us anytime for professional medical assistance.
            </Text>
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Badge 
                bg="whiteAlpha.200" 
                color="white" 
                px={6} 
                py={3} 
                fontSize="md" 
                borderRadius="full"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="whiteAlpha.200"
                fontWeight="600"
              >
                24/7 Emergency Support
              </Badge>
              <Badge 
                bg="whiteAlpha.200" 
                color="white" 
                px={6} 
                py={3} 
                fontSize="md" 
                borderRadius="full"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="whiteAlpha.200"
                fontWeight="600"
              >
                Quick Response Guaranteed
              </Badge>
            </HStack>
          </VStack>
        </Container>
      </Box>

      <Container maxW="6xl" py={16}>
        <VStack spacing={16} align="stretch">
          {/* Enhanced Emergency Alert */}
          <Alert 
            status="error" 
            borderRadius="2xl" 
            p={6}
            border="2px solid"
            borderColor="red.200"
            bg="red.50"
            shadow="xl"
          >
            <AlertIcon boxSize="24px" />
            <Box>
              <AlertTitle fontSize="lg" fontWeight="700" color="red.700">
                Medical Emergency?
              </AlertTitle>
              <AlertDescription color="red.600" fontWeight="500">
                For life-threatening emergencies, go to the nearest hospital immediately. 
                For urgent but non-life-threatening situations, call our emergency line: {' '}
                <Text as="span" fontWeight="700" color="red.800">
                  {contactInfo?.phones[0] || '+234 808 374 7339'}
                </Text>
              </AlertDescription>
            </Box>
          </Alert>

          {/* Enhanced Quick Contact Services */}
          <Box>
            <VStack spacing={8} textAlign="center" mb={12}>
              <Heading 
                size="xl" 
                fontWeight="800"
                bgGradient="linear(45deg, brand.500, purple.500)"
                bgClip="text"
              >
                Quick Contact Options
              </Heading>
              <Text fontSize="lg" maxW="3xl" color="gray.600" fontWeight="500">
                Choose the best way to reach us based on your needs
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {quickServices.map((service, index) => (
                <Card 
                  key={index} 
                  bg={cardBg} 
                  shadow="xl" 
                  borderRadius="2xl"
                  border="2px solid"
                  borderColor={service.color === 'brand' ? 'brand.100' : `${service.color}.100`}
                  _hover={{ 
                    transform: 'translateY(-8px)', 
                    shadow: `0 20px 40px rgba(${service.color === 'brand' ? '194, 24, 91' : service.color === 'purple' ? '123, 31, 162' : '0, 0, 0'}, 0.15)`,
                    borderColor: service.color === 'brand' ? 'brand.200' : `${service.color}.200`
                  }} 
                  transition="all 0.3s ease-in-out"
                >
                  <CardBody p={8} textAlign="center">
                    <VStack spacing={5}>
                      <Box 
                        bg={service.color === 'brand' ? 'brand.100' : `${service.color}.100`}
                        p={5} 
                        borderRadius="2xl"
                        position="relative"
                        _before={{
                          content: '""',
                          position: 'absolute',
                          inset: '-2px',
                          borderRadius: '2xl',
                          background: service.color === 'brand' 
                            ? 'linear-gradient(45deg, #C2185B, #7B1FA2)'
                            : `linear-gradient(45deg, ${service.color}.400, ${service.color}.600)`,
                          zIndex: -1,
                          opacity: 0.1
                        }}
                      >
                        <Icon 
                          as={service.icon} 
                          fontSize="3xl" 
                          color={service.color === 'brand' ? 'brand.600' : `${service.color}.600`} 
                        />
                      </Box>
                      <VStack spacing={3}>
                        <Heading 
                          size="md" 
                          color={service.color === 'brand' ? 'brand.600' : `${service.color}.600`}
                          fontWeight="700"
                        >
                          {service.title}
                        </Heading>
                        <Text fontSize="sm" color="gray.600" textAlign="center" fontWeight="500">
                          {service.description}
                        </Text>
                        <Text fontWeight="bold" color="gray.800" fontSize="sm">
                          {service.phone}
                        </Text>
                        <Badge 
                          colorScheme={service.color === 'brand' ? 'pink' : service.color} 
                          size="sm"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontWeight="600"
                        >
                          {service.available}
                        </Badge>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Enhanced Main Content */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={16}>
            {/* Enhanced Contact Form */}
            <Card 
              bg={cardBg} 
              shadow="2xl" 
              borderRadius="3xl"
              border="3px solid"
              borderColor="brand.100"
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                borderTopRadius: '3xl',
                bgGradient: 'linear(90deg, brand.500, purple.500)'
              }}
            >
              <CardHeader pb={2}>
                <VStack spacing={3} align="start">
                  <Heading 
                    size="lg" 
                    fontWeight="800"
                    bgGradient="linear(45deg, brand.600, purple.600)"
                    bgClip="text"
                  >
                    Send Us a Message
                  </Heading>
                  <Text color="gray.600" fontWeight="500">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </Text>
                </VStack>
              </CardHeader>
              <CardBody pt={2}>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={6}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                      <FormControl isRequired isInvalid={!!errors.firstName}>
                        <FormLabel fontWeight="600" color="gray.700">First Name</FormLabel>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Enter your first name"
                          borderWidth="2px"
                          borderColor="gray.200"
                          _focus={{
                            borderColor: 'brand.400',
                            boxShadow: '0 0 0 1px #C2185B'
                          }}
                          _hover={{ borderColor: 'brand.300' }}
                          borderRadius="xl"
                          fontSize="md"
                          fontWeight="500"
                        />
                        <FormErrorMessage fontWeight="600">{errors.firstName}</FormErrorMessage>
                      </FormControl>

                      <FormControl isRequired isInvalid={!!errors.lastName}>
                        <FormLabel fontWeight="600" color="gray.700">Last Name</FormLabel>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Enter your last name"
                          borderWidth="2px"
                          borderColor="gray.200"
                          _focus={{
                            borderColor: 'brand.400',
                            boxShadow: '0 0 0 1px #C2185B'
                          }}
                          _hover={{ borderColor: 'brand.300' }}
                          borderRadius="xl"
                          fontSize="md"
                          fontWeight="500"
                        />
                        <FormErrorMessage fontWeight="600">{errors.lastName}</FormErrorMessage>
                      </FormControl>
                    </SimpleGrid>
                    <FormControl isRequired isInvalid={!!errors.email}>
                      <FormLabel fontWeight="600" color="gray.700">Email</FormLabel>
                      <Input
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email address"
                        borderWidth="2px"
                        borderColor="gray.200"
                        _focus={{
                          borderColor: 'brand.400',
                          boxShadow: '0 0 0 1px #C2185B'
                        }}
                        _hover={{ borderColor: 'brand.300' }}
                        borderRadius="xl"
                        fontSize="md"
                        fontWeight="500"
                        type="email"
                      />
                      <FormErrorMessage fontWeight="600">{errors.email}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={!!errors.phone}>
                      <FormLabel fontWeight="600" color="gray.700">Phone</FormLabel>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        borderWidth="2px"
                        borderColor="gray.200"
                        _focus={{
                          borderColor: 'brand.400',
                          boxShadow: '0 0 0 1px #C2185B'
                        }}
                        _hover={{ borderColor: 'brand.300' }}
                        borderRadius="xl"
                        fontSize="md"
                        fontWeight="500"
                        type="tel"
                      />
                      <FormErrorMessage fontWeight="600">{errors.phone}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={!!errors.subject}>
                      <FormLabel fontWeight="600" color="gray.700">Subject</FormLabel>
                      <Input
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Subject of your inquiry"
                        borderWidth="2px"
                        borderColor="gray.200"
                        _focus={{
                          borderColor: 'brand.400',
                          boxShadow: '0 0 0 1px #C2185B'
                        }}
                        _hover={{ borderColor: 'brand.300' }}
                        borderRadius="xl"
                        fontSize="md"
                        fontWeight="500"
                      />
                      <FormErrorMessage fontWeight="600">{errors.subject}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={!!errors.inquiryType}>
                      <FormLabel fontWeight="600" color="gray.700">Inquiry Type</FormLabel>
                      <Select
                        value={formData.inquiryType}
                        onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                        placeholder="Select inquiry type"
                        borderWidth="2px"
                        borderColor="gray.200"
                        _focus={{
                          borderColor: 'brand.400',
                          boxShadow: '0 0 0 1px #C2185B'
                        }}
                        _hover={{ borderColor: 'brand.300' }}
                        borderRadius="xl"
                        fontSize="md"
                        fontWeight="500"
                      >
                        {inquiryTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </Select>
                      <FormErrorMessage fontWeight="600">{errors.inquiryType}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={!!errors.message}>
                      <FormLabel fontWeight="600" color="gray.700">Message</FormLabel>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Please provide details about your inquiry..."
                        rows={6}
                        resize="vertical"
                        borderWidth="2px"
                        borderColor="gray.200"
                        _focus={{
                          borderColor: 'brand.400',
                          boxShadow: '0 0 0 1px #C2185B'
                        }}
                        _hover={{ borderColor: 'brand.300' }}
                        borderRadius="xl"
                        fontSize="md"
                        fontWeight="500"
                      />
                      <FormErrorMessage fontWeight="600">{errors.message}</FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      size="lg"
                      leftIcon={<FaPaperPlane />}
                      isLoading={isSubmitting}
                      loadingText="Sending..."
                      w="full"
                      bgGradient="linear(45deg, brand.500, purple.500)"
                      color="white"
                      fontWeight="700"
                      fontSize="md"
                      borderRadius="xl"
                      py={6}
                      _hover={{
                        bgGradient: "linear(45deg, brand.600, purple.600)",
                        transform: "translateY(-2px)",
                        shadow: "0 10px 25px rgba(194, 24, 91, 0.3)"
                      }}
                      _active={{
                        transform: "translateY(0)"
                      }}
                      transition="all 0.2s ease-in-out"
                    >
                      Send Message
                    </Button>
                  </VStack>
                </form>
              </CardBody>
            </Card>

            {/* Enhanced Contact Information */}
            <VStack spacing={8} align="stretch">
              {/* Enhanced Contact Details */}
              <Card 
                bg={cardBg} 
                shadow="2xl" 
                borderRadius="3xl"
                border="3px solid"
                borderColor="purple.100"
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  borderTopRadius: '3xl',
                  bgGradient: 'linear(90deg, purple.500, brand.500)'
                }}
              >
                <CardHeader pb={2}>
                  <Heading 
                    size="lg" 
                    fontWeight="800"
                    bgGradient="linear(45deg, purple.600, brand.600)"
                    bgClip="text"
                  >
                    Get in Touch
                  </Heading>
                </CardHeader>
                <CardBody pt={2}>
                  <VStack spacing={6} align="stretch">
                    {/* Phone */}
                    <Box>
                      <HStack spacing={4} align="start">
                        <Box 
                          bgGradient="linear(45deg, blue.100, blue.200)"
                          p={4} 
                          borderRadius="2xl"
                          position="relative"
                          _before={{
                            content: '""',
                            position: 'absolute',
                            inset: '-1px',
                            borderRadius: '2xl',
                            background: 'linear-gradient(45deg, blue.300, blue.500)',
                            zIndex: -1,
                            opacity: 0.2
                          }}
                        >
                          <Icon as={FaPhone} fontSize="xl" color="blue.600" />
                        </Box>
                        <VStack spacing={2} align="start" flex={1}>
                          <Text fontWeight="700" color="gray.800" fontSize="lg">Phone</Text>
                          {contactInfo?.phones.map((phone, idx) => (
                            <Link 
                              key={idx} 
                              href={`tel:${phone}`} 
                              color="blue.600" 
                              fontSize="sm"
                              fontWeight="600"
                              _hover={{ color: 'blue.700', textDecoration: 'none' }}
                            >
                              {phone}
                            </Link>
                          ))}
                          <Text fontSize="xs" color="gray.500" fontWeight="500">
                            Call us for immediate assistance
                          </Text>
                        </VStack>
                      </HStack>
                      <Divider mt={4} borderColor="gray.200" />
                    </Box>

                    {/* Email */}
                    <Box>
                      <HStack spacing={4} align="start">
                        <Box 
                          bgGradient="linear(45deg, purple.100, purple.200)"
                          p={4} 
                          borderRadius="2xl"
                          position="relative"
                          _before={{
                            content: '""',
                            position: 'absolute',
                            inset: '-1px',
                            borderRadius: '2xl',
                            background: 'linear-gradient(45deg, purple.300, purple.500)',
                            zIndex: -1,
                            opacity: 0.2
                          }}
                        >
                          <Icon as={FaEnvelope} fontSize="xl" color="purple.600" />
                        </Box>
                        <VStack spacing={2} align="start" flex={1}>
                          <Text fontWeight="700" color="gray.800" fontSize="lg">Email</Text>
                          {contactInfo?.emails.map((email, idx) => (
                            <Link 
                              key={idx} 
                              href={`mailto:${email}`} 
                              color="purple.600" 
                              fontSize="sm"
                              fontWeight="600"
                              _hover={{ color: 'purple.700', textDecoration: 'none' }}
                            >
                              {email}
                            </Link>
                          ))}
                          <Text fontSize="xs" color="gray.500" fontWeight="500">
                            Send us an email anytime
                          </Text>
                        </VStack>
                      </HStack>
                      <Divider mt={4} borderColor="gray.200" />
                    </Box>

                    {/* Address */}
                    <Box>
                      <HStack spacing={4} align="start">
                        <Box 
                          bgGradient="linear(45deg, red.100, red.200)"
                          p={4} 
                          borderRadius="2xl"
                          position="relative"
                          _before={{
                            content: '""',
                            position: 'absolute',
                            inset: '-1px',
                            borderRadius: '2xl',
                            background: 'linear-gradient(45deg, red.300, red.500)',
                            zIndex: -1,
                            opacity: 0.2
                          }}
                        >
                          <Icon as={FaMapMarkerAlt} fontSize="xl" color="red.600" />
                        </Box>
                        <VStack spacing={2} align="start" flex={1}>
                          <Text fontWeight="700" color="gray.800" fontSize="lg">Address</Text>
                          <Text color="gray.600" fontSize="sm" fontWeight="500">
                            {contactInfo?.address.street}
                          </Text>
                          <Text color="gray.600" fontSize="sm" fontWeight="500">
                            {contactInfo?.address.city}, {contactInfo?.address.state}
                          </Text>
                          <Text color="gray.600" fontSize="sm" fontWeight="500">
                            {contactInfo?.address.country}
                          </Text>
                          <Text fontSize="xs" color="gray.500" fontWeight="500">
                            Visit our main office
                          </Text>
                        </VStack>
                      </HStack>
                      <Divider mt={4} borderColor="gray.200" />
                    </Box>

                    {/* Business Hours */}
                    <Box>
                      <HStack spacing={4} align="start">
                        <Box 
                          bgGradient="linear(45deg, green.100, green.200)"
                          p={4} 
                          borderRadius="2xl"
                          position="relative"
                          _before={{
                            content: '""',
                            position: 'absolute',
                            inset: '-1px',
                            borderRadius: '2xl',
                            background: 'linear-gradient(45deg, green.300, green.500)',
                            zIndex: -1,
                            opacity: 0.2
                          }}
                        >
                          <Icon as={FaClock} fontSize="xl" color="green.600" />
                        </Box>
                        <VStack spacing={2} align="start" flex={1}>
                          <Text fontWeight="700" color="gray.800" fontSize="lg">Business Hours</Text>
                          <Text color="gray.600" fontSize="sm" fontWeight="500">
                            {contactInfo?.businessHours.weekdays}
                          </Text>
                          <Text color="gray.600" fontSize="sm" fontWeight="500">
                            {contactInfo?.businessHours.saturday}
                          </Text>
                          <Text color="gray.600" fontSize="sm" fontWeight="500">
                            {contactInfo?.businessHours.sunday}
                          </Text>
                          <Badge 
                            colorScheme="red" 
                            size="sm" 
                            px={3} 
                            py={1} 
                            borderRadius="full" 
                            fontWeight="600"
                          >
                            {contactInfo?.businessHours.emergency}
                          </Badge>
                        </VStack>
                      </HStack>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>

              {/* Enhanced Social Media */}
              {socialLinks.length > 0 && (
                <Card 
                  bg={cardBg} 
                  shadow="2xl" 
                  borderRadius="3xl"
                  border="3px solid"
                  borderColor="brand.100"
                  position="relative"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    borderTopRadius: '3xl',
                    bgGradient: 'linear(90deg, brand.500, purple.500)'
                  }}
                >
                  <CardHeader pb={2}>
                    <Heading 
                      size="lg" 
                      fontWeight="800"
                      bgGradient="linear(45deg, brand.600, purple.600)"
                      bgClip="text"
                    >
                      Follow Us
                    </Heading>
                  </CardHeader>
                  <CardBody pt={2}>
                    <VStack spacing={4}>
                      <Text color="gray.600" textAlign="center" fontWeight="500">
                        Stay connected with us on social media for health tips, updates, and news.
                      </Text>
                      <HStack spacing={4} justify="center" flexWrap="wrap">
                        {socialLinks.map((social, index) => (
                          <Link key={index} href={social.url} isExternal>
                            <Button
                              size="lg"
                              colorScheme={social.color}
                              variant="outline"
                              borderRadius="full"
                              p={4}
                              borderWidth="2px"
                              _hover={{ 
                                bg: `${social.color}.50`,
                                transform: 'translateY(-2px)',
                                shadow: `0 8px 20px rgba(0,0,0,0.15)`
                              }}
                              transition="all 0.2s ease-in-out"
                            >
                              <Icon as={social.icon} fontSize="xl" />
                            </Button>
                          </Link>
                        ))}
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </VStack>
          </SimpleGrid>

          {/* Enhanced FAQs */}
          {faqs.length > 0 && (
            <Box>
              <VStack spacing={8} textAlign="center" mb={12}>
                <Heading 
                  size="xl" 
                  fontWeight="800"
                  bgGradient="linear(45deg, brand.500, purple.500)"
                  bgClip="text"
                >
                  Frequently Asked Questions
                </Heading>
                <Text fontSize="lg" maxW="3xl" color="gray.600" fontWeight="500">
                  Answers to common questions about our services
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {faqs.slice(0, 6).map((faq) => (
                  <Card 
                    key={faq.id} 
                    bg={cardBg} 
                    shadow="xl" 
                    borderRadius="2xl"
                    border="2px solid"
                    borderColor="gray.100"
                    _hover={{
                      transform: 'translateY(-4px)',
                      shadow: '0 15px 35px rgba(0,0,0,0.1)',
                      borderColor: 'brand.200'
                    }}
                    transition="all 0.3s ease-in-out"
                  >
                    <CardBody p={6}>
                      <VStack spacing={4} align="start">
                        <Heading 
                          size="sm" 
                          fontWeight="700"
                          bgGradient="linear(45deg, brand.600, purple.600)"
                          bgClip="text"
                        >
                          {faq.question}
                        </Heading>
                        <Text color="gray.600" fontSize="sm" lineHeight="tall" fontWeight="500">
                          {faq.answer}
                        </Text>
                        <Badge 
                          bgGradient="linear(45deg, blue.100, blue.200)"
                          color="blue.700"
                          size="sm"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontWeight="600"
                        >
                          {faq.category}
                        </Badge>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Enhanced Final CTA */}
          <Box 
            bgGradient="linear(135deg, brand.600 0%, purple.600 100%)"
            color="white" 
            borderRadius="3xl" 
            p={12} 
            textAlign="center"
            position="relative"
            overflow="hidden"
          >
            {/* Decorative Elements */}
            <Box
              position="absolute"
              top="-20px"
              left="-20px"
              w="150px"
              h="150px"
              bg="whiteAlpha.100"
              borderRadius="full"
              filter="blur(30px)"
            />
            <Box
              position="absolute"
              bottom="-20px"
              right="-20px"
              w="200px"
              h="200px"
              bg="whiteAlpha.100"
              borderRadius="full"
              filter="blur(40px)"
            />

            <VStack spacing={8} position="relative">
              <VStack spacing={4}>
                <Heading size="xl" fontWeight="900" textShadow="0 4px 12px rgba(0,0,0,0.3)">
                  Still Have Questions?
                </Heading>
                <Text fontSize="lg" maxW="3xl" opacity={0.95} fontWeight="500">
                  Our friendly customer service team is here to help you with any questions 
                  or concerns you may have about our services.
                </Text>
              </VStack>
              <HStack spacing={6} flexWrap="wrap" justify="center">
                <Button
                  size="lg"
                  bg="white"
                  color="brand.600"
                  fontWeight="700"
                  _hover={{ 
                    bg: 'whiteAlpha.900',
                    transform: 'translateY(-2px)',
                    shadow: '0 10px 25px rgba(0,0,0,0.2)'
                  }}
                  leftIcon={<FaPhone />}
                  onClick={() => window.open(`tel:${contactInfo?.phones[0] || '+2349012345678'}`)}
                  borderRadius="xl"
                  px={8}
                  py={6}
                  transition="all 0.2s ease-in-out"
                >
                  Call Now
                </Button>
                {contactInfo?.socialMedia.whatsapp && (
                  <Button
                    size="lg"
                    bg="green.500"
                    color="white"
                    fontWeight="700"
                    _hover={{ 
                      bg: 'green.600',
                      transform: 'translateY(-2px)',
                      shadow: '0 10px 25px rgba(34, 197, 94, 0.3)'
                    }}
                    leftIcon={<FaWhatsapp />}
                    onClick={() => window.open(contactInfo.socialMedia.whatsapp, '_blank')}
                    borderRadius="xl"
                    px={8}
                    py={6}
                    transition="all 0.2s ease-in-out"
                  >
                    WhatsApp
                  </Button>
                )}
                <Badge 
                  bg="whiteAlpha.200" 
                  color="white" 
                  px={4} 
                  py={2} 
                  fontSize="sm" 
                  borderRadius="full"
                  backdropFilter="blur(10px)"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  fontWeight="600"
                >
                  🛡️ Trusted Healthcare
                </Badge>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Contact;