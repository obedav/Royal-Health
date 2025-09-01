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
import { ASSESSMENT_PRICE } from '../../constants/assessments'

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

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('bank_transfer')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [selectedGateway, setSelectedGateway] = useState<'flutterwave' | 'paystack'>('flutterwave')
  const [promoCode, setPromoCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)

  // Simple fixed pricing - no breakdown needed
  const calculatePricing = (): PricingBreakdown => {
    // Fixed price for all assessments
    const basePrice = ASSESSMENT_PRICE
    
    // Discount from promo code (if any)
    const discount = appliedDiscount
    
    // Final total (just the fixed price minus any discount)
    const total = basePrice - discount

    return {
      servicePrice: basePrice,
      emergencyFee: undefined,
      weekendFee: undefined,
      transportFee: 0,
      discount: discount > 0 ? discount : undefined,
      tax: 0,
      total
    }
  }

  // Transport fee calculation removed - fixed pricing now

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
      const discount = ASSESSMENT_PRICE * promoCodes[code.toUpperCase()]
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

  const confirmBankTransfer = () => {
    const paymentResult: PaymentResult = {
      transactionId: `BANK-${Date.now()}`,
      reference: `RHC-BANK-${Date.now()}`,
      amount: pricing.total,
      method: 'bank_transfer',
      status: 'pending',
      gateway: 'flutterwave', // Default gateway for record keeping
      paidAt: new Date().toISOString(),
    }
    
    toast({
      title: 'Appointment Confirmed!',
      description: 'Your appointment is scheduled. Please complete the bank transfer to secure your slot.',
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
            {/* Payment Gateway Selection - Temporarily disabled */}

            {/* Payment Methods - Temporarily Simplified */}
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
                      <Icon as={FaUniversity} color="white" fontSize="lg" />
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
                      <Radio value="bank_transfer" colorScheme="green" size="lg">
                        <HStack spacing={3}>
                          <Icon as={FaUniversity} color="green.500" />
                          <VStack spacing={0} align="start">
                            <Text fontWeight="600">Bank Transfer</Text>
                            <Text fontSize="xs" color="gray.500">
                              Transfer to our bank account
                            </Text>
                          </VStack>
                        </HStack>
                      </Radio>
                    </Stack>
                  </RadioGroup>

                  {/* Bank Account Details */}
                  {selectedPaymentMethod === 'bank_transfer' && (
                    <Card 
                      bg="rgba(34, 197, 94, 0.05)"
                      borderColor="rgba(34, 197, 94, 0.2)"
                      borderWidth="2px"
                      borderRadius="xl"
                      boxShadow="0 4px 15px rgba(34, 197, 94, 0.1)"
                    >
                      <CardBody p={6}>
                        <VStack spacing={4} align="start">
                          <HStack spacing={3}>
                            <Box
                              w="30px"
                              h="30px"
                              bgGradient="linear(45deg, green.500, emerald.500)"
                              borderRadius="lg"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Icon as={FaUniversity} color="white" fontSize="sm" />
                            </Box>
                            <Heading 
                              size="sm"
                              bgGradient="linear(45deg, green.600, emerald.600)"
                              bgClip="text"
                              sx={{
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                              }}
                              fontWeight="700"
                            >
                              Bank Account Details
                            </Heading>
                          </HStack>

                          <VStack spacing={3} w="full" align="start">
                            <HStack justify="space-between" w="full">
                              <Text fontWeight="600" color="gray.700">Bank Name:</Text>
                              <Text fontWeight="500">First Bank of Nigeria</Text>
                            </HStack>
                            
                            <HStack justify="space-between" w="full">
                              <Text fontWeight="600" color="gray.700">Account Name:</Text>
                              <Text fontWeight="500">Royal Health Consult Ltd</Text>
                            </HStack>
                            
                            <HStack justify="space-between" w="full">
                              <Text fontWeight="600" color="gray.700">Account Number:</Text>
                              <HStack spacing={2}>
                                <Text fontWeight="700" fontSize="lg" color="green.600">3085649127</Text>
                                <Button
                                  size="xs"
                                  colorScheme="green"
                                  variant="outline"
                                  onClick={() => {
                                    navigator.clipboard.writeText('3085649127')
                                    toast({
                                      title: 'Copied!',
                                      description: 'Account number copied to clipboard',
                                      status: 'success',
                                      duration: 2000,
                                    })
                                  }}
                                >
                                  Copy
                                </Button>
                              </HStack>
                            </HStack>

                            <HStack justify="space-between" w="full">
                              <Text fontWeight="600" color="gray.700">Amount:</Text>
                              <Text fontWeight="700" fontSize="lg" color="green.600">{formatPrice(ASSESSMENT_PRICE)}</Text>
                            </HStack>
                          </VStack>

                          <Alert status="info" size="sm" borderRadius="lg">
                            <AlertIcon />
                            <Box fontSize="sm">
                              <AlertTitle fontSize="sm">Payment Instructions</AlertTitle>
                              <AlertDescription>
                                <VStack spacing={1} align="start" mt={2}>
                                  <Text>• Transfer exactly {formatPrice(ASSESSMENT_PRICE)} to the account above</Text>
                                  <Text>• Use your full name as reference</Text>
                                  <Text>• Take a screenshot of your transfer receipt</Text>
                                  <Text>• Keep your receipt for confirmation</Text>
                                </VStack>
                              </AlertDescription>
                            </Box>
                          </Alert>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}
                  
                  {/* Info about other payment methods */}
                  <Alert status="warning" borderRadius="lg">
                    <AlertIcon />
                    <Box>
                      <AlertTitle fontSize="sm">Other Payment Methods Coming Soon</AlertTitle>
                      <AlertDescription fontSize="sm">
                        We're working on adding more payment options including card payments, mobile money, and USSD. 
                        All health assessments have a fixed price of {formatPrice(ASSESSMENT_PRICE)}.
                      </AlertDescription>
                    </Box>
                  </Alert>
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

            {/* Simple Price Display */}
            <Card 
              bg="rgba(255, 255, 255, 0.85)"
              backdropFilter="blur(15px)"
              borderColor="rgba(123, 31, 162, 0.2)"
              borderWidth="2px"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(123, 31, 162, 0.08)"
            >
              <CardBody p={8}>
                <VStack spacing={6} align="center">
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
                      Assessment Fee
                    </Heading>
                  </HStack>
                  
                  <VStack spacing={3} align="center">
                    <Text fontSize="3xl" fontWeight="900" color="green.600">
                      ₦15,000
                    </Text>
                    <Text fontSize="md" color="gray.600" textAlign="center">
                      Fixed price for all health assessments
                    </Text>
                    <Badge 
                      colorScheme="green" 
                      px={3} 
                      py={1} 
                      borderRadius="full"
                      fontSize="sm"
                    >
                      No Hidden Charges
                    </Badge>
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
              onClick={() => onOpen()}
              isLoading={isProcessingPayment}
              loadingText="Confirming Appointment..."
              leftIcon={<FaUniversity />}
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
              Proceed with Bank Transfer
            </Button>
          </VStack>
        </SimpleGrid>

        {/* Bank Transfer Confirmation Modal */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent maxW="lg">
            <ModalHeader>
              <HStack spacing={3}>
                <Icon as={FaUniversity} color="green.500" />
                <Text>Bank Transfer Confirmation</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <Alert status="success" borderRadius="lg">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Ready to Proceed</AlertTitle>
                    <AlertDescription>
                      Your health assessment appointment will be confirmed once you complete the bank transfer of {formatPrice(ASSESSMENT_PRICE)}.
                    </AlertDescription>
                  </Box>
                </Alert>

                {/* Quick Bank Details Recap */}
                <Card bg="gray.50" borderRadius="lg" w="full">
                  <CardBody p={4}>
                    <VStack spacing={2} align="start">
                      <Text fontWeight="700" fontSize="sm" color="gray.800">Quick Reference:</Text>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">Bank:</Text>
                        <Text fontSize="sm" fontWeight="600">First Bank of Nigeria</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">Account:</Text>
                        <Text fontSize="sm" fontWeight="600">3085649127</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">Amount:</Text>
                        <Text fontSize="sm" fontWeight="700" color="green.600">{formatPrice(ASSESSMENT_PRICE)}</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  After making the transfer, please keep your receipt safe. Our team will verify your payment and 
                  confirm your appointment within 2 hours during business hours.
                </Text>
                
                <HStack spacing={3} w="full">
                  <Button variant="outline" onClick={onClose} flex={1} borderRadius="lg">
                    Go Back
                  </Button>
                  <Button 
                    bgGradient="linear(45deg, green.500, emerald.500)"
                    color="white"
                    onClick={confirmBankTransfer} 
                    flex={1}
                    borderRadius="lg"
                    _hover={{
                      bgGradient: "linear(45deg, green.600, emerald.600)",
                    }}
                    leftIcon={<FaCheckCircle />}
                  >
                    I Understand, Proceed
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