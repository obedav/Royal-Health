// src/components/booking/PaymentIntegration.tsx
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
  Button,
  Icon,
  Badge,
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Radio,
  RadioGroup,
  Stack,
  Image,
  Flex,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react'
import {
  FaCreditCard,
  FaMobileAlt,
  FaUniversity,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLock,
  FaShieldAlt,
  FaMoneyBillWave,
  FaReceipt,
  FaGift,
} from 'react-icons/fa'
import { useState, useEffect } from 'react'
import type { BookingService } from '../../types/booking.types'
import type { ScheduleData } from './AppointmentScheduling'
import type { PatientInformation } from './PatientInformationForm'

interface PaymentIntegrationProps {
  selectedService: BookingService
  selectedSchedule: ScheduleData
  patientInfo: PatientInformation
  onPaymentSuccess: (paymentData: PaymentResult) => void
  onPaymentError: (error: string) => void
}

export interface PaymentResult {
  transactionId: string
  reference: string
  amount: number
  method: PaymentMethod
  status: 'success' | 'pending' | 'failed'
  gateway: 'flutterwave' | 'paystack'
  paidAt: string
}

type PaymentMethod = 'card' | 'bank_transfer' | 'ussd' | 'qr' | 'cash'

interface PricingBreakdown {
  servicePrice: number
  emergencyFee?: number
  weekendFee?: number
  transportFee: number
  discount?: number
  tax: number
  total: number
}

