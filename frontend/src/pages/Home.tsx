import React from "react";
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaHome,
  FaClock,
  FaShieldAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaStar,
} from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const features = [
    {
      icon: FaUserMd,
      title: "Qualified Professionals",
      description: "Licensed healthcare professionals",
    },
    {
      icon: FaHome,
      title: "Home Care",
      description: "Comfort of your own home",
    },
    {
      icon: FaClock,
      title: "24/7 Available",
      description: "Round-the-clock care",
    },
    {
      icon: FaShieldAlt,
      title: "Insured & Safe",
      description: "Fully insured services",
    },
  ];

  const stats = [
    { number: "200+", label: "Happy Patients" },
    { number: "50+", label: "Healthcare Professionals" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Availability" },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      position="relative"
    >
      {/* Background Video - Fixed Position */}
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100vh"
        zIndex="0"
        overflow="hidden"
        bg="gray.900"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          onError={(e) => console.log("Video error:", e)}
          onLoadStart={() => console.log("Video loading started")}
          onCanPlay={() => console.log("Video can play")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <source src="/videos/healthcare-bg.mp4" type="video/mp4" />
          <source src="/videos/bg_img1%20(1).mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark overlay for better text readability */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.4)"
          zIndex="1"
        />
      </Box>

      {/* Main Content - Normal Document Flow */}
      <Box
        position="relative"
        zIndex="10"
        flex="1"
        display="flex"
        flexDirection="column"
      >
        {/* Hero Section */}
        <Container maxW="7xl" py={8} flex="1">
          <Box
            bg="rgba(255, 255, 255, 0.0)"
            backdropFilter="blur(5px)"
            borderRadius="2xl"
            p={6}
            mb={8}
          >
            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              spacing={12}
              alignItems="center"
              minH={{ base: "auto", md: "80vh" }}
            >
              {/* Left Side - Content */}
              <VStack align="start" spacing={8} className="fade-in">
                {/* Trust Badge - Enhanced */}
                <HStack>
                  <Badge
                    bgGradient="linear(45deg, brand.500, purple.500)"
                    color="white"
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="600"
                    boxShadow="md"
                  >
                    <HStack spacing={2}>
                      <Icon as={FaStar} />
                      <Text>Trusted by 200+ Nigerian Families</Text>
                    </HStack>
                  </Badge>
                </HStack>

                {/* Main Headline */}
                <VStack align="start" spacing={4}>
                  <Heading
                    size={{ base: "xl", md: "2xl" }}
                    lineHeight="1.2"
                    color="white"
                    fontWeight="800"
                    textShadow="2px 2px 4px rgba(0,0,0,0.3)"
                  >
                    Professional{" "}
                    <Text
                      as="span"
                      bgGradient="linear(45deg, brand.500, purple.500)"
                      bgClip="text"
                      fontWeight="900"
                      sx={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Healthcare
                    </Text>
                    <br />
                    at Your Doorstep
                  </Heading>

                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    color="white"
                    maxW="500px"
                    fontWeight="500"
                    textShadow="1px 1px 2px rgba(0,0,0,0.3)"
                  >
                    Book qualified healthcare professionals for home care
                    services across Nigeria. Safe, reliable, and professional
                    healthcare when you need it most.
                  </Text>
                </VStack>

                {/* CTA Buttons - Enhanced */}
                <HStack spacing={4} flexWrap="wrap">
                  <Button
                    size="lg"
                    bgGradient="linear(45deg, brand.500, purple.500)"
                    color="white"
                    onClick={() => navigate("/booking")}
                    className="hover-lift pulse-animation"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="700"
                    borderRadius="xl"
                    _hover={{
                      bgGradient: "linear(45deg, brand.600, purple.600)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px 0 rgba(194, 24, 91, 0.3)",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    Book Appointment Now
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    borderColor="brand.500"
                    color="brand.500"
                    bg="rgba(255, 255, 255, 0.9)"
                    onClick={() => navigate("/services")}
                    className="hover-lift"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="600"
                    borderRadius="xl"
                    borderWidth="2px"
                    _hover={{
                      bg: "rgba(255, 255, 255, 1)",
                      borderColor: "brand.600",
                      color: "brand.600",
                      transform: "translateY(-2px)",
                      boxShadow: "md",
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    View Services
                  </Button>
                </HStack>

                {/* Contact Info - Enhanced */}
                <VStack align="start" spacing={3} pt={4}>
                  <HStack spacing={6} color="white">
                    <HStack>
                      <Icon as={FaPhone} color="brand.300" fontSize="lg" />
                      <Text
                        fontWeight="600"
                        textShadow="1px 1px 2px rgba(0,0,0,0.3)"
                      >
                        +234 706 332 5184
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaWhatsapp} color="green.300" fontSize="lg" />
                      <Text
                        fontWeight="600"
                        textShadow="1px 1px 2px rgba(0,0,0,0.3)"
                      >
                        WhatsApp Available
                      </Text>
                    </HStack>
                  </HStack>
                  <HStack>
                    <Icon as={FaMapMarkerAlt} color="brand.300" fontSize="lg" />
                    <Text
                      color="white"
                      fontWeight="500"
                      textShadow="1px 1px 2px rgba(0,0,0,0.3)"
                    >
                      Serving Lagos, Abuja, Port Harcourt & Major Cities
                    </Text>
                  </HStack>
                </VStack>
              </VStack>

              {/* Right Side - Visual - Enhanced */}
              <Flex justify="center" align="center" className="slide-in-right">
                <Box
                  position="relative"
                  bg="rgba(255, 255, 255, 0.95)"
                  backdropFilter="blur(10px)"
                  borderRadius="3xl"
                  p={8}
                  boxShadow="2xl"
                  border="2px"
                  borderColor="brand.100"
                  maxW="400px"
                  w="full"
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "0 20px 40px 0 rgba(194, 24, 91, 0.15)",
                  }}
                  transition="all 0.3s ease-in-out"
                >
                  {/* Medical Professional Illustration - Enhanced */}
                  <VStack spacing={6}>
                    <Box
                      w="120px"
                      h="120px"
                      bgGradient="linear(45deg, brand.500, purple.500)"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="xl"
                      position="relative"
                      _before={{
                        content: '""',
                        position: "absolute",
                        top: "-4px",
                        left: "-4px",
                        right: "-4px",
                        bottom: "-4px",
                        bgGradient: "linear(45deg, brand.400, purple.400)",
                        borderRadius: "full",
                        zIndex: -1,
                        opacity: 0.3,
                      }}
                    >
                      <Icon
                        as={MdHealthAndSafety}
                        color="white"
                        fontSize="4xl"
                      />
                    </Box>

                    <VStack spacing={3} textAlign="center">
                      <Heading size="md" color="gray.800" fontWeight="700">
                        Professional Care Team
                      </Heading>
                      <Text color="gray.600" fontSize="sm">
                        Licensed healthcare professionals ready to serve you
                        24/7
                      </Text>
                    </VStack>

                    {/* Quick Stats - Enhanced */}
                    <SimpleGrid columns={2} spacing={4} w="full">
                      {stats.map((stat, index) => (
                        <VStack key={index} spacing={1}>
                          <Text
                            fontSize="2xl"
                            fontWeight="900"
                            bgGradient="linear(45deg, brand.500, purple.500)"
                            bgClip="text"
                            sx={{
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {stat.number}
                          </Text>
                          <Text
                            fontSize="xs"
                            color="gray.600"
                            textAlign="center"
                            fontWeight="500"
                          >
                            {stat.label}
                          </Text>
                        </VStack>
                      ))}
                    </SimpleGrid>
                  </VStack>

                  {/* Decorative Elements - Enhanced */}
                  <Box
                    position="absolute"
                    top="-10px"
                    right="-10px"
                    w="20px"
                    h="20px"
                    bg="purple.500"
                    borderRadius="full"
                    opacity="0.8"
                    boxShadow="lg"
                  />
                  <Box
                    position="absolute"
                    bottom="-10px"
                    left="-10px"
                    w="30px"
                    h="30px"
                    bg="brand.500"
                    borderRadius="full"
                    opacity="0.6"
                    boxShadow="lg"
                  />
                  <Box
                    position="absolute"
                    top="20%"
                    left="-15px"
                    w="10px"
                    h="10px"
                    bg="purple.400"
                    borderRadius="full"
                    opacity="0.7"
                  />
                </Box>
              </Flex>
            </SimpleGrid>

            {/* Features Section - Enhanced with semi-transparent background */}
            <Box
              pb={16}
              pt={8}
              bg="rgba(248, 250, 252, 0.95)"
              backdropFilter="blur(10px)"
              borderRadius="3xl"
              mt={8}
            >
              <VStack spacing={8} className="fade-in">
                <Heading
                  size="lg"
                  textAlign="center"
                  color="gray.800"
                  fontWeight="700"
                >
                  Why Choose Royal Health Consult?
                </Heading>

                <SimpleGrid
                  columns={{ base: 1, sm: 2, lg: 4 }}
                  spacing={8}
                  w="full"
                  px={4}
                >
                  {features.map((feature, index) => (
                    <VStack
                      key={index}
                      spacing={4}
                      p={6}
                      bg="rgba(255, 255, 255, 0.95)"
                      backdropFilter="blur(10px)"
                      borderRadius="2xl"
                      boxShadow="sm"
                      border="1px"
                      borderColor="gray.200"
                      className="card-hover"
                      textAlign="center"
                      _hover={{
                        transform: "translateY(-4px)",
                        boxShadow: "0 10px 25px 0 rgba(194, 24, 91, 0.15)",
                        borderColor: "brand.200",
                      }}
                      transition="all 0.3s ease-in-out"
                    >
                      <Box
                        w="16"
                        h="16"
                        bg="brand.50"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon
                          as={feature.icon}
                          color="brand.500"
                          fontSize="2xl"
                        />
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
          </Box>
        </Container>

        {/* Footer - Now positioned at the bottom with margin-top: auto */}
      </Box>
    </Box>
  );
};

export default Home;
