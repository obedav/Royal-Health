// src/pages/Login.tsx - Updated with Supabase authentication
import { useState } from 'react';
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
import { supabase } from '../lib/supabaseClient';
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
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    // Call your backend login endpoint
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Login failed');
    }

    const data = await response.json();

    // Save tokens in localStorage/sessionStorage
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    // Optionally save user info
    localStorage.setItem('user', JSON.stringify(data.user));

    toast({
      title: 'Login Successful',
      description: 'Welcome back!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });

  } catch (err: any) {
    console.error('Login error:', err);
    setError(err.message || 'Network error. Please try again.');
    toast({
      title: 'Login Failed',
      description: err.message || 'Unable to connect to the server',
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
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  {error && (
                    <Alert status="error" borderRadius="lg">
                      <AlertIcon />
                      <Text fontSize="sm">{error}</Text>
                    </Alert>
                  )}

                  {/* Email Field */}
                  <FormControl isRequired>
                    <FormLabel color="gray.700" fontWeight="medium" fontSize="sm">
                      Email Address
                    </FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    />
                  </FormControl>

                  {/* Password Field */}
                  <FormControl isRequired>
                    <FormLabel color="gray.700" fontWeight="medium" fontSize="sm">
                      Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                      />
                      <InputRightElement height="100%">
                        <Button
                          variant="ghost"
                          onClick={togglePasswordVisibility}
                          size="sm"
                          color="gray.500"
                          _hover={{ color: 'gray.700' }}
                          tabIndex={-1}
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
                    isDisabled={!email || !password}
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
                      >
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link
                        as={RouterLink}
                        to="/privacy"
                        color="primary.600"
                        _hover={{ textDecoration: 'underline' }}
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
                    >
                      <Text fontSize="xs" fontWeight="bold" color="blue.700" mb={1}>
                        Demo Test Account
                      </Text>
                      <Text fontSize="xs" color="blue.600">
                        Email: john.doe@royalhealth.ng
                      </Text>
                      <Text fontSize="xs" color="blue.600">
                        Password: SecurePassword123!
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