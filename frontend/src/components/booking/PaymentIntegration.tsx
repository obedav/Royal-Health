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
import { BookingService } from '../../types/booking.types'
import { ScheduleData } from './AppointmentScheduling'
import { PatientInformation } from './PatientInformationForm'

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
      'Lagos': 2000,
      'Abuja': 3000,
      'Kano': 2500,
      'Rivers': 2500,
      'Oyo': 2000,
      'Kaduna': 2500,
      'Ogun': 1500,
      'Ondo': 2000,
      'Osun': 2000,
      'Delta': 2500,
      'Anambra': 2500,
      'Imo': 2500,
      'Enugu': 2500,
      'Edo': 2000,
      'Plateau': 3000,
    }
    return transportFees[state] || 3000 // Default for other states
  }

  const pricing = calculatePricing()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

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
        <VStack spacing={4} textAlign="center">
          <Heading size="lg" color="gray.800">
            Payment & Confirmation
          </Heading>
          <Text color="gray.600">
            Complete your payment to confirm your healthcare appointment
          </Text>
          
          {/* Demo Notice */}
          <Alert status="warning" maxW="600px">
            <AlertIcon />
            <Box>
              <AlertTitle fontSize="sm">Demo Mode</AlertTitle>
              <AlertDescription fontSize="sm">
                This is a development demo. No real payments will be processed. 
                The system simulates payment flows for testing purposes.
              </AlertDescription>
            </Box>
          </Alert>
        </VStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Payment Methods */}
          <VStack spacing={6} align="stretch">
            {/* Payment Gateway Selection */}
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <Heading size="md">Choose Payment Gateway</Heading>
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
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <Heading size="md">Payment Method</Heading>
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
                              Pay nurse directly
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
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <HStack spacing={2}>
                    <Icon as={FaGift} color="pink.500" />
                    <Heading size="md">Promo Code</Heading>
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
                      colorScheme="primary"
                      variant="outline"
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
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <Heading size="md">Appointment Summary</Heading>
                  
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
                      <Text fontWeight="600">Nurse:</Text>
                      <Text>{selectedSchedule.nurse.name}</Text>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="600">Location:</Text>
                      <Text>{selectedSchedule.address.state}</Text>
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
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <Heading size="md">Price Breakdown</Heading>
                  
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
              colorScheme="primary"
              onClick={selectedPaymentMethod === 'cash' ? handleCashPayment : initiatePayment}
              isLoading={isProcessingPayment}
              loadingText="Processing Payment..."
              leftIcon={selectedPaymentMethod === 'cash' ? <FaMoneyBillWave /> : <FaLock />}
              w="full"
              py={6}
            >
              {selectedPaymentMethod === 'cash' 
                ? `Confirm Appointment - Pay ${formatPrice(pricing.total)} to Nurse`
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
                      You will pay {formatPrice(pricing.total)} directly to the nurse upon arrival.
                    </AlertDescription>
                  </Box>
                </Alert>
                
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Please ensure you have the exact amount ready. The nurse will provide a receipt 
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