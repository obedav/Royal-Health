import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Badge,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  Flex,
  IconButton,
  Tooltip,
  useToast,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react';
import { 
  ViewIcon, 
  DownloadIcon, 
  SearchIcon, 
  CalendarIcon, 
  EditIcon,
  ChevronDownIcon,
  ChevronUpIcon 
} from '@chakra-ui/icons';

interface VitalSigns {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  bmi: string;
}

interface HealthRecordEntry {
  id: string;
  date: string;
  visitType: 'routine' | 'follow-up' | 'emergency' | 'consultation';
  diagnosis: string;
  symptoms: string[];
  vitalSigns: VitalSigns;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  labResults: Array<{
    test: string;
    result: string;
    status: 'normal' | 'abnormal' | 'critical';
  }>;
  notes: string;
  provider: string;
  nextAppointment?: string;
}

interface PatientSummary {
  totalVisits: number;
  lastVisit: string;
  commonDiagnoses: string[];
  activeMedications: number;
  averageBMI: number;
  chronicConditions: string[];
}

const HealthRecordHistory: React.FC = () => {
  const [records, setRecords] = useState<HealthRecordEntry[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<HealthRecordEntry[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecordEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [visitTypeFilter, setVisitTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Mock data - replace with API call
  const mockRecords: HealthRecordEntry[] = [
    {
      id: '1',
      date: '2025-08-28',
      visitType: 'routine',
      diagnosis: 'Hypertension, Type 2 Diabetes',
      symptoms: ['Headache', 'Fatigue', 'Increased thirst'],
      vitalSigns: {
        bloodPressure: '140/90',
        heartRate: '78',
        temperature: '36.8',
        weight: '75',
        bmi: '24.2',
      },
      medications: [
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
      ],
      labResults: [
        { test: 'HbA1c', result: '7.2%', status: 'abnormal' },
        { test: 'Blood Glucose', result: '145 mg/dL', status: 'abnormal' },
      ],
      notes: 'Patient shows good compliance with medication. Blood sugar levels improving but still elevated. Recommended dietary changes and regular exercise.',
      provider: 'Dr. Sarah Johnson',
      nextAppointment: '2025-09-28',
    },
    {
      id: '2',
      date: '2025-07-15',
      visitType: 'follow-up',
      diagnosis: 'Hypertension follow-up',
      symptoms: ['Mild dizziness'],
      vitalSigns: {
        bloodPressure: '135/85',
        heartRate: '72',
        temperature: '36.5',
        weight: '76',
        bmi: '24.5',
      },
      medications: [
        { name: 'Lisinopril', dosage: '5mg', frequency: 'Once daily' },
      ],
      labResults: [
        { test: 'Blood Pressure Monitor', result: 'Average 138/87', status: 'abnormal' },
      ],
      notes: 'Blood pressure slightly improved. Increased Lisinopril dosage. Patient advised to continue low-sodium diet.',
      provider: 'Dr. Sarah Johnson',
    },
    {
      id: '3',
      date: '2025-06-01',
      visitType: 'routine',
      diagnosis: 'Annual Physical Exam',
      symptoms: ['No complaints'],
      vitalSigns: {
        bloodPressure: '145/92',
        heartRate: '80',
        temperature: '36.7',
        weight: '77',
        bmi: '24.8',
      },
      medications: [],
      labResults: [
        { test: 'Complete Blood Count', result: 'Normal', status: 'normal' },
        { test: 'Lipid Panel', result: 'Cholesterol 220 mg/dL', status: 'abnormal' },
      ],
      notes: 'Initial diagnosis of hypertension. Started on ACE inhibitor. Counseled on lifestyle modifications.',
      provider: 'Dr. Michael Chen',
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchRecords = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRecords(mockRecords);
        setFilteredRecords(mockRecords);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load health records.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    let filtered = records;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        record.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case '30days':
          filterDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          filterDate.setDate(now.getDate() - 90);
          break;
        case '1year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(record => new Date(record.date) >= filterDate);
    }

    // Visit type filter
    if (visitTypeFilter !== 'all') {
      filtered = filtered.filter(record => record.visitType === visitTypeFilter);
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredRecords(filtered);
  }, [records, searchTerm, dateFilter, visitTypeFilter, sortOrder]);

  const handleViewRecord = (record: HealthRecordEntry) => {
    setSelectedRecord(record);
    onOpen();
  };

  const generatePatientSummary = (): PatientSummary => {
    const diagnoses = records.flatMap(r => r.diagnosis.split(', '));
    const diagnosisCount = diagnoses.reduce((acc, diagnosis) => {
      acc[diagnosis] = (acc[diagnosis] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const commonDiagnoses = Object.entries(diagnosisCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([diagnosis]) => diagnosis);

    const activeMedications = records[0]?.medications.length || 0;
    const bmiValues = records
      .map(r => parseFloat(r.vitalSigns.bmi))
      .filter(bmi => !isNaN(bmi));
    const averageBMI = bmiValues.length > 0 
      ? bmiValues.reduce((sum, bmi) => sum + bmi, 0) / bmiValues.length 
      : 0;

    return {
      totalVisits: records.length,
      lastVisit: records.length > 0 ? records[0].date : 'N/A',
      commonDiagnoses,
      activeMedications,
      averageBMI: parseFloat(averageBMI.toFixed(1)),
      chronicConditions: ['Hypertension', 'Type 2 Diabetes'], // Mock data
    };
  };

  const getVisitTypeColor = (visitType: string) => {
    switch (visitType) {
      case 'routine': return 'green';
      case 'follow-up': return 'blue';
      case 'emergency': return 'red';
      case 'consultation': return 'purple';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'green';
      case 'abnormal': return 'yellow';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  const exportRecords = () => {
    // Mock export functionality
    toast({
      title: 'Export Started',
      description: 'Your health records are being exported to PDF.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const patientSummary = generatePatientSummary();

  if (isLoading) {
    return (
      <Center h="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading health records...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box p={6} maxW="7xl" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              Health Record History
            </Text>
            <Text color="gray.600">
              Complete medical history and visit records
            </Text>
          </Box>
          
          <Button
            leftIcon={<DownloadIcon />}
            colorScheme="blue"
            onClick={exportRecords}
          >
            Export Records
          </Button>
        </Flex>

        {/* Patient Summary */}
        <Card>
          <CardHeader>
            <Text fontSize="lg" fontWeight="semibold">Patient Summary</Text>
          </CardHeader>
          <CardBody>
            <StatGroup>
              <Stat>
                <StatLabel>Total Visits</StatLabel>
                <StatNumber>{patientSummary.totalVisits}</StatNumber>
                <StatHelpText>Medical visits recorded</StatHelpText>
              </Stat>
              
              <Stat>
                <StatLabel>Last Visit</StatLabel>
                <StatNumber fontSize="md">
                  {new Date(patientSummary.lastVisit).toLocaleDateString()}
                </StatNumber>
                <StatHelpText>Most recent appointment</StatHelpText>
              </Stat>
              
              <Stat>
                <StatLabel>Active Medications</StatLabel>
                <StatNumber>{patientSummary.activeMedications}</StatNumber>
                <StatHelpText>Currently prescribed</StatHelpText>
              </Stat>
              
              <Stat>
                <StatLabel>Average BMI</StatLabel>
                <StatNumber>{patientSummary.averageBMI}</StatNumber>
                <StatHelpText>
                  {patientSummary.averageBMI < 25 ? (
                    <StatArrow type="decrease" />
                  ) : (
                    <StatArrow type="increase" />
                  )}
                  Normal range: 18.5-24.9
                </StatHelpText>
              </Stat>
            </StatGroup>
            
            <Divider my={4} />
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text fontWeight="semibold" mb={2}>Common Diagnoses</Text>
                <VStack align="start" spacing={1}>
                  {patientSummary.commonDiagnoses.map((diagnosis, index) => (
                    <Badge key={index} variant="subtle" colorScheme="blue">
                      {diagnosis}
                    </Badge>
                  ))}
                </VStack>
              </Box>
              
              <Box>
                <Text fontWeight="semibold" mb={2}>Chronic Conditions</Text>
                <VStack align="start" spacing={1}>
                  {patientSummary.chronicConditions.map((condition, index) => (
                    <Badge key={index} variant="subtle" colorScheme="orange">
                      {condition}
                    </Badge>
                  ))}
                </VStack>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Filters */}
        <Card>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Search</Text>
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftElement={<SearchIcon color="gray.400" />}
                />
              </Box>
              
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Date Range</Text>
                <Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All time</option>
                  <option value="30days">Last 30 days</option>
                  <option value="90days">Last 90 days</option>
                  <option value="1year">Last year</option>
                </Select>
              </Box>
              
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Visit Type</Text>
                <Select
                  value={visitTypeFilter}
                  onChange={(e) => setVisitTypeFilter(e.target.value)}
                >
                  <option value="all">All types</option>
                  <option value="routine">Routine</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="emergency">Emergency</option>
                  <option value="consultation">Consultation</option>
                </Select>
              </Box>
              
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Sort Order</Text>
                <Button
                  variant="outline"
                  w="full"
                  rightIcon={sortOrder === 'desc' ? <ChevronDownIcon /> : <ChevronUpIcon />}
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                >
                  {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                </Button>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Records List */}
        {filteredRecords.length === 0 ? (
          <Alert status="info">
            <AlertIcon />
            No health records found matching your criteria.
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Text fontSize="lg" fontWeight="semibold">
                  Health Records ({filteredRecords.length})
                </Text>
              </Flex>
            </CardHeader>
            <CardBody>
              <Accordion allowMultiple>
                {filteredRecords.map((record, index) => (
                  <AccordionItem key={record.id}>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <HStack spacing={4}>
                            <Badge colorScheme={getVisitTypeColor(record.visitType)} textTransform="capitalize">
                              {record.visitType}
                            </Badge>
                            <Text fontWeight="semibold">
                              {new Date(record.date).toLocaleDateString()}
                            </Text>
                            <Text>{record.diagnosis}</Text>
                            <Text fontSize="sm" color="gray.600">
                              by {record.provider}
                            </Text>
                          </HStack>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <VStack spacing={4} align="stretch">
                        {/* Symptoms */}
                        {record.symptoms.length > 0 && (
                          <Box>
                            <Text fontWeight="semibold" mb={2}>Symptoms</Text>
                            <HStack wrap="wrap" spacing={2}>
                              {record.symptoms.map((symptom, idx) => (
                                <Badge key={idx} variant="outline">
                                  {symptom}
                                </Badge>
                              ))}
                            </HStack>
                          </Box>
                        )}

                        {/* Vital Signs */}
                        <Box>
                          <Text fontWeight="semibold" mb={2}>Vital Signs</Text>
                          <SimpleGrid columns={{ base: 2, md: 5 }} spacing={3}>
                            <Text fontSize="sm">
                              <strong>BP:</strong> {record.vitalSigns.bloodPressure}
                            </Text>
                            <Text fontSize="sm">
                              <strong>HR:</strong> {record.vitalSigns.heartRate} bpm
                            </Text>
                            <Text fontSize="sm">
                              <strong>Temp:</strong> {record.vitalSigns.temperature}°C
                            </Text>
                            <Text fontSize="sm">
                              <strong>Weight:</strong> {record.vitalSigns.weight} kg
                            </Text>
                            <Text fontSize="sm">
                              <strong>BMI:</strong> {record.vitalSigns.bmi}
                            </Text>
                          </SimpleGrid>
                        </Box>

                        {/* Lab Results */}
                        {record.labResults.length > 0 && (
                          <Box>
                            <Text fontWeight="semibold" mb={2}>Lab Results</Text>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                              {record.labResults.map((lab, idx) => (
                                <HStack key={idx} justify="space-between">
                                  <Text fontSize="sm">{lab.test}:</Text>
                                  <HStack>
                                    <Text fontSize="sm">{lab.result}</Text>
                                    <Badge size="sm" colorScheme={getStatusColor(lab.status)}>
                                      {lab.status}
                                    </Badge>
                                  </HStack>
                                </HStack>
                              ))}
                            </SimpleGrid>
                          </Box>
                        )}

                        {/* Medications */}
                        {record.medications.length > 0 && (
                          <Box>
                            <Text fontWeight="semibold" mb={2}>Medications</Text>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                              {record.medications.map((med, idx) => (
                                <Text key={idx} fontSize="sm">
                                  {med.name} - {med.dosage} ({med.frequency})
                                </Text>
                              ))}
                            </SimpleGrid>
                          </Box>
                        )}

                        {/* Notes */}
                        <Box>
                          <Text fontWeight="semibold" mb={2}>Clinical Notes</Text>
                          <Text fontSize="sm" p={3} bg="gray.50" borderRadius="md">
                            {record.notes}
                          </Text>
                        </Box>

                        {/* Actions */}
                        <Flex justify="flex-end" pt={2}>
                          <Button
                            size="sm"
                            leftIcon={<ViewIcon />}
                            onClick={() => handleViewRecord(record)}
                          >
                            View Details
                          </Button>
                        </Flex>
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardBody>
          </Card>
        )}
      </VStack>

      {/* Record Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack justify="space-between">
              <Text>Medical Record Details</Text>
              {selectedRecord && (
                <Badge colorScheme={getVisitTypeColor(selectedRecord.visitType)} textTransform="capitalize">
                  {selectedRecord.visitType}
                </Badge>
              )}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          
          {selectedRecord && (
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontWeight="semibold" color="gray.600">Date</Text>
                    <Text>{new Date(selectedRecord.date).toLocaleDateString()}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="gray.600">Provider</Text>
                    <Text>{selectedRecord.provider}</Text>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontWeight="semibold" color="gray.600" mb={2}>Diagnosis</Text>
                  <Text>{selectedRecord.diagnosis}</Text>
                </Box>

                <Box>
                  <Text fontWeight="semibold" color="gray.600" mb={2}>Complete Clinical Notes</Text>
                  <Text fontSize="sm" p={3} bg="gray.50" borderRadius="md">
                    {selectedRecord.notes}
                  </Text>
                </Box>

                {selectedRecord.nextAppointment && (
                  <Alert status="info">
                    <AlertIcon />
                    Next appointment scheduled for: {new Date(selectedRecord.nextAppointment).toLocaleDateString()}
                  </Alert>
                )}
              </VStack>
            </ModalBody>
          )}
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" leftIcon={<EditIcon />}>
              Edit Record
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default HealthRecordHistory;