// src/components/booking/PatientInformationForm.tsx
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
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Textarea,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Stack,
  Button,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  useColorModeValue,
  FormHelperText,
} from "@chakra-ui/react";
import {
  FaUser,
  FaHeart,
  FaPhone,
  FaIdCard,
  FaCheckCircle,
  FaInfoCircle,
  FaStethoscope,
} from "react-icons/fa";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { BookingService } from "../../types/booking.types";
import { ScheduleData } from "./AppointmentScheduling";
import { ASSESSMENT_PRICE } from "../../constants/assessments";
import type { PatientInformation } from "../../types/patient.types";
import {
  validatePatientForm,
  isFormValid as validateForm,
  calculateAge,
  formatPhoneNumber,
  sanitizeFormData
} from "../../utils/patientFormValidation";
import { useBookingContext } from "../../context/BookingContext";
import PhoneNumberInput from "../common/PhoneNumberInput";

interface PatientFormProps {
  selectedService: BookingService;
  selectedSchedule: ScheduleData;
  onPatientInfoSubmit: (patientData: PatientInformation) => void;
  patientInfo?: PatientInformation;
}

const PatientInformationForm: React.FC<PatientFormProps> = ({
  selectedService,
  selectedSchedule,
  onPatientInfoSubmit,
  patientInfo,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [searchParams] = useSearchParams();
  const { consultationData, convertConsultationToPatientInfo } = useBookingContext();
  const [isPreFilled, setIsPreFilled] = useState(false);

  // Form state
  const [formData, setFormData] = useState<PatientInformation>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "prefer_not_to_say",
    nationalId: "",
    medicalHistory: {
      conditions: [],
      currentMedications: [],
      allergies: [],
      previousSurgeries: [],
      hospitalizations: [],
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      address: "",
    },
    insuranceProvider: "",
    insuranceNumber: "",
    preferredLanguage: "English",
    specialNeeds: "",
    consentToTreatment: false,
    consentToDataProcessing: false,
    consentToSMSUpdates: false,
    serviceSpecificInfo: {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-populate if patient info exists or coming from consultation
  useEffect(() => {
    const fromConsultation = searchParams.get('from') === 'consultation';

    if (fromConsultation && consultationData && !isPreFilled) {
      // Convert consultation data to patient information format
      const convertedData = convertConsultationToPatientInfo(consultationData);

      // Create patient info with proper structure
      const preFilledData: PatientInformation = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "prefer_not_to_say",
        nationalId: "",
        medicalHistory: {
          conditions: [],
          currentMedications: [],
          allergies: [],
          previousSurgeries: [],
          hospitalizations: [],
        },
        emergencyContact: {
          name: "",
          relationship: "",
          phone: "",
          address: "",
        },
        insuranceProvider: "",
        insuranceNumber: "",
        preferredLanguage: "English",
        specialNeeds: "",
        consentToTreatment: false,
        consentToDataProcessing: false,
        consentToSMSUpdates: false,
        serviceSpecificInfo: {},
        ...convertedData,
      };

      setFormData(preFilledData);
      setIsPreFilled(true);
    } else if (patientInfo && !isPreFilled) {
      setFormData(patientInfo);
    }
  }, [patientInfo, consultationData, searchParams, convertConsultationToPatientInfo, isPreFilled]);

  // Common medical conditions for quick selection
  const commonConditions = [
    "Hypertension (High Blood Pressure)",
    "Diabetes Type 1",
    "Diabetes Type 2",
    "Heart Disease",
    "Asthma",
    "Arthritis",
    "High Cholesterol",
    "Kidney Disease",
    "Liver Disease",
    "Mental Health Conditions",
    "Cancer",
    "Stroke",
    "Epilepsy",
    "Thyroid Disorders",
  ];

  const commonAllergies = [
    "Penicillin",
    "Aspirin",
    "Ibuprofen",
    "Codeine",
    "Latex",
    "Shellfish",
    "Nuts",
    "Eggs",
    "Dairy",
    "Dust",
    "Pollen",
    "Pet Dander",
  ];

  const relationshipOptions = [
    "Spouse/Partner",
    "Parent",
    "Child",
    "Sibling",
    "Relative",
    "Friend",
    "Guardian",
    "Neighbor",
  ];

  const nigerianLanguages = [
    "English",
    "Hausa",
    "Yoruba",
    "Igbo",
    "Pidgin English",
    "Fulfulde",
    "Kanuri",
    "Tiv",
    "Edo",
    "Efik",
  ];

  const insuranceProviders = [
    "NHIS (National Health Insurance Scheme)",
    "AIICO Insurance",
    "AXA Mansard",
    "Leadway Health",
    "Hygeia HMO",
    "Total Health Trust",
    "Reliance HMO",
    "Clearline HMO",
    "Other",
    "No Insurance",
  ];

  // Use the imported validation functions
  const { isFormValid, validationErrors } = useMemo(() => {
    const validationResult = validatePatientForm(formData);
    const isValid = validateForm(formData);

    return { 
      isFormValid: isValid, 
      validationErrors: validationResult 
    };
  }, [formData]);

  // Update errors when validation changes
  useEffect(() => {
    setErrors(validationErrors);
  }, [validationErrors]);

  // Auto-submit when form becomes valid
  useEffect(() => {
    if (isFormValid) {
      const sanitizedData = sanitizeFormData(formData);
      onPatientInfoSubmit(sanitizedData);
    }
  }, [isFormValid, formData, onPatientInfoSubmit]);

  // Update form data
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedFormData = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof PatientInformation],
        [field]: value,
      },
    }));
  };

  const updateMedicalHistory = (field: string, values: string[]) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: values,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (isFormValid) {
      // Sanitize form data before submission
      const sanitizedData = sanitizeFormData(formData);
      onPatientInfoSubmit(sanitizedData);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Use the imported calculateAge function
  const age = formData.dateOfBirth ? calculateAge(formData.dateOfBirth) : null;

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Pre-fill Notification */}
        {isPreFilled && (
          <Alert
            status="success"
            maxW="800px"
            mx="auto"
            borderRadius="2xl"
            border="3px solid"
            borderColor="green.300"
            bg="green.50"
            boxShadow="0 8px 25px rgba(34, 197, 94, 0.15)"
            p={6}
            mb={8}
          >
            <AlertIcon boxSize="24px" />
            <Box>
              <AlertTitle fontSize="lg" fontWeight="800" color="green.700">
                Information Pre-filled!
              </AlertTitle>
              <AlertDescription
                fontSize="md"
                fontWeight="600"
                color="green.600"
              >
                Your basic information has been automatically filled from your consultation request. Please review and complete any missing details.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Header */}
        <Box
          position="relative"
          bg="rgba(255, 255, 255, 0.9)"
          backdropFilter="blur(20px)"
          borderRadius="3xl"
          p={8}
          border="1px solid"
          borderColor="rgba(194, 24, 91, 0.2)"
          boxShadow="0 8px 32px rgba(194, 24, 91, 0.15)"
          _before={{
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "3xl",
            padding: "1px",
            background: "linear-gradient(135deg, rgba(194, 24, 91, 0.3), rgba(123, 31, 162, 0.3))",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
          }}
        >
          <VStack spacing={6} textAlign="center">
            <VStack spacing={3}>
              <Heading 
                size="xl" 
                bgGradient="linear(45deg, brand.600, purple.600)"
                bgClip="text"
                sx={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 4px rgba(194, 24, 91, 0.2))",
                }}
                fontWeight="800"
              >
                Patient Information
              </Heading>
              <Text 
                color="gray.700"
                fontSize="lg"
                fontWeight="500"
                maxW="600px"
                lineHeight="1.6"
              >
                Please provide your information to help us deliver the best care possible with our qualified healthcare professionals
              </Text>
            </VStack>

            {/* Enhanced Assessment Summary */}
            <Box 
              bg="rgba(194, 24, 91, 0.05)" 
              borderRadius="2xl" 
              p={6} 
              w="full" 
              maxW="700px"
              border="2px solid"
              borderColor="rgba(194, 24, 91, 0.1)"
              boxShadow="0 4px 20px rgba(194, 24, 91, 0.08)"
            >
              <HStack spacing={6} align="start">
                <Box
                  w="60px"
                  h="60px"
                  bgGradient="linear(45deg, brand.500, purple.500)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 4px 15px rgba(194, 24, 91, 0.3)"
                >
                  <Icon as={FaStethoscope} color="white" fontSize="2xl" />
                </Box>
                <VStack align="start" spacing={3} flex="1">
                  <Text 
                    fontWeight="700" 
                    color="gray.800"
                    fontSize="lg"
                  >
                    {selectedService.name}
                  </Text>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="gray.600">
                      Healthcare professional will be assigned based on your location
                    </Text>
                    <Text fontSize="sm" color="gray.600" fontWeight="500">
                      {new Date(selectedSchedule.date).toLocaleDateString("en-NG", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      at {selectedSchedule.timeSlot.time}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {selectedSchedule.address.street},{" "}
                      {selectedSchedule.address.state}
                    </Text>
                  </VStack>
                  <Badge 
                    bg="green.500"
                    color="white"
                    fontSize="md" 
                    px={4} 
                    py={1}
                    borderRadius="full"
                    fontWeight="600"
                  >
                    {formatPrice(ASSESSMENT_PRICE)}
                  </Badge>
                </VStack>
              </HStack>
            </Box>
          </VStack>
        </Box>

        {/* Personal Information */}
        <Card 
          bg="rgba(255, 255, 255, 0.85)"
          backdropFilter="blur(15px)"
          borderColor="rgba(194, 24, 91, 0.2)"
          borderWidth="2px"
          borderRadius="2xl"
          boxShadow="0 4px 20px rgba(194, 24, 91, 0.08)"
        >
          <CardBody p={8}>
            <VStack spacing={8} align="start">
              <HStack spacing={4}>
                <Box
                  w="40px"
                  h="40px"
                  bgGradient="linear(45deg, brand.500, purple.500)"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 4px 15px rgba(194, 24, 91, 0.3)"
                >
                  <Icon as={FaUser} color="white" fontSize="lg" />
                </Box>
                <Heading 
                  size="md"
                  bgGradient="linear(45deg, brand.600, purple.600)"
                  bgClip="text"
                  sx={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  fontWeight="700"
                >
                  Personal Information
                </Heading>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                <FormControl isRequired isInvalid={!!errors.firstName}>
                  <FormLabel>First Name {isPreFilled && formData.firstName && <Text as="span" fontSize="sm" color="green.600" fontWeight="500">(auto-filled)</Text>}</FormLabel>
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      updateFormData("firstName", e.target.value)
                    }
                    placeholder="Enter your first name"
                    bg={isPreFilled && formData.firstName ? "green.50" : "white"}
                    borderColor={isPreFilled && formData.firstName ? "green.200" : "gray.200"}
                  />
                  <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.lastName}>
                  <FormLabel>Last Name {isPreFilled && formData.lastName && <Text as="span" fontSize="sm" color="green.600" fontWeight="500">(auto-filled)</Text>}</FormLabel>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    placeholder="Enter your last name"
                    bg={isPreFilled && formData.lastName ? "green.50" : "white"}
                    borderColor={isPreFilled && formData.lastName ? "green.200" : "gray.200"}
                  />
                  <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.email}>
                  <FormLabel>Email Address {isPreFilled && formData.email && <Text as="span" fontSize="sm" color="green.600" fontWeight="500">(auto-filled)</Text>}</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="your.email@example.com"
                    bg={isPreFilled && formData.email ? "green.50" : "white"}
                    borderColor={isPreFilled && formData.email ? "green.200" : "gray.200"}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <PhoneNumberInput
                  label={
                    <>
                      Phone Number {isPreFilled && formData.phone && <Text as="span" fontSize="sm" color="green.600" fontWeight="500">(auto-filled)</Text>}
                    </>
                  }
                  value={formData.phone}
                  onChange={(value) => updateFormData("phone", value)}
                  placeholder="801 234 5678"
                  isRequired={true}
                  isInvalid={!!errors.phone}
                  errorMessage={errors.phone}
                  bg={isPreFilled && formData.phone ? "green.50" : "white"}
                  borderColor={isPreFilled && formData.phone ? "green.200" : "gray.200"}
                />

                <FormControl isRequired isInvalid={!!errors.dateOfBirth}>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      updateFormData("dateOfBirth", e.target.value)
                    }
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {age && <FormHelperText>Age: {age} years old</FormHelperText>}
                  <FormErrorMessage>{errors.dateOfBirth}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <RadioGroup
                    value={formData.gender}
                    onChange={(value) => updateFormData("gender", value)}
                  >
                    <Stack direction="row" spacing={4}>
                      <Radio value="male">Male</Radio>
                      <Radio value="female">Female</Radio>
                      <Radio value="prefer_not_to_say">Prefer not to say</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>National ID / BVN (Optional)</FormLabel>
                  <Input
                    value={formData.nationalId}
                    onChange={(e) =>
                      updateFormData("nationalId", e.target.value)
                    }
                    placeholder="22123456789"
                  />
                  <FormHelperText>
                    For identity verification purposes
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>Preferred Language</FormLabel>
                  <Select
                    value={formData.preferredLanguage}
                    onChange={(e) =>
                      updateFormData("preferredLanguage", e.target.value)
                    }
                  >
                    {nigerianLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Medical History */}
        <Card 
          bg="rgba(255, 255, 255, 0.85)"
          backdropFilter="blur(15px)"
          borderColor="rgba(220, 38, 127, 0.2)"
          borderWidth="2px"
          borderRadius="2xl"
          boxShadow="0 4px 20px rgba(220, 38, 127, 0.08)"
        >
          <CardBody p={8}>
            <VStack spacing={8} align="start">
              <HStack spacing={4}>
                <Box
                  w="40px"
                  h="40px"
                  bgGradient="linear(45deg, red.500, pink.500)"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 4px 15px rgba(220, 38, 127, 0.3)"
                >
                  <Icon as={FaHeart} color="white" fontSize="lg" />
                </Box>
                <Heading 
                  size="md"
                  bgGradient="linear(45deg, red.600, pink.600)"
                  bgClip="text"
                  sx={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  fontWeight="700"
                >
                  Medical History
                </Heading>
              </HStack>

              <Alert status="info">
                <AlertIcon />
                <Box>
                  <AlertTitle>Important!</AlertTitle>
                  <AlertDescription fontSize="sm">
                    Please provide accurate medical information to ensure safe
                    and effective care. All information is kept confidential.
                  </AlertDescription>
                </Box>
              </Alert>

              <VStack spacing={4} w="full" align="start">
                <FormControl>
                  <FormLabel>Current Medical Conditions</FormLabel>
                  <CheckboxGroup
                    value={formData.medicalHistory.conditions}
                    onChange={(values) =>
                      updateMedicalHistory("conditions", values as string[])
                    }
                  >
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                      {commonConditions.map((condition) => (
                        <Checkbox key={condition} value={condition} size="sm">
                          {condition}
                        </Checkbox>
                      ))}
                    </SimpleGrid>
                  </CheckboxGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Current Medications</FormLabel>
                  <Textarea
                    value={formData.medicalHistory.currentMedications.join(
                      ", "
                    )}
                    onChange={(e) =>
                      updateMedicalHistory(
                        "currentMedications",
                        e.target.value
                          .split(",")
                          .map((med) => med.trim())
                          .filter((med) => med)
                      )
                    }
                    placeholder="List all medications you're currently taking (e.g., Lisinopril 10mg daily, Metformin 500mg twice daily)"
                    rows={3}
                  />
                  <FormHelperText>
                    Include dosage and frequency if known
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>Allergies</FormLabel>
                  <CheckboxGroup
                    value={formData.medicalHistory.allergies}
                    onChange={(values) =>
                      updateMedicalHistory("allergies", values as string[])
                    }
                  >
                    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
                      {commonAllergies.map((allergy) => (
                        <Checkbox key={allergy} value={allergy} size="sm">
                          {allergy}
                        </Checkbox>
                      ))}
                    </SimpleGrid>
                  </CheckboxGroup>
                  <Textarea
                    mt={3}
                    value={formData.medicalHistory.allergies
                      .filter((allergy) => !commonAllergies.includes(allergy))
                      .join(", ")}
                    onChange={(e) => {
                      const customAllergies = e.target.value
                        .split(",")
                        .map((a) => a.trim())
                        .filter((a) => a);
                      const selectedCommonAllergies =
                        formData.medicalHistory.allergies.filter((allergy) =>
                          commonAllergies.includes(allergy)
                        );
                      updateMedicalHistory("allergies", [
                        ...selectedCommonAllergies,
                        ...customAllergies,
                      ]);
                    }}
                    placeholder="Other allergies not listed above"
                    rows={2}
                  />
                </FormControl>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Emergency Contact */}
        <Card 
          bg="rgba(255, 255, 255, 0.85)"
          backdropFilter="blur(15px)"
          borderColor="rgba(251, 146, 60, 0.2)"
          borderWidth="2px"
          borderRadius="2xl"
          boxShadow="0 4px 20px rgba(251, 146, 60, 0.08)"
        >
          <CardBody p={8}>
            <VStack spacing={8} align="start">
              <HStack spacing={4}>
                <Box
                  w="40px"
                  h="40px"
                  bgGradient="linear(45deg, orange.500, yellow.500)"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 4px 15px rgba(251, 146, 60, 0.3)"
                >
                  <Icon as={FaPhone} color="white" fontSize="lg" />
                </Box>
                <Heading 
                  size="md"
                  bgGradient="linear(45deg, orange.600, yellow.600)"
                  bgClip="text"
                  sx={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  fontWeight="700"
                >
                  Emergency Contact
                </Heading>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                <FormControl
                  isRequired
                  isInvalid={!!errors.emergencyContactName}
                >
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={formData.emergencyContact.name}
                    onChange={(e) =>
                      updateNestedFormData(
                        "emergencyContact",
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Emergency contact full name"
                  />
                  <FormErrorMessage>
                    {errors.emergencyContactName}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isRequired
                  isInvalid={!!errors.emergencyContactRelationship}
                >
                  <FormLabel>Relationship</FormLabel>
                  <Select
                    value={formData.emergencyContact.relationship}
                    onChange={(e) =>
                      updateNestedFormData(
                        "emergencyContact",
                        "relationship",
                        e.target.value
                      )
                    }
                    placeholder="Select relationship"
                  >
                    {relationshipOptions.map((relationship) => (
                      <option key={relationship} value={relationship}>
                        {relationship}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>
                    {errors.emergencyContactRelationship}
                  </FormErrorMessage>
                </FormControl>

                <PhoneNumberInput
                  label="Phone Number"
                  value={formData.emergencyContact.phone}
                  onChange={(value) =>
                    updateNestedFormData(
                      "emergencyContact",
                      "phone",
                      value
                    )
                  }
                  placeholder="801 234 5678"
                  isRequired={true}
                  isInvalid={!!errors.emergencyContactPhone}
                  errorMessage={errors.emergencyContactPhone}
                />

                <FormControl>
                  <FormLabel>Address (Optional)</FormLabel>
                  <Input
                    value={formData.emergencyContact.address}
                    onChange={(e) =>
                      updateNestedFormData(
                        "emergencyContact",
                        "address",
                        e.target.value
                      )
                    }
                    placeholder="Emergency contact address"
                  />
                </FormControl>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Insurance Information */}
        <Card 
          bg="rgba(255, 255, 255, 0.85)"
          backdropFilter="blur(15px)"
          borderColor="rgba(59, 130, 246, 0.2)"
          borderWidth="2px"
          borderRadius="2xl"
          boxShadow="0 4px 20px rgba(59, 130, 246, 0.08)"
        >
          <CardBody p={8}>
            <VStack spacing={8} align="start">
              <HStack spacing={4}>
                <Box
                  w="40px"
                  h="40px"
                  bgGradient="linear(45deg, blue.500, cyan.500)"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 4px 15px rgba(59, 130, 246, 0.3)"
                >
                  <Icon as={FaIdCard} color="white" fontSize="lg" />
                </Box>
                <Heading 
                  size="md"
                  bgGradient="linear(45deg, blue.600, cyan.600)"
                  bgClip="text"
                  sx={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  fontWeight="700"
                >
                  Insurance Information (Optional)
                </Heading>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                <FormControl>
                  <FormLabel>Insurance Provider</FormLabel>
                  <Select
                    value={formData.insuranceProvider}
                    onChange={(e) =>
                      updateFormData("insuranceProvider", e.target.value)
                    }
                    placeholder="Select insurance provider"
                  >
                    {insuranceProviders.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Insurance Number</FormLabel>
                  <Input
                    value={formData.insuranceNumber}
                    onChange={(e) =>
                      updateFormData("insuranceNumber", e.target.value)
                    }
                    placeholder="Your insurance number/ID"
                  />
                </FormControl>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Additional Information */}
        <Card 
          bg="rgba(255, 255, 255, 0.85)"
          backdropFilter="blur(15px)"
          borderColor="rgba(123, 31, 162, 0.2)"
          borderWidth="2px"
          borderRadius="2xl"
          boxShadow="0 4px 20px rgba(123, 31, 162, 0.08)"
        >
          <CardBody p={8}>
            <VStack spacing={8} align="start">
              <HStack spacing={4}>
                <Box
                  w="40px"
                  h="40px"
                  bgGradient="linear(45deg, purple.500, brand.500)"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 4px 15px rgba(123, 31, 162, 0.3)"
                >
                  <Icon as={FaInfoCircle} color="white" fontSize="lg" />
                </Box>
                <Heading 
                  size="md"
                  bgGradient="linear(45deg, purple.600, brand.600)"
                  bgClip="text"
                  sx={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  fontWeight="700"
                >
                  Additional Information
                </Heading>
              </HStack>

              <FormControl>
                <FormLabel>
                  Special Needs or Accessibility Requirements
                </FormLabel>
                <Textarea
                  value={formData.specialNeeds}
                  onChange={(e) =>
                    updateFormData("specialNeeds", e.target.value)
                  }
                  placeholder="Any special accommodations needed (e.g., wheelchair access, hearing assistance, language interpretation)"
                  rows={3}
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Consent and Agreements */}
        <Card 
          bg="rgba(255, 255, 255, 0.85)"
          backdropFilter="blur(15px)"
          borderColor="rgba(34, 197, 94, 0.2)"
          borderWidth="2px"
          borderRadius="2xl"
          boxShadow="0 4px 20px rgba(34, 197, 94, 0.08)"
        >
          <CardBody p={8}>
            <VStack spacing={8} align="start">
              <HStack spacing={4}>
                <Box
                  w="40px"
                  h="40px"
                  bgGradient="linear(45deg, green.500, emerald.500)"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 4px 15px rgba(34, 197, 94, 0.3)"
                >
                  <Icon as={FaCheckCircle} color="white" fontSize="lg" />
                </Box>
                <Heading 
                  size="md"
                  bgGradient="linear(45deg, green.600, emerald.600)"
                  bgClip="text"
                  sx={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  fontWeight="700"
                >
                  Consent and Agreements
                </Heading>
              </HStack>

              <VStack spacing={4} align="start" w="full">
                <FormControl isInvalid={!!errors.consentToTreatment}>
                  <HStack spacing={3}>
                    <Checkbox
                      isChecked={formData.consentToTreatment}
                      onChange={(e) =>
                        updateFormData("consentToTreatment", e.target.checked)
                      }
                      colorScheme="green"
                      size="lg"
                    />
                    <Box>
                      <Text fontWeight="600">Consent to Treatment *</Text>
                      <Text fontSize="sm" color="gray.600">
                        I consent to receive healthcare services from Royal
                        Health Consult and understand the nature of the services
                        being provided.
                      </Text>
                    </Box>
                  </HStack>
                  <FormErrorMessage>
                    {errors.consentToTreatment}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.consentToDataProcessing}>
                  <HStack spacing={3}>
                    <Checkbox
                      isChecked={formData.consentToDataProcessing}
                      onChange={(e) =>
                        updateFormData(
                          "consentToDataProcessing",
                          e.target.checked
                        )
                      }
                      colorScheme="green"
                      size="lg"
                    />
                    <Box>
                      <Text fontWeight="600">Data Processing Consent *</Text>
                      <Text fontSize="sm" color="gray.600">
                        I agree to the processing of my personal and medical
                        data as outlined in the Privacy Policy for the purpose
                        of providing healthcare services.
                      </Text>
                    </Box>
                  </HStack>
                  <FormErrorMessage>
                    {errors.consentToDataProcessing}
                  </FormErrorMessage>
                </FormControl>

                <FormControl>
                  <HStack spacing={3}>
                    <Checkbox
                      isChecked={formData.consentToSMSUpdates}
                      onChange={(e) =>
                        updateFormData("consentToSMSUpdates", e.target.checked)
                      }
                      colorScheme="green"
                      size="lg"
                    />
                    <Box>
                      <Text fontWeight="600">SMS Updates (Optional)</Text>
                      <Text fontSize="sm" color="gray.600">
                        I would like to receive appointment reminders and health
                        tips via SMS.
                      </Text>
                    </Box>
                  </HStack>
                </FormControl>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Form Summary */}
        {isFormValid && (
          <Alert status="success">
            <AlertIcon />
            <Box>
              <AlertTitle>Information Complete!</AlertTitle>
              <AlertDescription>
                All required information has been provided. You can now complete
                your booking.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {!isFormValid && Object.keys(errors).length > 0 && (
          <Alert status="error">
            <AlertIcon />
            <Box>
              <AlertTitle>Please Complete Required Fields</AlertTitle>
              <AlertDescription>
                Some required information is missing. Please fill in all
                required fields marked with *.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Submit Button */}
        {/* <Button
          size="lg"
          bgGradient="linear(45deg, brand.500, purple.500)"
          color="white"
          onClick={handleSubmit}
          isDisabled={!isFormValid}
          w="full"
          py={8}
          borderRadius="2xl"
          fontSize="lg"
          fontWeight="700"
          boxShadow="0 8px 25px rgba(194, 24, 91, 0.25)"
          _hover={{
            bgGradient: "linear(45deg, brand.600, purple.600)",
            transform: "translateY(-2px)",
            boxShadow: "0 12px 35px rgba(194, 24, 91, 0.35)"
          }}
          _active={{
            transform: "translateY(0)",
            boxShadow: "0 6px 20px rgba(194, 24, 91, 0.3)"
          }}
          _disabled={{
            bgGradient: "none",
            bg: "gray.300",
            color: "gray.500",
            cursor: "not-allowed",
            transform: "none",
            boxShadow: "none",
            _hover: {
              bgGradient: "none",
              bg: "gray.300",
              transform: "none",
              boxShadow: "none"
            }
          }}
          transition="all 0.2s ease-in-out"
        >
          Complete Booking
        </Button> */}
      </VStack>
    </Container>
  );
};

export default PatientInformationForm;
