import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Flex,
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { 
  FaUserMd, 
  FaHome, 
  FaClock, 
  FaShieldAlt, 
  FaPhone, 
  FaMapMarkerAlt,
  FaWhatsapp,
  FaStar
} from 'react-icons/fa'
import { MdHealthAndSafety } from 'react-icons/md'

const HeroSection: React.FC = () => {
  const navigate = useNavigate()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const features = [
    {
      icon: FaUserMd,
      title: 'Qualified Nurses',
      description: 'Licensed healthcare professionals'
    },
    {
      icon: FaHome,
      title: 'Home Care',
      description: 'Comfort of your own home'
    },
    {
      icon: FaClock,
      title: '24/7 Available',
      description: 'Round-the-clock care'
    },
    {
      icon: FaShieldAlt,
      title: 'Insured & Safe',
      description: 'Fully insured services'
    }
  ]

  const stats = [
    { number: '50+', label: 'Happy Patients' },
    { number: '50+', label: 'Qualified Nurses' },
    { number: '99%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Availability' }
  ]

  return (
    <Box bg="gray.50" minH="90vh" pt={8}>
      <Container maxW="7xl">
        {/* Main Hero Content */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center" minH="80vh">
          {/* Left Side - Content */}
          <VStack align="start" spacing={8} className="fade-in">
            {/* Trust Badge */}
            <HStack>
              <Badge 
                colorScheme="primary" 
                variant="subtle" 
                px={3} 
                py={1} 
                borderRadius="full"
                fontSize="sm"
              >
                <HStack spacing={1}>
                  <Icon as={FaStar} />
                  <Text>Trusted by 500+ Nigerian Families</Text>
                </HStack>
              </Badge>
            </HStack>

            {/* Main Headline */}
            <VStack align="start" spacing={4}>
              <Heading
                size={{ base: 'xl', md: '2xl' }}
                lineHeight="1.2"
                color="gray.800"
              >
                Professional{' '}
                <Text
                  as="span"
                  bgGradient="linear(45deg, primary.500, secondary.500)"
                  bgClip="text"
                  color="transparent"
                >
                  Healthcare
                </Text>
                <br />
                at Your Doorstep
              </Heading>

              <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.600" maxW="500px">
                Book qualified nurses and healthcare professionals for home care services across Nigeria. 
                Safe, reliable, and professional healthcare when you need it most.
              </Text>
            </VStack>

            {/* CTA Buttons */}
            <HStack spacing={4} flexWrap="wrap">
              <Button
                size="lg"
                variant="gradient"
                onClick={() => navigate('/booking')}
                className="hover-lift pulse-animation"
                px={8}
                py={6}
                fontSize="lg"
              >
                Book Appointment Now
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/services')}
                className="hover-lift"
                px={8}
                py={6}
                fontSize="lg"
              >
                View Services
              </Button>
            </HStack>

            {/* Contact Info */}
            <VStack align="start" spacing={2} pt={4}>
              <HStack spacing={4} color="gray.600">
                <HStack>
                  <Icon as={FaPhone} color="primary.500" />
                  <Text fontWeight="500">+234 801 234 5678</Text>
                </HStack>
                <HStack>
                  <Icon as={FaWhatsapp} color="green.500" />
                  <Text fontWeight="500">WhatsApp Available</Text>
                </HStack>
              </HStack>
              <HStack>
                <Icon as={FaMapMarkerAlt} color="primary.500" />
                <Text color="gray.600">Serving Lagos, Abuja, Port Harcourt & Major Cities</Text>
              </HStack>
            </VStack>
          </VStack>

          {/* Right Side - Visual */}
          <Flex justify="center" align="center" className="slide-in-right">
            <Box
              position="relative"
              bg="white"
              borderRadius="2xl"
              p={8}
              boxShadow="2xl"
              border="1px"
              borderColor="primary.100"
              maxW="400px"
              w="full"
            >
              {/* Medical Professional Illustration */}
              <VStack spacing={6}>
                <Box
                  w="120px"
                  h="120px"
                  bg="linear-gradient(45deg, var(--chakra-colors-primary-500), var(--chakra-colors-secondary-500))"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="lg"
                >
                  <Icon as={MdHealthAndSafety} color="white" fontSize="4xl" />
                </Box>

                <VStack spacing={3} textAlign="center">
                  <Heading size="md" color="gray.800">
                    Professional Care Team
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    Licensed nurses and healthcare professionals ready to serve you 24/7
                  </Text>
                </VStack>

                {/* Quick Stats */}
                <SimpleGrid columns={2} spacing={4} w="full">
                  {stats.map((stat, index) => (
                    <VStack key={index} spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                        {stat.number}
                      </Text>
                      <Text fontSize="xs" color="gray.600" textAlign="center">
                        {stat.label}
                      </Text>
                    </VStack>
                  ))}
                </SimpleGrid>
              </VStack>

              {/* Decorative Elements */}
              <Box
                position="absolute"
                top="-10px"
                right="-10px"
                w="20px"
                h="20px"
                bg="secondary.500"
                borderRadius="full"
                opacity="0.6"
              />
              <Box
                position="absolute"
                bottom="-10px"
                left="-10px"
                w="30px"
                h="30px"
                bg="primary.500"
                borderRadius="full"
                opacity="0.4"
              />
            </Box>
          </Flex>
        </SimpleGrid>

        {/* Features Section */}
        <Box pb={16} pt={8}>
          <VStack spacing={8} className="fade-in">
            <Heading size="lg" textAlign="center" color="gray.800">
              Why Choose Royal Health Consult?
            </Heading>
            
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={8} w="full">
              {features.map((feature, index) => (
                <VStack
                  key={index}
                  spacing={4}
                  p={6}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="sm"
                  border="1px"
                  borderColor="gray.200"
                  className="card-hover"
                  textAlign="center"
                >
                  <Box
                    w="16"
                    h="16"
                    bg="primary.50"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={feature.icon} color="primary.500" fontSize="2xl" />
                  </Box>
                  <VStack spacing={2}>
                    <Heading size="sm" color="gray.800">
                      {feature.title}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      {feature.description}
                    </Text>
                  </VStack>
                </VStack>
              ))}
            </SimpleGrid>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}

export default HeroSection