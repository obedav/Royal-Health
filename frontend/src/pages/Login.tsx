// src/pages/Login.tsx - Enhanced with better error handling and vibrant colors
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Card,
  CardBody,
  useToast,
  Link,
  Checkbox,
  Alert,
  AlertIcon,
  Icon,
  Spinner,
  InputLeftElement,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();

  // Clear error when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isLoading) return;

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🚀 Starting login process...');
      
      // Check if login function exists
      if (!login || typeof login !== 'function') {
        throw new Error('Authentication service is not available');
      }

      const result = await login(email.trim(), password);
      
      if (result?.success) {
        console.log('✅ Login successful');
        
        toast({
          title: 'Welcome back!',
          description: 'Login successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }

        // Navigate to intended destination or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        console.log('🎯 Navigating to:', from);
        navigate(from, { replace: true });
        
      } else {
        // Handle login failure
        const errorMessage = result?.error || 'Invalid email or password';
        console.error('❌ Login failed:', errorMessage);
        setError(errorMessage);
        
        toast({
          title: 'Login Failed',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.statusText) {
        errorMessage = `Network error: ${err.response.statusText}`;
      }
      
      setError(errorMessage);
      
      toast({
        title: 'Login Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Don't render login form if authenticated
  if (isAuthenticated) {
    return (
      <Box 
        bg="gray.50" 
        minH="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text color="gray.600" fontWeight="600">Redirecting...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FCE7F3 0%, #F3E5F5 50%, #C2185B08 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      {/* Background Decorative Elements */}
      <Box
        position="absolute"
        top="15%"
        right="15%"
        w="80px"
        h="80px"
        borderRadius="full"
        bgGradient="linear(45deg, brand.200, purple.200)"
        opacity="0.4"
        filter="blur(30px)"
      />
      <Box
        position="absolute"
        bottom="25%"
        left="10%"
        w="120px"
        h="120px"
        borderRadius="full"
        bgGradient="linear(45deg, purple.200, brand.200)"
        opacity="0.3"
        filter="blur(50px)"
      />

      <Container maxW="md">
        <VStack spacing={8}>
          {/* Header - Enhanced */}
          <VStack spacing={4} textAlign="center">
            <Box
              w="20"
              h="20"
              bgGradient="linear(45deg, brand.500, purple.500)"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              boxShadow="0 8px 25px rgba(194, 24, 91, 0.3)"
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                right: '-4px',
                bottom: '-4px',
                bgGradient: 'linear(45deg, brand.400, purple.400)',
                borderRadius: 'full',
                zIndex: -1,
                opacity: 0.3,
              }}
            >
              <Icon as={FaUserCircle} color="white" fontSize="2xl" />
            </Box>

            <VStack spacing={2}>
              <Text 
                fontSize="3xl" 
                fontWeight="900" 
                bgGradient="linear(45deg, brand.500, purple.500)"
                bgClip="text"
                sx={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                letterSpacing="tight"
              >
                ROYAL HEALTH
              </Text>
              <Text 
                fontSize="md" 
                color="brand.600" 
                fontWeight="700"
                letterSpacing="wide"
              >
                CONSULT
              </Text>
            </VStack>

            <Heading size="xl" color="gray.800" fontWeight="800">
              Welcome Back
            </Heading>
            <Text color="gray.600" fontSize="lg" fontWeight="500">
              Sign in to your account to continue
            </Text>
          </VStack>

          {/* Login Card - Enhanced */}
          <Card 
            w="full" 
            boxShadow="0 25px 50px rgba(194, 24, 91, 0.15)" 
            borderRadius="3xl" 
            border="2px solid" 
            borderColor="brand.100"
            bg="white"
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              bgGradient: 'linear(90deg, brand.500, purple.500)',
              borderTopRadius: '3xl',
            }}
          >
            <CardBody p={10}>
              <form onSubmit={handleSubmit} noValidate>
                <VStack spacing={6}>
                  {/* Error Alert - Enhanced */}
                  {error && (
                    <Alert 
                      status="error" 
                      borderRadius="xl"
                      border="2px solid"
                      borderColor="red.300"
                      boxShadow="0 4px 15px rgba(220, 38, 38, 0.1)"
                      bg="red.50"
                    >
                      <AlertIcon />
                      <Text fontSize="sm" fontWeight="600">{error}</Text>
                    </Alert>
                  )}

                  {/* Email Field - Enhanced */}
                  <FormControl isRequired isInvalid={!!error && error.includes('email')}>
                    <FormLabel color="gray.700" fontWeight="700" fontSize="md">
                      Email Address
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FaEnvelope} color="brand.500" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email address"
                        size="lg"
                        bg="white"
                        borderColor="gray.300"
                        borderWidth="2px"
                        borderRadius="xl"
                        fontWeight="500"
                        _hover={{ borderColor: 'brand.400' }}
                        _focus={{ 
                          borderColor: 'brand.500', 
                          boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' 
                        }}
                        autoComplete="email"
                        disabled={isLoading}
                      />
                    </InputGroup>
                  </FormControl>

                  {/* Password Field - Enhanced */}
                  <FormControl isRequired isInvalid={!!error && error.includes('password')}>
                    <FormLabel color="gray.700" fontWeight="700" fontSize="md">
                      Password
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FaLock} color="brand.500" />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                        size="lg"
                        bg="white"
                        borderColor="gray.300"
                        borderWidth="2px"
                        borderRadius="xl"
                        fontWeight="500"
                        _hover={{ borderColor: 'brand.400' }}
                        _focus={{ 
                          borderColor: 'brand.500', 
                          boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' 
                        }}
                        autoComplete="current-password"
                        disabled={isLoading}
                      />
                      <InputRightElement height="100%">
                        <Button
                          variant="ghost"
                          onClick={togglePasswordVisibility}
                          size="sm"
                          color="brand.500"
                          _hover={{ color: 'brand.700', bg: 'brand.50' }}
                          tabIndex={-1}
                          disabled={isLoading}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          <Icon as={showPassword ? FaEyeSlash : FaEye} />
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  {/* Remember Me & Forgot Password - Enhanced */}
                  <HStack justify="space-between" w="full">
                    <Checkbox
                      isChecked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      colorScheme="brand"
                      size="lg"
                      disabled={isLoading}
                      iconColor="white"
                    >
                      <Text fontSize="sm" color="gray.600" fontWeight="600">
                        Remember me
                      </Text>
                    </Checkbox>
                    
                    <Link
                      as={RouterLink}
                      to="/forgot-password"
                      color="brand.600"
                      fontSize="sm"
                      fontWeight="700"
                      _hover={{ 
                        textDecoration: 'underline',
                        color: 'brand.700'
                      }}
                      tabIndex={isLoading ? -1 : undefined}
                    >
                      Forgot password?
                    </Link>
                  </HStack>

                  {/* Login Button - Enhanced */}
                  <Button
                    type="submit"
                    bgGradient="linear(45deg, brand.500, purple.500)"
                    color="white"
                    size="lg"
                    w="full"
                    isLoading={isLoading}
                    loadingText="Signing in..."
                    borderRadius="xl"
                    py={7}
                    fontSize="lg"
                    fontWeight="800"
                    boxShadow="0 8px 25px rgba(194, 24, 91, 0.25)"
                    isDisabled={!email.trim() || !password.trim() || isLoading}
                    _hover={{
                      bgGradient: "linear(45deg, brand.600, purple.600)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 35px rgba(194, 24, 91, 0.35)"
                    }}
                    _active={{
                      transform: "translateY(0)"
                    }}
                    _disabled={{
                      opacity: 0.6,
                      cursor: 'not-allowed',
                      transform: 'none',
                      _hover: {
                        transform: 'none'
                      }
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    Sign In
                  </Button>

                  {/* Footer Links - Enhanced */}
                  <VStack spacing={4} pt={4}>
                    <Text color="gray.600" fontSize="md" textAlign="center" fontWeight="500">
                      Don't have an account?{' '}
                      <Link
                        as={RouterLink}
                        to="/register"
                        color="brand.600"
                        fontWeight="800"
                        textDecoration="none"
                        _hover={{ 
                          textDecoration: 'underline',
                          color: 'brand.700'
                        }}
                        tabIndex={isLoading ? -1 : undefined}
                      >
                        Create an account
                      </Link>
                    </Text>

                    <Text color="gray.500" fontSize="xs" textAlign="center" fontWeight="500">
                      By signing in, you agree to our{' '}
                      <Link
                        as={RouterLink}
                        to="/terms"
                        color="brand.600"
                        fontWeight="700"
                        _hover={{ 
                          textDecoration: 'underline',
                          color: 'brand.700'
                        }}
                        tabIndex={isLoading ? -1 : undefined}
                      >
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link
                        as={RouterLink}
                        to="/privacy"
                        color="brand.600"
                        fontWeight="700"
                        _hover={{ 
                          textDecoration: 'underline',
                          color: 'brand.700'
                        }}
                        tabIndex={isLoading ? -1 : undefined}
                      >
                        Privacy Policy
                      </Link>
                    </Text>

                    {/* Demo Credentials Info - Enhanced */}
                    <Box 
                      bgGradient="linear(135deg, blue.50, blue.25)" 
                      p={5} 
                      borderRadius="xl" 
                      textAlign="center"
                      w="full"
                      border="2px solid"
                      borderColor="blue.300"
                      boxShadow="0 4px 15px rgba(59, 130, 246, 0.1)"
                    >
                      <Text fontSize="sm" fontWeight="800" color="blue.700" mb={2}>
                        Demo Test Account
                      </Text>
                      <VStack spacing={1}>
                        <Text fontSize="sm" color="blue.600" fontWeight="600">
                          Email: fresh.new@royalhealth.ng
                        </Text>
                        <Text fontSize="sm" color="blue.600" fontWeight="600">
                          Password: testpassword123
                        </Text>
                      </VStack>
                    </Box>
                  </VStack>
                </VStack>
              </form>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </div>
  );
};

export default Login;