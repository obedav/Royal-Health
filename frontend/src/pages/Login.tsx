// src/pages/Login.tsx - Enhanced with better error handling
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
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
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
      <Box bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
          <Text color="gray.600">Redirecting...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" py={12}>
      <Container maxW="md">
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Box>
              <Text fontSize="3xl" fontWeight="bold" color="primary.600">
                ROYAL HEALTH
              </Text>
              <Text fontSize="md" color="primary.500" fontWeight="medium">
                CONSULT
              </Text>
            </Box>
            <Heading size="xl" color="gray.700">
              Welcome Back
            </Heading>
            <Text color="gray.600">
              Sign in to your account to continue
            </Text>
          </VStack>

          {/* Login Card */}
          <Card w="full" shadow="xl" borderRadius="xl" border="1px solid" borderColor="gray.200">
            <CardBody p={8}>
              <form onSubmit={handleSubmit} noValidate>
                <VStack spacing={6}>
                  {error && (
                    <Alert status="error" borderRadius="lg">
                      <AlertIcon />
                      <Text fontSize="sm">{error}</Text>
                    </Alert>
                  )}

                  {/* Email Field */}
                  <FormControl isRequired isInvalid={!!error && error.includes('email')}>
                    <FormLabel color="gray.700" fontWeight="medium" fontSize="sm">
                      Email Address
                    </FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email address"
                      size="lg"
                      bg="white"
                      borderColor="gray.300"
                      borderRadius="lg"
                      _hover={{ borderColor: 'primary.400' }}
                      _focus={{ 
                        borderColor: 'primary.500', 
                        boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)' 
                      }}
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </FormControl>

                  {/* Password Field */}
                  <FormControl isRequired isInvalid={!!error && error.includes('password')}>
                    <FormLabel color="gray.700" fontWeight="medium" fontSize="sm">
                      Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                        size="lg"
                        bg="white"
                        borderColor="gray.300"
                        borderRadius="lg"
                        _hover={{ borderColor: 'primary.400' }}
                        _focus={{ 
                          borderColor: 'primary.500', 
                          boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)' 
                        }}
                        autoComplete="current-password"
                        disabled={isLoading}
                      />
                      <InputRightElement height="100%">
                        <Button
                          variant="ghost"
                          onClick={togglePasswordVisibility}
                          size="sm"
                          color="gray.500"
                          _hover={{ color: 'gray.700' }}
                          tabIndex={-1}
                          disabled={isLoading}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          <Icon as={showPassword ? FaEyeSlash : FaEye} />
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  {/* Remember Me & Forgot Password */}
                  <HStack justify="space-between" w="full">
                    <Checkbox
                      isChecked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      colorScheme="primary"
                      size="md"
                      disabled={isLoading}
                    >
                      <Text fontSize="sm" color="gray.600">
                        Remember me
                      </Text>
                    </Checkbox>
                    
                    <Link
                      as={RouterLink}
                      to="/forgot-password"
                      color="primary.600"
                      fontSize="sm"
                      fontWeight="medium"
                      _hover={{ 
                        textDecoration: 'underline',
                        color: 'primary.700'
                      }}
                      tabIndex={isLoading ? -1 : undefined}
                    >
                      Forgot password?
                    </Link>
                  </HStack>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    colorScheme="primary"
                    size="lg"
                    w="full"
                    isLoading={isLoading}
                    loadingText="Signing in..."
                    borderRadius="lg"
                    py={6}
                    fontSize="md"
                    fontWeight="semibold"
                    isDisabled={!email.trim() || !password.trim() || isLoading}
                  >
                    Sign In
                  </Button>

                  {/* Footer Links */}
                  <VStack spacing={3} pt={4}>
                    <Text color="gray.600" fontSize="sm" textAlign="center">
                      Don't have an account?{' '}
                      <Link
                        as={RouterLink}
                        to="/register"
                        color="primary.600"
                        fontWeight="semibold"
                        _hover={{ 
                          textDecoration: 'underline',
                          color: 'primary.700'
                        }}
                        tabIndex={isLoading ? -1 : undefined}
                      >
                        Create an account
                      </Link>
                    </Text>

                    <Text color="gray.500" fontSize="xs" textAlign="center">
                      By signing in, you agree to our{' '}
                      <Link
                        as={RouterLink}
                        to="/terms"
                        color="primary.600"
                        _hover={{ textDecoration: 'underline' }}
                        tabIndex={isLoading ? -1 : undefined}
                      >
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link
                        as={RouterLink}
                        to="/privacy"
                        color="primary.600"
                        _hover={{ textDecoration: 'underline' }}
                        tabIndex={isLoading ? -1 : undefined}
                      >
                        Privacy Policy
                      </Link>
                    </Text>

                    {/* Demo Credentials Info */}
                    <Box 
                      bg="blue.50" 
                      p={4} 
                      borderRadius="lg" 
                      textAlign="center"
                      w="full"
                      border="1px solid"
                      borderColor="blue.200"
                    >
                      <Text fontSize="xs" fontWeight="bold" color="blue.700" mb={1}>
                        Demo Test Account
                      </Text>
                      <Text fontSize="xs" color="blue.600">
                        Email: fresh.new@royalhealth.ng
                      </Text>
                      <Text fontSize="xs" color="blue.600">
                        Password: testpassword123
                      </Text>
                    </Box>
                  </VStack>
                </VStack>
              </form>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;