const PaymentIntegration: React.FC<PaymentIntegrationProps> = ({
  selectedService,
  selectedSchedule,
  patientInfo,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [selectedGateway, setSelectedGateway] = useState<'flutterwave' | 'paystack'>('flutterwave')
  const [promoCode, setPromoCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)

  // Calculate pricing breakdown
  const calculatePricing = (): PricingBreakdown => {
    const basePrice = selectedSchedule.timeSlot.price || selectedService.price
    
    // Emergency fee (1.5x for emergency services after hours)
    const isEmergencyAfterHours = selectedService.category === 'emergency' && 
      (parseInt(selectedSchedule.timeSlot.time.split(':')[0]) < 8 || 
       parseInt(selectedSchedule.timeSlot.time.split(':')[0]) > 18)
    const emergencyFee = isEmergencyAfterHours ? basePrice * 0.5 : 0

    // Weekend fee (20% for weekend services)
    const isWeekend = new Date(selectedSchedule.date).getDay() === 0 || 
                     new Date(selectedSchedule.date).getDay() === 6
    const weekendFee = isWeekend && selectedService.category !== 'emergency' ? basePrice * 0.2 : 0

    // Transport fee based on location
    const transportFee = calculateTransportFee(selectedSchedule.address.state)
    
    // Discount from promo code
    const discount = appliedDiscount

    // Tax (5% VAT)
    const subtotal = basePrice + emergencyFee + weekendFee + transportFee - discount
    const tax = subtotal * 0.05

    const total = subtotal + tax

    return {
      servicePrice: basePrice,
      emergencyFee: emergencyFee > 0 ? emergencyFee : undefined,
      weekendFee: weekendFee > 0 ? weekendFee : undefined,
      transportFee,
      discount: discount > 0 ? discount : undefined,
      tax,
      total
    }
  }

  const calculateTransportFee = (state: string): number => {
    // Transport fees based on Nigerian states
    const transportFees: Record<string, number> = {
      'lagos': 2000,
      'abuja': 3000,
      'kano': 2500,
      'rivers': 2500,
      'oyo': 2000,
      'kaduna': 2500,
      'ogun': 1500,
      'ondo': 2000,
      'osun': 2000,
      'delta': 2500,
      'anambra': 2500,
      'imo': 2500,
      'enugu': 2500,
      'edo': 2000,
      'plateau': 3000,
    }
    return transportFees[state.toLowerCase()] || 3000 // Default for other states
  }

  const pricing = calculatePricing()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Nigerian states for display
  const nigerianStates = [
    { value: 'lagos', label: 'Lagos' },
    { value: 'abuja', label: 'Abuja (FCT)' },
    { value: 'kano', label: 'Kano' },
    { value: 'rivers', label: 'Rivers' },
    { value: 'oyo', label: 'Oyo' },
    { value: 'kaduna', label: 'Kaduna' },
    { value: 'ogun', label: 'Ogun' },
    { value: 'ondo', label: 'Ondo' },
    { value: 'osun', label: 'Osun' },
    { value: 'delta', label: 'Delta' },
    { value: 'anambra', label: 'Anambra' },
    { value: 'imo', label: 'Imo' },
    { value: 'enugu', label: 'Enugu' },
    { value: 'edo', label: 'Edo' },
    { value: 'plateau', label: 'Plateau' },
    { value: 'cross-river', label: 'Cross River' },
    { value: 'akwa-ibom', label: 'Akwa Ibom' }
  ]

  // Mock promo code validation
  const validatePromoCode = (code: string) => {
    const promoCodes: Record<string, number> = {
      'FIRSTTIME': 0.1, // 10% discount
      'ROYAL20': 0.2,   // 20% discount
      'HEALTH15': 0.15, // 15% discount
      'NURSE10': 0.1,   // 10% discount
    }
    
    if (promoCodes[code.toUpperCase()]) {
      const discount = pricing.servicePrice * promoCodes[code.toUpperCase()]
      setAppliedDiscount(discount)
      toast({
        title: 'Promo Code Applied!',
        description: `You saved ${formatPrice(discount)}`,
        status: 'success',
        duration: 3000,
      })
    } else {
      toast({
        title: 'Invalid Promo Code',
        description: 'Please check your promo code and try again',
        status: 'error',
        duration: 3000,
      })
    }
  }

  // Flutterwave Payment Integration
  const initiateFlutterwavePayment = async () => {
    setIsProcessingPayment(true)
    
    try {
      // Show loading toast
      toast({
        title: 'Processing Payment...',
        description: 'Please wait while we process your payment',
        status: 'info',
        duration: 2000,
      })

      // Demo configuration for development
      const flutterwaveConfig = {
        public_key: 'FLWPUBK_TEST-demo-key', // Demo key for development
        tx_ref: `RHC-${Date.now()}`,
        amount: pricing.total,
        currency: 'NGN',
        country: 'NG',
        payment_options: selectedPaymentMethod === 'card' ? 'card' : 
                        selectedPaymentMethod === 'bank_transfer' ? 'banktransfer' :
                        selectedPaymentMethod === 'ussd' ? 'ussd' : 'card',
        customer: {
          email: patientInfo.email,
          phone_number: patientInfo.phone,
          name: `${patientInfo.firstName} ${patientInfo.lastName}`,
        },
        customizations: {
          title: 'Royal Health Consult',
          description: `Payment for ${selectedService.name}`,
        },
      }

      console.log('Demo Flutterwave Config:', flutterwaveConfig)

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Mock successful payment (90% success rate for demo)
      const isSuccess = Math.random() > 0.1
      
      if (isSuccess) {
        const paymentResult: PaymentResult = {
          transactionId: `FLW-${Date.now()}`,
          reference: flutterwaveConfig.tx_ref,
          amount: pricing.total,
          method: selectedPaymentMethod,
          status: 'success',
          gateway: 'flutterwave',
          paidAt: new Date().toISOString(),
        }

        toast({
          title: 'Payment Successful!',
          description: 'Your payment has been processed successfully',
          status: 'success',
          duration: 3000,
        })

        onPaymentSuccess(paymentResult)
      } else {
        throw new Error('Payment failed - Demo: Transaction declined')
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.'
      
      toast({
        title: 'Payment Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      })
      
      onPaymentError(errorMessage)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // Paystack Payment Integration
  const initiatePaystackPayment = async () => {
    setIsProcessingPayment(true)
    
    try {
      // Show loading toast
      toast({
        title: 'Processing Payment...',
        description: 'Please wait while we process your payment',
        status: 'info',
        duration: 2000,
      })

      // Demo configuration for development
      const paystackConfig = {
        key: 'pk_test_demo-key', // Demo key for development
        email: patientInfo.email,
        amount: pricing.total * 100, // Paystack expects amount in kobo
        currency: 'NGN',
        ref: `RHC-${Date.now()}`,
        channels: selectedPaymentMethod === 'card' ? ['card'] :
                 selectedPaymentMethod === 'bank_transfer' ? ['bank', 'bank_transfer'] :
                 selectedPaymentMethod === 'ussd' ? ['ussd'] : ['card'],
        metadata: {
          custom_fields: [
            {
              display_name: "Service",
              variable_name: "service",
              value: selectedService.name
            },
            {
              display_name: "Patient",
              variable_name: "patient",
              value: `${patientInfo.firstName} ${patientInfo.lastName}`
            }
          ]
        }
      }

      console.log('Demo Paystack Config:', paystackConfig)

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Mock successful payment (90% success rate for demo)
      const isSuccess = Math.random() > 0.1

      if (isSuccess) {
        const paymentResult: PaymentResult = {
          transactionId: `PS-${Date.now()}`,
          reference: paystackConfig.ref,
          amount: pricing.total,
          method: selectedPaymentMethod,
          status: 'success',
          gateway: 'paystack',
          paidAt: new Date().toISOString(),
        }

        toast({
          title: 'Payment Successful!',
          description: 'Your payment has been processed successfully',
          status: 'success',
          duration: 3000,
        })

        onPaymentSuccess(paymentResult)
      } else {
        throw new Error('Payment declined - Demo: Insufficient funds')
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.'
      
      toast({
        title: 'Payment Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      })
      
      onPaymentError(errorMessage)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const initiatePayment = () => {
    if (selectedGateway === 'flutterwave') {
      initiateFlutterwavePayment()
    } else {
      initiatePaystackPayment()
    }
  }

  const handleCashPayment = () => {
    onOpen() // Open cash payment modal
  }

  const confirmCashPayment = () => {
    const paymentResult: PaymentResult = {
      transactionId: `CASH-${Date.now()}`,
      reference: `RHC-CASH-${Date.now()}`,
      amount: pricing.total,
      method: 'cash',
      status: 'pending',
      gateway: 'flutterwave', // Default gateway for record keeping
      paidAt: new Date().toISOString(),
    }
    
    toast({
      title: 'Appointment Confirmed!',
      description: 'Your appointment is scheduled. Payment will be collected upon service delivery.',
      status: 'success',
      duration: 5000,
    })
    
    onClose()
    onPaymentSuccess(paymentResult)
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
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
                Payment & Confirmation
              </Heading>
              <Text 
                color="gray.700"
                fontSize="lg"
                fontWeight="500"
                maxW="600px"
                lineHeight="1.6"
              >
                Complete your payment to confirm your healthcare appointment with our qualified professionals
              </Text>
            </VStack>
          
            {/* Demo Notice */}
            <Alert 
              status="warning" 
              maxW="700px"
              borderRadius="xl"
              bg="rgba(255, 193, 7, 0.1)"
              border="2px solid"
              borderColor="rgba(255, 193, 7, 0.3)"
              boxShadow="0 4px 15px rgba(255, 193, 7, 0.2)"
            >
              <AlertIcon />
              <Box>
                <AlertTitle fontSize="sm" fontWeight="700">Demo Mode</AlertTitle>
                <AlertDescription fontSize="sm" lineHeight="1.5">
                  This is a development demo. No real payments will be processed. 
                  The system simulates payment flows for testing purposes.
                </AlertDescription>
              </Box>
            </Alert>
          </VStack>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Payment Methods */}
          <VStack spacing={6} align="stretch">
            {/* Payment Gateway Selection */}
            <Card 
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(194, 24, 91, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(194, 24, 91, 0.08)"
            >
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack spacing={3}>
                    <Box
                      w="35px"
                      h="35px"
                      bgGradient="linear(45deg, brand.500, purple.500)"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="0 4px 15px rgba(194, 24, 91, 0.3)"
                    >
                      <Icon as={FaCreditCard} color="white" fontSize="lg" />
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
                      Choose Payment Gateway
                    </Heading>
                  </HStack>
                  <RadioGroup
                    value={selectedGateway}
                    onChange={(value) => setSelectedGateway(value as 'flutterwave' | 'paystack')}
                  >
                    <Stack direction="column" spacing={3}>
                      <HStack spacing={4}>
                        <Radio value="flutterwave" colorScheme="primary">
                          <HStack spacing={3}>
                            <Box bg="orange.500" color="white" px={3} py={1} borderRadius="md" fontSize="sm" fontWeight="bold">
                              FLW
                            </Box>
                            <Text>Flutterwave</Text>
                            <Badge colorScheme="green" size="sm">Recommended</Badge>
                          </HStack>
                        </Radio>
                      </HStack>
                      <HStack spacing={4}>
                        <Radio value="paystack" colorScheme="primary">
                          <HStack spacing={3}>
                            <Box bg="blue.500" color="white" px={3} py={1} borderRadius="md" fontSize="sm" fontWeight="bold">
                              PS
                            </Box>
                            <Text>Paystack</Text>
                          </HStack>
                        </Radio>
                      </HStack>
                    </Stack>
                  </RadioGroup>
                </VStack>
              </CardBody>
            </Card>

            {/* Payment Methods */}
            <Card 
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(123, 31, 162, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(123, 31, 162, 0.08)"
            >
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack spacing={3}>
                    <Box
                      w="35px"
                      h="35px"
                      bgGradient="linear(45deg, purple.500, brand.500)"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="0 4px 15px rgba(123, 31, 162, 0.3)"
                    >
                      <Icon as={FaMobileAlt} color="white" fontSize="lg" />
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
                      Payment Method
                    </Heading>
                  </HStack>
                  <RadioGroup
                    value={selectedPaymentMethod}
                    onChange={(value) => setSelectedPaymentMethod(value as PaymentMethod)}
                  >
                    <Stack direction="column" spacing={3}>
                      <Radio value="card" colorScheme="primary">
                        <HStack spacing={3}>
                          <Icon as={FaCreditCard} color="blue.500" />
                          <VStack spacing={0} align="start">
                            <Text>Debit/Credit Card</Text>
                            <Text fontSize="xs" color="gray.500">
                              Visa, Mastercard, Verve
                            </Text>
                          </VStack>
                        </HStack>
                      </Radio>
                      
                      <Radio value="bank_transfer" colorScheme="primary">
                        <HStack spacing={3}>
                          <Icon as={FaUniversity} color="green.500" />
                          <VStack spacing={0} align="start">
                            <Text>Bank Transfer</Text>
                            <Text fontSize="xs" color="gray.500">
                              Direct bank transfer
                            </Text>
                          </VStack>
                        </HStack>
                      </Radio>
                      
                      <Radio value="ussd" colorScheme="primary">
                        <HStack spacing={3}>
                          <Icon as={FaMobileAlt} color="purple.500" />
                          <VStack spacing={0} align="start">
                            <Text>USSD</Text>
                            <Text fontSize="xs" color="gray.500">
                              *737# and other bank codes
                            </Text>
                          </VStack>
                        </HStack>
                      </Radio>
                      
                      <Radio value="cash" colorScheme="primary">
                        <HStack spacing={3}>
                          <Icon as={FaMoneyBillWave} color="orange.500" />
                          <VStack spacing={0} align="start">
                            <Text>Cash Payment</Text>
                            <Text fontSize="xs" color="gray.500">
                              Pay healthcare professional directly
                            </Text>
                          </VStack>
                        </HStack>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </VStack>
              </CardBody>
            </Card>

            {/* Promo Code */}
            <Card 
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(194, 24, 91, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(194, 24, 91, 0.08)"
            >
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack spacing={3}>
                    <Box
                      w="35px"
                      h="35px"
                      bgGradient="linear(45deg, pink.500, brand.500)"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="0 4px 15px rgba(194, 24, 91, 0.3)"
                    >
                      <Icon as={FaGift} color="white" fontSize="lg" />
                    </Box>
                    <Heading 
                      size="md"
                      bgGradient="linear(45deg, pink.600, brand.600)"
                      bgClip="text"
                      sx={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                      fontWeight="700"
                    >
                      Promo Code
                    </Heading>
                  </HStack>
                  <HStack spacing={2} w="full">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    />
                    <Button
                      onClick={() => validatePromoCode(promoCode)}
                      isDisabled={!promoCode.trim()}
                      bgGradient="linear(45deg, brand.500, purple.500)"
                      color="white"
                      borderRadius="xl"
                      px={6}
                      _hover={{
                        bgGradient: "linear(45deg, brand.600, purple.600)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(194, 24, 91, 0.3)"
                      }}
                      _disabled={{
                        bgGradient: "none",
                        bg: "gray.300",
                        color: "gray.500"
                      }}
                      transition="all 0.2s ease-in-out"
                    >
                      Apply
                    </Button>
                  </HStack>
                  {appliedDiscount > 0 && (
                    <Alert status="success" size="sm">
                      <AlertIcon />
                      <Text fontSize="sm">
                        Discount applied: {formatPrice(appliedDiscount)}
                      </Text>
                    </Alert>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </VStack>

          {/* Order Summary */}
          <VStack spacing={6} align="stretch">
            {/* Appointment Summary */}
            <Card 
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(194, 24, 91, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(194, 24, 91, 0.08)"
            >
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack spacing={3}>
                    <Box
                      w="35px"
                      h="35px"
                      bgGradient="linear(45deg, brand.500, purple.500)"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="0 4px 15px rgba(194, 24, 91, 0.3)"
                    >
                      <Icon as={FaReceipt} color="white" fontSize="lg" />
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
                      Appointment Summary
                    </Heading>
                  </HStack>
                  
                  <VStack spacing={3} align="start" w="full">
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="600">Service:</Text>
                      <Text>{selectedService.name}</Text>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="600">Date:</Text>
                      <Text>
                        {new Date(selectedSchedule.date).toLocaleDateString('en-NG', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Text>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="600">Time:</Text>
                      <Text>{selectedSchedule.timeSlot.time}</Text>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="600">Healthcare Professional:</Text>
                      <Text color="blue.600">To be assigned</Text>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="600">Location:</Text>
                      <Text>{nigerianStates.find(s => s.value === selectedSchedule.address.state)?.label}</Text>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="600">Patient:</Text>
                      <Text>{patientInfo.firstName} {patientInfo.lastName}</Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Price Breakdown */}
            <Card 
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(123, 31, 162, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(123, 31, 162, 0.08)"
            >
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack spacing={3}>
                    <Box
                      w="35px"
                      h="35px"
                      bgGradient="linear(45deg, purple.500, brand.500)"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="0 4px 15px rgba(123, 31, 162, 0.3)"
                    >
                      <Icon as={FaMoneyBillWave} color="white" fontSize="lg" />
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
                      Price Breakdown
                    </Heading>
                  </HStack>
                  
                  <VStack spacing={2} w="full">
                    <HStack justify="space-between" w="full">
                      <Text>Service Fee</Text>
                      <Text>{formatPrice(pricing.servicePrice)}</Text>
                    </HStack>
                    
                    {pricing.emergencyFee && (
                      <HStack justify="space-between" w="full">
                        <Text>Emergency Fee</Text>
                        <Text>{formatPrice(pricing.emergencyFee)}</Text>
                      </HStack>
                    )}
                    
                    {pricing.weekendFee && (
                      <HStack justify="space-between" w="full">
                        <Text>Weekend Fee</Text>
                        <Text>{formatPrice(pricing.weekendFee)}</Text>
                      </HStack>
                    )}
                    
                    <HStack justify="space-between" w="full">
                      <Text>Transport Fee</Text>
                      <Text>{formatPrice(pricing.transportFee)}</Text>
                    </HStack>
                    
                    {pricing.discount && (
                      <HStack justify="space-between" w="full" color="green.500">
                        <Text>Discount</Text>
                        <Text>-{formatPrice(pricing.discount)}</Text>
                      </HStack>
                    )}
                    
                    <HStack justify="space-between" w="full">
                      <Text>VAT (5%)</Text>
                      <Text>{formatPrice(pricing.tax)}</Text>
                    </HStack>
                    
                    <Divider />
                    
                    <HStack justify="space-between" w="full" fontWeight="bold" fontSize="lg">
                      <Text>Total</Text>
                      <Text color="primary.500">{formatPrice(pricing.total)}</Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Security Notice */}
            <Alert status="info">
              <AlertIcon />
              <Box>
                <AlertTitle>Demo Mode - Secure Payment</AlertTitle>
                <AlertDescription fontSize="sm">
                  This is a demo version. In production, your payment will be secured with 256-bit SSL encryption. 
                  We never store your card details. Current simulation has 90% success rate for testing.
                </AlertDescription>
              </Box>
            </Alert>

            {/* Payment Button */}
            <Button
              size="lg"
              bgGradient="linear(45deg, brand.500, purple.500)"
              color="white"
              onClick={selectedPaymentMethod === 'cash' ? handleCashPayment : initiatePayment}
              isLoading={isProcessingPayment}
              loadingText="Processing Payment..."
              leftIcon={selectedPaymentMethod === 'cash' ? <FaMoneyBillWave /> : <FaLock />}
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
              _loading={{
                bgGradient: "linear(45deg, brand.400, purple.400)",
                _hover: { bgGradient: "linear(45deg, brand.400, purple.400)" }
              }}
              transition="all 0.2s ease-in-out"
            >
              {selectedPaymentMethod === 'cash' 
                ? `Confirm Appointment - Pay ${formatPrice(pricing.total)} to Professional`
                : `Pay ${formatPrice(pricing.total)} Now`
              }
            </Button>
          </VStack>
        </SimpleGrid>

        {/* Cash Payment Modal */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Cash Payment Confirmation</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <Alert status="warning">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Cash Payment Selected</AlertTitle>
                    <AlertDescription>
                      You will pay {formatPrice(pricing.total)} directly to the healthcare professional upon arrival.
                    </AlertDescription>
                  </Box>
                </Alert>
                
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Please ensure you have the exact amount ready. The healthcare professional will provide a receipt 
                  upon payment completion.
                </Text>
                
                <HStack spacing={3} w="full">
                  <Button variant="outline" onClick={onClose} flex={1}>
                    Cancel
                  </Button>
                  <Button colorScheme="primary" onClick={confirmCashPayment} flex={1}>
                    Confirm Appointment
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  )
}

export default PaymentIntegration