import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Tooltip,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { AddIcon, ViewIcon, EditIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons';

interface VitalSigns {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  weight: string;
  height: string;
  bmi: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'discontinued';
  prescribedBy: string;
}

interface LabResult {
  id: string;
  testName: string;
  result: string;
  normalRange: string;
  unit: string;
  date: string;
  status: 'normal' | 'abnormal' | 'critical';
}

interface HealthRecordData {
  id?: string;
  patientId: string;
  patientName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  vitalSigns: VitalSigns;
  medications: Medication[];
  labResults: LabResult[];
  visitNotes: string;
  nextAppointment?: string;
  recordDate: string;
}

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  medication: Medication | null;
  onSave: (medication: Medication) => void;
}

const MedicationModal: React.FC<MedicationModalProps> = ({
  isOpen,
  onClose,
  medication,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'active',
    prescribedBy: '',
  });

  useEffect(() => {
    if (medication) {
      setFormData(medication);
    } else {
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
        prescribedBy: '',
      });
    }
  }, [medication, isOpen]);

  const handleSave = () => {
    if (formData.name && formData.dosage && formData.frequency) {
      const medicationData: Medication = {
        id: medication?.id || Date.now().toString(),
        name: formData.name!,
        dosage: formData.dosage!,
        frequency: formData.frequency!,
        startDate: formData.startDate!,
        endDate: formData.endDate,
        status: formData.status as 'active' | 'completed' | 'discontinued',
        prescribedBy: formData.prescribedBy!,
      };
      onSave(medicationData);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{medication ? 'Edit Medication' : 'Add Medication'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Medication Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Metformin"
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Dosage</FormLabel>
              <Input
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g., 500mg"
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Frequency</FormLabel>
              <Select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              >
                <option value="">Select frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Four times daily">Four times daily</option>
                <option value="As needed">As needed</option>
              </Select>
            </FormControl>
            
            <SimpleGrid columns={2} spacing={4} w="full">
              <FormControl>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>End Date (Optional)</FormLabel>
                <Input
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </FormControl>
            </SimpleGrid>
            
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="discontinued">Discontinued</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Prescribed By</FormLabel>
              <Input
                value={formData.prescribedBy}
                onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                placeholder="Doctor's name"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const HealthRecord: React.FC = () => {
  const [healthRecord, setHealthRecord] = useState<HealthRecordData>({
    id: '1',
    patientId: 'P001',
    patientName: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    allergies: [],
    chronicConditions: [],
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
      bmi: '',
    },
    medications: [],
    labResults: [],
    visitNotes: '',
    recordDate: new Date().toISOString().split('T')[0],
  });

  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen: isMedicationModalOpen, onOpen: openMedicationModal, onClose: closeMedicationModal } = useDisclosure();
  const toast = useToast();

  const calculateBMI = (weight: string, height: string): string => {
    if (!weight || !height) return '';
    const weightKg = parseFloat(weight);
    const heightM = parseFloat(height) / 100; // Convert cm to m
    if (weightKg > 0 && heightM > 0) {
      const bmi = weightKg / (heightM * heightM);
      return bmi.toFixed(1);
    }
    return '';
  };

  const handleVitalSignsChange = (field: keyof VitalSigns, value: string) => {
    const newVitalSigns = {
      ...healthRecord.vitalSigns,
      [field]: value,
    };

    if (field === 'weight' || field === 'height') {
      newVitalSigns.bmi = calculateBMI(
        field === 'weight' ? value : newVitalSigns.weight,
        field === 'height' ? value : newVitalSigns.height
      );
    }

    setHealthRecord(prev => ({
      ...prev,
      vitalSigns: newVitalSigns,
    }));
  };

  const handleAddMedication = () => {
    setSelectedMedication(null);
    openMedicationModal();
  };

  const handleEditMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    openMedicationModal();
  };

  const handleSaveMedication = (medication: Medication) => {
    setHealthRecord(prev => ({
      ...prev,
      medications: prev.medications.some(m => m.id === medication.id)
        ? prev.medications.map(m => m.id === medication.id ? medication : m)
        : [...prev.medications, medication],
    }));
  };

  const handleDeleteMedication = (medicationId: string) => {
    setHealthRecord(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m.id !== medicationId),
    }));
  };

  const handleSaveRecord = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Health Record Saved',
        description: 'The health record has been successfully saved.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save health record. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getBMIStatus = (bmi: string) => {
    if (!bmi) return { status: 'normal', color: 'gray' };
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { status: 'Underweight', color: 'blue' };
    if (bmiValue < 25) return { status: 'Normal', color: 'green' };
    if (bmiValue < 30) return { status: 'Overweight', color: 'yellow' };
    return { status: 'Obese', color: 'red' };
  };

  const getMedicationStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'completed': return 'blue';
      case 'discontinued': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box p={6} maxW="6xl" mx="auto">
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              Health Record
            </Text>
            <Text color="gray.600">
              Comprehensive health information and medical history
            </Text>
          </Box>
          
          <HStack spacing={2}>
            <Button
              leftIcon={<DownloadIcon />}
              variant="outline"
              size="sm"
            >
              Export
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSaveRecord}
              isLoading={isLoading}
              loadingText="Saving..."
            >
              Save Record
            </Button>
          </HStack>
        </Flex>

        {/* Patient Information */}
        <Card>
          <CardHeader>
            <Text fontSize="lg" fontWeight="semibold">Patient Information</Text>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={healthRecord.patientName}
                  onChange={(e) => setHealthRecord(prev => ({ ...prev, patientName: e.target.value }))}
                  placeholder="Enter patient name"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  type="date"
                  value={healthRecord.dateOfBirth}
                  onChange={(e) => setHealthRecord(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Gender</FormLabel>
                <Select
                  value={healthRecord.gender}
                  onChange={(e) => setHealthRecord(prev => ({ ...prev, gender: e.target.value }))}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Blood Type</FormLabel>
                <Select
                  value={healthRecord.bloodType}
                  onChange={(e) => setHealthRecord(prev => ({ ...prev, bloodType: e.target.value }))}
                >
                  <option value="">Select blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Emergency Contact Name</FormLabel>
                <Input
                  value={healthRecord.emergencyContact.name}
                  onChange={(e) => setHealthRecord(prev => ({
                    ...prev,
                    emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                  }))}
                  placeholder="Contact name"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Emergency Contact Phone</FormLabel>
                <Input
                  value={healthRecord.emergencyContact.phone}
                  onChange={(e) => setHealthRecord(prev => ({
                    ...prev,
                    emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                  }))}
                  placeholder="+234 800 123 4567"
                />
              </FormControl>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Vital Signs */}
        <Card>
          <CardHeader>
            <Text fontSize="lg" fontWeight="semibold">Vital Signs</Text>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              <FormControl>
                <FormLabel>Blood Pressure</FormLabel>
                <Input
                  value={healthRecord.vitalSigns.bloodPressure}
                  onChange={(e) => handleVitalSignsChange('bloodPressure', e.target.value)}
                  placeholder="120/80 mmHg"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Heart Rate</FormLabel>
                <Input
                  value={healthRecord.vitalSigns.heartRate}
                  onChange={(e) => handleVitalSignsChange('heartRate', e.target.value)}
                  placeholder="72 bpm"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Temperature</FormLabel>
                <Input
                  value={healthRecord.vitalSigns.temperature}
                  onChange={(e) => handleVitalSignsChange('temperature', e.target.value)}
                  placeholder="36.5°C"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Oxygen Saturation</FormLabel>
                <Input
                  value={healthRecord.vitalSigns.oxygenSaturation}
                  onChange={(e) => handleVitalSignsChange('oxygenSaturation', e.target.value)}
                  placeholder="98%"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Weight (kg)</FormLabel>
                <Input
                  value={healthRecord.vitalSigns.weight}
                  onChange={(e) => handleVitalSignsChange('weight', e.target.value)}
                  placeholder="70"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Height (cm)</FormLabel>
                <Input
                  value={healthRecord.vitalSigns.height}
                  onChange={(e) => handleVitalSignsChange('height', e.target.value)}
                  placeholder="175"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>BMI</FormLabel>
                <HStack>
                  <Input
                    value={healthRecord.vitalSigns.bmi}
                    isReadOnly
                    bg="gray.50"
                  />
                  {healthRecord.vitalSigns.bmi && (
                    <Badge colorScheme={getBMIStatus(healthRecord.vitalSigns.bmi).color}>
                      {getBMIStatus(healthRecord.vitalSigns.bmi).status}
                    </Badge>
                  )}
                </HStack>
              </FormControl>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Current Medications</Text>
              <Button
                leftIcon={<AddIcon />}
                size="sm"
                colorScheme="blue"
                onClick={handleAddMedication}
              >
                Add Medication
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            {healthRecord.medications.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Medication</Th>
                    <Th>Dosage</Th>
                    <Th>Frequency</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {healthRecord.medications.map((medication) => (
                    <Tr key={medication.id}>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">{medication.name}</Text>
                          {medication.prescribedBy && (
                            <Text fontSize="sm" color="gray.600">
                              by {medication.prescribedBy}
                            </Text>
                          )}
                        </VStack>
                      </Td>
                      <Td>{medication.dosage}</Td>
                      <Td>{medication.frequency}</Td>
                      <Td>
                        <Badge colorScheme={getMedicationStatusColor(medication.status)} textTransform="capitalize">
                          {medication.status}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          <Tooltip label="Edit medication">
                            <IconButton
                              aria-label="Edit medication"
                              icon={<EditIcon />}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditMedication(medication)}
                            />
                          </Tooltip>
                          <Tooltip label="Delete medication">
                            <IconButton
                              aria-label="Delete medication"
                              icon={<DeleteIcon />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDeleteMedication(medication.id)}
                            />
                          </Tooltip>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text color="gray.500" textAlign="center" py={4}>
                No medications recorded. Click "Add Medication" to get started.
              </Text>
            )}
          </CardBody>
        </Card>

        {/* Visit Notes */}
        <Card>
          <CardHeader>
            <Text fontSize="lg" fontWeight="semibold">Visit Notes</Text>
          </CardHeader>
          <CardBody>
            <FormControl>
              <FormLabel>Clinical Notes</FormLabel>
              <Textarea
                value={healthRecord.visitNotes}
                onChange={(e) => setHealthRecord(prev => ({ ...prev, visitNotes: e.target.value }))}
                placeholder="Enter clinical observations, diagnosis, treatment plan, and recommendations..."
                rows={6}
              />
            </FormControl>
          </CardBody>
        </Card>

        {/* Summary Stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Stat>
            <StatLabel>Active Medications</StatLabel>
            <StatNumber>{healthRecord.medications.filter(m => m.status === 'active').length}</StatNumber>
            <StatHelpText>Currently prescribed</StatHelpText>
          </Stat>
          
          <Stat>
            <StatLabel>Record Date</StatLabel>
            <StatNumber fontSize="lg">{new Date(healthRecord.recordDate).toLocaleDateString()}</StatNumber>
            <StatHelpText>Last updated</StatHelpText>
          </Stat>
          
          <Stat>
            <StatLabel>Patient ID</StatLabel>
            <StatNumber fontSize="lg">{healthRecord.patientId}</StatNumber>
            <StatHelpText>Unique identifier</StatHelpText>
          </Stat>
        </SimpleGrid>
      </VStack>

      {/* Medication Modal */}
      <MedicationModal
        isOpen={isMedicationModalOpen}
        onClose={closeMedicationModal}
        medication={selectedMedication}
        onSave={handleSaveMedication}
      />
    </Box>
  );
};

export default HealthRecord;