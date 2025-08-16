// src/pages/Login.tsx - Updated with proper navigation
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (success) {
      // Get intended destination or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      setError('Login failed. Please check your credentials.');
    }
    
    setIsLoading(false);
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