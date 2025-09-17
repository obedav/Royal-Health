import { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Icon,
} from "@chakra-ui/react";
import {
  FaChevronRight,
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaPhone,
  FaWhatsapp,
  FaCheckCircle,
  FaStethoscope,
  FaUser,
  FaCreditCard,
} from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import ServiceSelection from "../components/booking/ServiceSelection";
import AppointmentScheduling from "../components/booking/AppointmentScheduling";
import type { ScheduleData } from "../components/booking/AppointmentScheduling";
import PatientInformationForm from "../components/booking/PatientInformationForm";
import type { PatientInformation } from "../types/patient.types";
import PaymentIntegration from "../components/booking/PaymentIntegration";
import type { PaymentResult } from "../components/booking/PaymentIntegration";
import BookingConfirmation from "../components/booking/BookingConfirmation";
import type { BookingService } from "../types/booking.types";

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedService, setSelectedService] = useState<
    BookingService | undefined
  >();
  const [selectedSchedule, setSelectedSchedule] = useState<
    ScheduleData | undefined
  >();
  const [patientInfo, setPatientInfo] = useState<
    PatientInformation | undefined
  >();
  const [paymentResult, setPaymentResult] = useState<
    PaymentResult | undefined
  >();

  // Enhanced booking steps with payment removed
  const steps = [
    {
      title: "Select Service",
      description: "Choose service",
      icon: "FaStethoscope",
    },
    {
      title: "Schedule",
      description: "Pick date and time",
      icon: "FaCalendarAlt",
    },
    {
      title: "Details",
      description: "Patient information",
      icon: "FaUser",
    },
    {
      title: "Confirmation",
      description: "Booking confirmed",
      icon: "FaCheckCircle",
    },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Calculate progress percentage
  const progressPercentage = ((activeStep + 1) / steps.length) * 100;

  // Check for pre-selected service from URL on component mount
  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      // Service will be auto-selected by ServiceSelection component
      // We can add some feedback here
      console.log(`Pre-selecting service: ${serviceParam}`);
    }
  }, [searchParams]);

  const handleServiceSelect = (service: BookingService) => {
    setSelectedService(service);

    // Update URL to reflect selected service (optional)
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("service", service.id);
    navigate(`/booking?${newSearchParams.toString()}`, { replace: true });
  };

  const handleScheduleSelect = (scheduleData: ScheduleData) => {
    setSelectedSchedule(scheduleData);
  };

  const handlePatientInfoSubmit = (patientData: PatientInformation) => {
    setPatientInfo(patientData);
  };

  const handlePaymentSuccess = (payment: PaymentResult) => {
    setPaymentResult(payment);
  };

  const handlePaymentError = (error: string) => {
    // Handle payment error - you could show additional UI feedback here
    console.error("Payment error:", error);
    // The toast notification is already handled in the PaymentIntegration component
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleBackToServices = () => {
    navigate("/services");
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ServiceSelection
            onServiceSelect={handleServiceSelect}
            selectedService={selectedService}
          />
        );
      case 1:
        return selectedService ? (
          <AppointmentScheduling
            selectedService={selectedService}
            onScheduleSelect={handleScheduleSelect}
            selectedSchedule={selectedSchedule}
          />
        ) : (
          <Box textAlign="center" py={20}>
            <Alert
              status="warning"
              maxW="500px"
              mx="auto"
              borderRadius="2xl"
              border="3px solid"
              borderColor="orange.300"
              bg="orange.50"
              boxShadow="0 8px 25px rgba(249, 115, 22, 0.15)"
              p={6}
            >
              <AlertIcon boxSize="24px" />
              <Box>
                <AlertTitle fontWeight="800" fontSize="lg">
                  Service Required!
                </AlertTitle>
                <AlertDescription fontWeight="600" color="orange.700">
                  Please go back and select a service first.
                </AlertDescription>
              </Box>
            </Alert>
          </Box>
        );
      case 2:
        return selectedService && selectedSchedule ? (
          <PatientInformationForm
            selectedService={selectedService}
            selectedSchedule={selectedSchedule}
            onPatientInfoSubmit={handlePatientInfoSubmit}
            patientInfo={patientInfo}
          />
        ) : (
          <Box textAlign="center" py={20}>
            <Alert
              status="warning"
              maxW="500px"
              mx="auto"
              borderRadius="2xl"
              border="3px solid"
              borderColor="orange.300"
              bg="orange.50"
              boxShadow="0 8px 25px rgba(249, 115, 22, 0.15)"
              p={6}
            >
              <AlertIcon boxSize="24px" />
              <Box>
                <AlertTitle fontWeight="800" fontSize="lg">
                  Previous Steps Required!
                </AlertTitle>
                <AlertDescription fontWeight="600" color="orange.700">
                  Please complete service selection and appointment scheduling
                  first.
                </AlertDescription>
              </Box>
            </Alert>
          </Box>
        );
      case 3:
        return selectedService && selectedSchedule && patientInfo ? (
          <BookingConfirmation
            selectedService={selectedService}
            selectedSchedule={selectedSchedule}
            patientInfo={patientInfo}
            paymentResult={null} // No payment required
          />
        ) : (
          <Box textAlign="center" py={20}>
            <Alert
              status="warning"
              maxW="500px"
              mx="auto"
              borderRadius="2xl"
              border="3px solid"
              borderColor="orange.300"
              bg="orange.50"
              boxShadow="0 8px 25px rgba(249, 115, 22, 0.15)"
              p={6}
            >
              <AlertIcon boxSize="24px" />
              <Box>
                <AlertTitle fontWeight="800" fontSize="lg">
                  Previous Steps Required!
                </AlertTitle>
                <AlertDescription fontWeight="600" color="orange.700">
                  Please complete all previous steps to view confirmation.
                </AlertDescription>
              </Box>
            </Alert>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      minH="100vh"
      py={8}
      bgGradient="linear(135deg, brand.25 0%, purple.25 50%, gray.50 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* Enhanced Background Decorative Elements */}
      <Box
        position="absolute"
        top="5%"
        right="8%"
        w="200px"
        h="200px"
        borderRadius="full"
        bgGradient="linear(45deg, brand.200, purple.200)"
        opacity="0.4"
        filter="blur(60px)"
        animation="float 6s ease-in-out infinite"
      />
      <Box
        position="absolute"
        bottom="10%"
        left="10%"
        w="150px"
        h="150px"
        borderRadius="full"
        bgGradient="linear(45deg, purple.200, brand.200)"
        opacity="0.3"
        filter="blur(50px)"
        animation="float 8s ease-in-out infinite reverse"
      />
      <Box
        position="absolute"
        top="40%"
        left="5%"
        w="80px"
        h="80px"
        borderRadius="full"
        bg="brand.100"
        opacity="0.2"
        filter="blur(30px)"
        animation="float 10s ease-in-out infinite"
      />

      {/* CSS Animation Keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}
      </style>

      <Container maxW="7xl" position="relative" zIndex={1}>
        <VStack spacing={8} align="stretch">
          {/* Enhanced Breadcrumb */}
          <Breadcrumb
            spacing="8px"
            separator={<FaChevronRight color="#9CA3AF" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate("/")}
                color="brand.500"
                cursor="pointer"
                fontWeight="700"
                fontSize="md"
                _hover={{
                  color: "brand.600",
                  textDecoration: "none",
                  transform: "translateY(-1px)",
                }}
                transition="all 0.2s ease-in-out"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="gray.600" fontWeight="700" fontSize="md">
                Book Appointment
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Enhanced Header */}
          <VStack spacing={8} textAlign="center">
            <Heading
              size="3xl"
              color="gray.800"
              fontWeight="900"
              lineHeight="1.1"
            >
              <Text
                as="span"
                bgGradient="linear(45deg, brand.500, purple.500)"
                bgClip="text"
                sx={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                textShadow="0 4px 8px rgba(194, 24, 91, 0.1)"
              >
                Book Your Healthcare
              </Text>
              <br />
              <Text as="span" color="gray.700">
                Appointment
              </Text>
            </Heading>
            <Text
              color="gray.600"
              fontSize="xl"
              maxW="800px"
              fontWeight="600"
              lineHeight="1.6"
            >
              Follow these simple steps to schedule professional healthcare
              services in the comfort of your home.
            </Text>

            {/* Enhanced Progress Bar */}
            <Box w="full" maxW="700px">
              <VStack spacing={3}>
                <HStack justify="space-between" w="full">
                  <Text
                    fontSize="md"
                    fontWeight="800"
                    bgGradient="linear(45deg, brand.600, purple.600)"
                    bgClip="text"
                    sx={{
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Step {activeStep + 1} of {steps.length}
                  </Text>
                  <Text
                    fontSize="md"
                    fontWeight="800"
                    bgGradient="linear(45deg, brand.600, purple.600)"
                    bgClip="text"
                    sx={{
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {Math.round(progressPercentage)}% Complete
                  </Text>
                </HStack>
                <Progress
                  value={progressPercentage}
                  size="lg"
                  w="full"
                  borderRadius="full"
                  bg="gray.200"
                  border="2px solid"
                  borderColor="gray.300"
                  sx={{
                    "& > div": {
                      bgGradient: "linear(90deg, brand.500, purple.500)",
                      borderRadius: "full",
                      position: "relative",
                      _after: {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: "full",
                        background:
                          "linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
                      },
                    },
                  }}
                />
              </VStack>
            </Box>

            {/* Enhanced Pre-selection notification */}
            {searchParams.get("service") && selectedService && (
              <Alert
                status="info"
                maxW="800px"
                borderRadius="2xl"
                border="3px solid"
                borderColor="blue.300"
                bg="blue.50"
                boxShadow="0 8px 25px rgba(59, 130, 246, 0.15)"
                p={6}
              >
                <AlertIcon boxSize="24px" />
                <Box>
                  <AlertTitle fontSize="lg" fontWeight="800" color="blue.700">
                    Service Pre-selected!
                  </AlertTitle>
                  <AlertDescription
                    fontSize="md"
                    fontWeight="600"
                    color="blue.600"
                  >
                    <Text as="span" fontWeight="800" color="blue.800">
                      {selectedService.name}
                    </Text>{" "}
                    has been automatically selected. Continue to the next step or change your selection below.
                  </AlertDescription>
                </Box>
              </Alert>
            )}
          </VStack>

          {/* Straight Line Stepper */}
          <Box
            maxW="1000px"
            mx="auto"
            w="full"
            bg="white"
            p={{ base: 4, md: 6, lg: 8 }}
            borderRadius="2xl"
            border="2px solid"
            borderColor="brand.100"
            boxShadow="0 10px 30px rgba(194, 24, 91, 0.1)"
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              borderTopRadius: "2xl",
              bgGradient: "linear(90deg, brand.500, purple.500)",
            }}
          >
            <Stepper
              index={activeStep}
              orientation="horizontal"
              size="lg"
              gap="0"
              colorScheme="brand"
            >
              {steps.map((step, index) => (
                <Step key={index} style={{ flex: 1 }}>
                  <VStack spacing={3} align="center" w="full">
                    <StepIndicator
                      sx={{
                        width: { base: "45px", md: "55px" },
                        height: { base: "45px", md: "55px" },
                        fontSize: { base: "lg", md: "xl" },
                        fontWeight: "800",
                        "&[data-status=complete]": {
                          bgGradient: "linear(45deg, brand.500, purple.500)",
                          borderColor: "brand.500",
                          borderWidth: "3px",
                          color: "white",
                          boxShadow: "0 6px 20px rgba(194, 24, 91, 0.25)",
                          transform: "scale(1.02)",
                        },
                        "&[data-status=active]": {
                          bgGradient: "linear(45deg, brand.500, purple.500)",
                          borderColor: "brand.500",
                          borderWidth: "3px",
                          color: "white",
                          boxShadow: "0 8px 25px rgba(194, 24, 91, 0.3)",
                          transform: "scale(1.05)",
                          animation: "pulse 2s infinite",
                        },
                        "&[data-status=incomplete]": {
                          borderColor: "gray.300",
                          borderWidth: "2px",
                          color: "gray.500",
                          bg: "white",
                        },
                      }}
                    >
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>

                    <VStack spacing={1} align="center" textAlign="center">
                      <StepTitle
                        fontSize={{ base: "sm", md: "md", lg: "lg" }}
                        fontWeight="700"
                        color={index <= activeStep ? "brand.600" : "gray.500"}
                        lineHeight="1.1"
                        noOfLines={1}
                      >
                        {step.title}
                      </StepTitle>
                      <StepDescription
                        fontSize={{ base: "xs", md: "sm" }}
                        fontWeight="500"
                        color={index <= activeStep ? "brand.500" : "gray.400"}
                        lineHeight="1.2"
                        noOfLines={1}
                      >
                        {step.description}
                      </StepDescription>

                      {/* Current Step Indicator */}
                      {index === activeStep && (
                        <Text
                          fontSize="xs"
                          color="brand.600"
                          fontWeight="600"
                          bg="brand.50"
                          px={2}
                          py={1}
                          borderRadius="md"
                          border="1px solid"
                          borderColor="brand.200"
                          mt={1}
                        >
                          Current
                        </Text>
                      )}
                    </VStack>
                  </VStack>

                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <StepSeparator
                      sx={{
                        height: "3px",
                        position: "absolute",
                        top: { base: "22px", md: "27px" },
                        left: { base: "60px", md: "70px" },
                        right: { base: "60px", md: "70px" },
                        zIndex: 0,
                        "&[data-status=complete]": {
                          bgGradient: "linear(90deg, brand.500, purple.500)",
                          borderRadius: "full",
                          boxShadow: "0 2px 8px rgba(194, 24, 91, 0.2)",
                        },
                        "&[data-status=incomplete]": {
                          bg: "gray.200",
                          borderRadius: "full",
                        },
                      }}
                    />
                  )}
                </Step>
              ))}
            </Stepper>

            {/* Progress Summary */}
            <Box mt={6} textAlign="center">
              <Text
                fontSize="sm"
                color="gray.600"
                fontWeight="600"
                bg="gray.50"
                px={4}
                py={2}
                borderRadius="full"
                display="inline-block"
                border="1px solid"
                borderColor="gray.200"
              >
                Step {activeStep + 1} of {steps.length} -{" "}
                {Math.round(progressPercentage)}% Complete
              </Text>
            </Box>

            {/* Enhanced CSS Animations */}
            <style>
              {`
                @keyframes pulse {
                  0%, 100% {
                    box-shadow: 0 8px 25px rgba(194, 24, 91, 0.3);
                  }
                  50% {
                    box-shadow: 0 10px 30px rgba(194, 24, 91, 0.4), 0 0 0 6px rgba(194, 24, 91, 0.1);
                  }
                }
              `}
            </style>
          </Box>

          {/* Step Content */}
          <Box position="relative" zIndex={1}>
            {renderStepContent()}
          </Box>

          {/* Enhanced Navigation Buttons */}
          {activeStep !== 0 && (
            <HStack spacing={6} justify="center" pt={8} flexWrap="wrap">
              <Button
                leftIcon={<FaArrowLeft />}
                onClick={handlePrevious}
                variant="outline"
                borderColor="gray.400"
                color="gray.600"
                size="lg"
                borderRadius="2xl"
                borderWidth="3px"
                fontWeight="800"
                px={10}
                py={7}
                fontSize="md"
                _hover={{
                  bg: "gray.50",
                  borderColor: "gray.500",
                  color: "gray.700",
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                }}
                transition="all 0.3s ease-in-out"
              >
                Previous
              </Button>

              {/* Dynamic Next Button Based on Step */}
              {activeStep === 0 ? (
                <Button
                  rightIcon={<FaArrowRight />}
                  onClick={handleNext}
                  bgGradient="linear(45deg, brand.500, purple.500)"
                  color="white"
                  size="lg"
                  borderRadius="2xl"
                  fontWeight="800"
                  px={10}
                  py={7}
                  fontSize="md"
                  isDisabled={!selectedService}
                  boxShadow="0 8px 25px rgba(194, 24, 91, 0.3)"
                  _hover={{
                    bgGradient: "linear(45deg, brand.600, purple.600)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 30px rgba(194, 24, 91, 0.4)",
                  }}
                  _disabled={{
                    opacity: 0.5,
                    cursor: "not-allowed",
                    _hover: {
                      transform: "none",
                      boxShadow: "0 8px 25px rgba(194, 24, 91, 0.3)",
                    },
                  }}
                  transition="all 0.3s ease-in-out"
                >
                  Continue to Schedule
                </Button>
              ) : activeStep === 1 ? (
                <Button
                  rightIcon={<FaArrowRight />}
                  onClick={handleNext}
                  bgGradient="linear(45deg, brand.500, purple.500)"
                  color="white"
                  size="lg"
                  borderRadius="2xl"
                  fontWeight="800"
                  px={10}
                  py={7}
                  fontSize="md"
                  isDisabled={!selectedSchedule}
                  boxShadow="0 8px 25px rgba(194, 24, 91, 0.3)"
                  _hover={{
                    bgGradient: "linear(45deg, brand.600, purple.600)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 30px rgba(194, 24, 91, 0.4)",
                  }}
                  _disabled={{
                    opacity: 0.5,
                    cursor: "not-allowed",
                    _hover: {
                      transform: "none",
                      boxShadow: "0 8px 25px rgba(194, 24, 91, 0.3)",
                    },
                  }}
                  transition="all 0.3s ease-in-out"
                >
                  Continue to Patient Details
                </Button>
              ) : activeStep === 2 ? (
                <Button
                  rightIcon={<FaArrowRight />}
                  onClick={handleNext}
                  bgGradient="linear(45deg, brand.500, purple.500)"
                  color="white"
                  size="lg"
                  borderRadius="2xl"
                  fontWeight="800"
                  px={10}
                  py={7}
                  fontSize="md"
                  isDisabled={!patientInfo}
                  boxShadow="0 8px 25px rgba(194, 24, 91, 0.3)"
                  _hover={{
                    bgGradient: "linear(45deg, brand.600, purple.600)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 30px rgba(194, 24, 91, 0.4)",
                  }}
                  _disabled={{
                    opacity: 0.5,
                    cursor: "not-allowed",
                    _hover: {
                      transform: "none",
                      boxShadow: "0 8px 25px rgba(194, 24, 91, 0.3)",
                    },
                  }}
                  transition="all 0.3s ease-in-out"
                >
                  Continue to Confirmation
                </Button>
              ) : activeStep < steps.length - 1 ? (
                <Button
                  rightIcon={<FaArrowRight />}
                  onClick={handleNext}
                  bgGradient="linear(45deg, brand.500, purple.500)"
                  color="white"
                  size="lg"
                  borderRadius="2xl"
                  fontWeight="800"
                  px={10}
                  py={7}
                  fontSize="md"
                  boxShadow="0 8px 25px rgba(194, 24, 91, 0.3)"
                  _hover={{
                    bgGradient: "linear(45deg, brand.600, purple.600)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 30px rgba(194, 24, 91, 0.4)",
                  }}
                  transition="all 0.3s ease-in-out"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/")}
                  bgGradient="linear(45deg, brand.500, purple.500)"
                  color="white"
                  size="lg"
                  borderRadius="2xl"
                  fontWeight="800"
                  px={10}
                  py={7}
                  fontSize="md"
                  boxShadow="0 8px 25px rgba(194, 24, 91, 0.3)"
                  _hover={{
                    bgGradient: "linear(45deg, brand.600, purple.600)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 30px rgba(194, 24, 91, 0.4)",
                  }}
                  transition="all 0.3s ease-in-out"
                >
                  Back to Home
                </Button>
              )}
            </HStack>
          )}

          {/* Enhanced Service Selection Navigation */}
          {activeStep === 0 && (
            <VStack spacing={6} pt={6}>
              <HStack spacing={6} justify="center" flexWrap="wrap">
                <Button
                  onClick={handleBackToServices}
                  variant="ghost"
                  color="brand.600"
                  size="md"
                  fontWeight="700"
                  borderRadius="xl"
                  px={6}
                  py={4}
                  _hover={{
                    bg: "brand.50",
                    color: "brand.700",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s ease-in-out"
                >
                  ← Back to All Services
                </Button>

                {selectedService && (
                  <Button
                    rightIcon={<FaArrowRight />}
                    onClick={handleNext}
                    bgGradient="linear(45deg, brand.500, purple.500)"
                    color="white"
                    size="lg"
                    borderRadius="2xl"
                    fontWeight="800"
                    px={10}
                    py={7}
                    fontSize="md"
                    boxShadow="0 8px 25px rgba(194, 24, 91, 0.3)"
                    _hover={{
                      bgGradient: "linear(45deg, brand.600, purple.600)",
                      transform: "translateY(-3px)",
                      boxShadow: "0 12px 30px rgba(194, 24, 91, 0.4)",
                    }}
                    transition="all 0.3s ease-in-out"
                  >
                    Continue with {selectedService.name}
                  </Button>
                )}
              </HStack>

              {!selectedService && (
                <Text
                  fontSize="lg"
                  color="gray.500"
                  textAlign="center"
                  fontWeight="700"
                  bg="gray.100"
                  px={6}
                  py={3}
                  borderRadius="xl"
                >
                  Please select a service to continue
                </Text>
              )}
            </VStack>
          )}

          {/* Enhanced Help Section */}
          <Box
            bgGradient="linear(135deg, blue.50, blue.25)"
            borderRadius="3xl"
            p={10}
            textAlign="center"
            maxW="800px"
            mx="auto"
            border="3px solid"
            borderColor="blue.200"
            boxShadow="0 15px 40px rgba(59, 130, 246, 0.15)"
            position="relative"
            overflow="hidden"
          >
            {/* Decorative Elements */}
            <Box
              position="absolute"
              top="-10px"
              left="-10px"
              w="100px"
              h="100px"
              bg="blue.200"
              borderRadius="full"
              opacity="0.3"
              filter="blur(30px)"
            />
            <Box
              position="absolute"
              bottom="-15px"
              right="-15px"
              w="120px"
              h="120px"
              bg="blue.300"
              borderRadius="full"
              opacity="0.2"
              filter="blur(40px)"
            />

            <VStack spacing={6} position="relative">
              <VStack spacing={3}>
                <Heading
                  size="lg"
                  fontWeight="900"
                  bgGradient="linear(45deg, blue.700, blue.500)"
                  bgClip="text"
                  sx={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Need Help?
                </Heading>
                <Text
                  fontSize="lg"
                  color="blue.700"
                  fontWeight="600"
                  maxW="600px"
                >
                  Our customer support team is available 24/7 to assist you with
                  your booking.
                </Text>
              </VStack>

              <HStack spacing={6} justify="center" flexWrap="wrap">
                <Button
                  size="lg"
                  colorScheme="blue"
                  variant="outline"
                  borderWidth="3px"
                  borderRadius="2xl"
                  fontWeight="800"
                  px={8}
                  py={6}
                  fontSize="md"
                  leftIcon={<FaPhone />}
                  boxShadow="0 6px 20px rgba(59, 130, 246, 0.2)"
                  _hover={{
                    bg: "blue.50",
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                  }}
                  transition="all 0.3s ease-in-out"
                >
                  Call +234 706 332 5184
                </Button>
                <Button
                  size="lg"
                  bg="#25D366"
                  color="white"
                  borderWidth="3px"
                  borderColor="#25D366"
                  borderRadius="2xl"
                  fontWeight="800"
                  px={8}
                  py={6}
                  fontSize="md"
                  leftIcon={<FaWhatsapp />}
                  boxShadow="0 6px 20px rgba(37, 211, 102, 0.3)"
                  _hover={{
                    bg: "#128C7E",
                    borderColor: "#128C7E",
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 25px rgba(18, 140, 126, 0.4)",
                  }}
                  transition="all 0.3s ease-in-out"
                >
                  WhatsApp Support
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Booking;
